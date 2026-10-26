import React, { useState, useRef } from 'react';
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES } from '../../lib/storage';

export interface UploadResult {
  url: string;
  path: string;
  width?: number;
  height?: number;
  size: number;
  mimeType: string;
}

interface MediaUploaderProps {
  onUploadComplete?: (result: UploadResult) => void;
  folder?: string;
}

export default function MediaUploader({ onUploadComplete, folder = 'general' }: MediaUploaderProps) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ url: string; width?: number; height?: number } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = async (file: File) => {
    setError(null);
    setSuccess(null);
    setPreview(null);

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      setError(`Invalid file type "${file.type}". Allowed formats: PNG, JPEG, WebP, SVG.`);
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError(`File size exceeds the 5MB maximum limit.`);
      return;
    }

    // Extract image dimensions client-side if image
    let dimensions: { width?: number; height?: number } = {};
    if (file.type.startsWith('image/') && file.type !== 'image/svg+xml') {
      try {
        const objectUrl = URL.createObjectURL(file);
        dimensions = await new Promise<{ width?: number; height?: number }>((resolve) => {
          const img = new Image();
          img.onload = () => {
            resolve({ width: img.naturalWidth, height: img.naturalHeight });
            URL.revokeObjectURL(objectUrl);
          };
          img.onerror = () => {
            resolve({});
            URL.revokeObjectURL(objectUrl);
          };
          img.src = objectUrl;
        });
      } catch {
        // Fallback gracefully
      }
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Upload failed');
      } else {
        const fullResult: UploadResult = {
          ...data,
          width: dimensions.width,
          height: dimensions.height,
        };
        setSuccess('File uploaded successfully!');
        setPreview({ url: data.url, width: dimensions.width, height: dimensions.height });
        if (onUploadComplete) {
          onUploadComplete(fullResult);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Network upload error');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-4 bg-rose-500/10 text-rose-300 rounded-2xl text-xs font-medium flex items-center justify-between">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="w-6 h-6 flex items-center justify-center text-rose-400 hover:text-white"
          >
            &times;
          </button>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-500/10 text-emerald-300 rounded-2xl text-xs font-medium flex items-center justify-between">
          <span>{success}</span>
          <button
            type="button"
            onClick={() => setSuccess(null)}
            className="w-6 h-6 flex items-center justify-center text-emerald-400 hover:text-white"
          >
            &times;
          </button>
        </div>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`p-8 md:p-12 rounded-3xl text-center transition-all flex flex-col items-center justify-center gap-4 cursor-pointer ${
          dragOver
            ? 'bg-[#6c3cff]/15 ring-2 ring-[#6c3cff]'
            : 'bg-white/[0.03] hover:bg-white/[0.05] ring-1 ring-white/10 hover:ring-white/20'
        }`}
      >
        <div className="w-14 h-14 rounded-2xl bg-[#6c3cff]/15 text-[#6c3cff] flex items-center justify-center">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>

        <div>
          <p className="text-sm font-medium text-white">
            Drag and drop an image here, or{' '}
            <span className="text-[#a78bfa] underline underline-offset-2 font-semibold">
              browse
            </span>
          </p>
          <p className="text-xs text-[#5d5a67] mt-1.5">PNG, JPEG, WebP, or SVG up to 5MB</p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={ALLOWED_MIME_TYPES.join(',')}
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFileProcess(e.target.files[0]);
            }
          }}
        />

        {uploading && (
          <div className="flex items-center gap-2 text-xs text-[#a78bfa] mt-2 font-medium">
            <svg className="animate-spin w-4 h-4 text-[#6c3cff]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <span>Uploading asset...</span>
          </div>
        )}
      </div>

      {preview && (
        <div className="p-4 bg-[#18171f] rounded-2xl flex items-center gap-4 shadow-lg">
          <img
            src={preview.url}
            alt="Uploaded preview"
            className="w-16 h-16 rounded-xl object-cover bg-white/[0.04] flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white">Latest Upload:</p>
            <input
              type="text"
              readOnly
              value={preview.url}
              onClick={(e) => (e.target as HTMLInputElement).select()}
              className="w-full mt-1.5 px-3 py-2 text-xs font-mono bg-white/[0.04] rounded-xl text-[#aaa7b4] ring-1 ring-white/10 cursor-pointer select-all outline-none focus:ring-2 focus:ring-[#6c3cff]"
            />
            {preview.width && preview.height && (
              <p className="text-xs text-[#5d5a67] mt-1">
                Intrinsic dimensions: {preview.width} &times; {preview.height}px
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
