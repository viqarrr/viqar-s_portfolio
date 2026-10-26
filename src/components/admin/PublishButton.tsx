import React, { useState } from 'react';
import { Button } from './ui/Button';

export default function PublishButton() {
  const [publishing, setPublishing] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [lastPublished, setLastPublished] = useState<string | null>(null);

  const handlePublish = async () => {
    if (!confirm('Rebuild live static site with current published changes?')) {
      return;
    }

    setPublishing(true);
    setStatusMsg(null);
    setIsError(false);

    try {
      const res = await fetch('/api/admin/publish', {
        method: 'POST',
      });

      const data = await res.json();
      if (!res.ok) {
        setIsError(true);
        setStatusMsg(data.error || 'Failed to trigger deploy');
      } else {
        setIsError(false);
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setStatusMsg(data.mocked ? `Simulated rebuild at ${timeStr}` : `Build triggered at ${timeStr}`);
        setLastPublished(timeStr);
        setTimeout(() => setStatusMsg(null), 4000);
      }
    } catch (err: any) {
      setIsError(true);
      setStatusMsg(err.message || 'Network error');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {statusMsg && (
        <span
          className={`text-xs px-3 py-1 rounded-full font-medium ${
            isError
              ? 'bg-red-500/15 text-red-300'
              : 'bg-emerald-500/15 text-emerald-300'
          }`}
        >
          {statusMsg}
        </span>
      )}

      <Button
        type="button"
        size="sm"
        variant="primary"
        loading={publishing}
        onClick={handlePublish}
        title={lastPublished ? `Last published at ${lastPublished}` : 'Publish changes to live site'}
        className="bg-[#6c3cff] hover:bg-[#5a2de0] shadow-sm text-xs font-semibold rounded-xl min-h-[44px] px-4"
      >
        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        Publish Site
      </Button>
    </div>
  );
}
