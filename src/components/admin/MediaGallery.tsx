import React, { useEffect, useState } from 'react';
import MediaUploader from './MediaUploader';
import { Button } from './ui/Button';

interface StorageObject {
  name: string;
  id?: string;
  path: string;
  publicUrl: string;
  metadata?: {
    size?: number;
    mimetype?: string;
  };
}

export default function MediaGallery() {
  const [files, setFiles] = useState<StorageObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/upload');
      if (res.ok) {
        const data = await res.json();
        setFiles(data.files || []);
      }
    } catch (err) {
      console.error('Failed to fetch media assets', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleDelete = async (path: string) => {
    if (!confirm('Are you sure you want to permanently delete this media file?')) return;
    try {
      const res = await fetch(`/api/admin/upload?path=${encodeURIComponent(path)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setFiles((prev) => prev.filter((f) => f.path !== path));
      }
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedPath(url);
    setTimeout(() => setCopiedPath(null), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Upload Zone */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
          Upload New Asset
        </h3>
        <MediaUploader onUploadComplete={() => fetchFiles()} />
      </div>

      {/* Asset Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
            Uploaded Assets ({files.length})
          </h3>
          <Button size="sm" variant="secondary" onClick={fetchFiles} disabled={loading}>
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Loading media files...</div>
        ) : files.length === 0 ? (
          <div className="p-8 text-center bg-slate-900 border border-dashed border-slate-800 rounded-xl text-slate-500 text-sm">
            No media files found in the storage bucket. Upload your first asset above.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {files.map((file) => (
              <div
                key={file.path}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl overflow-hidden group flex flex-col justify-between"
              >
                <div className="h-32 bg-slate-950 flex items-center justify-center p-2 relative overflow-hidden">
                  <img
                    src={file.publicUrl}
                    alt={file.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="p-3 border-t border-slate-800/80 space-y-2">
                  <p className="text-xs font-medium text-white truncate" title={file.name}>
                    {file.name}
                  </p>
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => copyUrl(file.publicUrl)}
                      className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                    >
                      {copiedPath === file.publicUrl ? 'Copied!' : 'Copy URL'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(file.path)}
                      className="text-xs text-red-400 hover:text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
