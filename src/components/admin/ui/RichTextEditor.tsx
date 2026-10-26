import React, { useRef, useEffect, useState, useCallback } from 'react';

interface RichTextEditorProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
}

export function RichTextEditor({
  label,
  value,
  onChange,
  error,
  placeholder = 'Write project description here...',
  required,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const isInternalChangeRef = useRef(false);

  // Sync external value changes into the contentEditable div when not editing internally
  useEffect(() => {
    if (editorRef.current && !isInternalChangeRef.current) {
      if (editorRef.current.innerHTML !== (value || '')) {
        editorRef.current.innerHTML = value || '';
      }
    }
    isInternalChangeRef.current = false;
  }, [value, isHtmlMode]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      isInternalChangeRef.current = true;
      const html = editorRef.current.innerHTML;
      onChange(html === '<br>' || html === '<p><br></p>' ? '' : html);
    }
  }, [onChange]);

  const exec = useCallback((command: string, arg: string | undefined = undefined) => {
    document.execCommand(command, false, arg);
    handleInput();
    if (editorRef.current) {
      editorRef.current.focus();
    }
  }, [handleInput]);

  const addLink = useCallback(() => {
    const url = prompt('Enter link URL (e.g. https://...):');
    if (url) {
      exec('createLink', url);
    }
  }, [exec]);

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-semibold text-[#aaa7b4] uppercase tracking-wider">
          {label} {required && <span className="text-[#f6db00]">*</span>}
        </label>
      )}

      <div className={`rounded-[14px] bg-[#0d0c11] border transition-all ${
        error ? 'border-rose-500/50' : 'border-white/10 focus-within:border-[#f6db00]/60 focus-within:ring-1 focus-within:ring-[#f6db00]/60'
      }`}>
        {/* Formatting Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 px-3 py-2 bg-[#18171f] border-b border-white/[0.08] rounded-t-[14px]">
          <div className="flex flex-wrap items-center gap-1">
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); exec('bold'); }}
              disabled={isHtmlMode}
              title="Bold (Ctrl+B)"
              className="px-2.5 py-1.5 text-xs font-bold rounded-lg text-[#aaa7b4] hover:text-white hover:bg-white/[0.08] disabled:opacity-40 transition-colors"
            >
              B
            </button>

            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); exec('italic'); }}
              disabled={isHtmlMode}
              title="Italic (Ctrl+I)"
              className="px-2.5 py-1.5 text-xs font-serif italic rounded-lg text-[#aaa7b4] hover:text-white hover:bg-white/[0.08] disabled:opacity-40 transition-colors"
            >
              I
            </button>

            <div className="h-4 w-[1px] bg-white/10 mx-1" />

            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); exec('insertUnorderedList'); }}
              disabled={isHtmlMode}
              title="Bullet List"
              className="px-2.5 py-1.5 text-xs rounded-lg text-[#aaa7b4] hover:text-white hover:bg-white/[0.08] disabled:opacity-40 flex items-center gap-1 transition-colors"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <circle cx="4" cy="6" r="1.5" fill="currentColor"></circle>
                <circle cx="4" cy="12" r="1.5" fill="currentColor"></circle>
                <circle cx="4" cy="18" r="1.5" fill="currentColor"></circle>
              </svg>
              <span>Bullets</span>
            </button>

            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); exec('insertOrderedList'); }}
              disabled={isHtmlMode}
              title="Numbered List"
              className="px-2.5 py-1.5 text-xs rounded-lg text-[#aaa7b4] hover:text-white hover:bg-white/[0.08] disabled:opacity-40 flex items-center gap-1 transition-colors"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="10" y1="6" x2="21" y2="6"></line>
                <line x1="10" y1="12" x2="21" y2="12"></line>
                <line x1="10" y1="18" x2="21" y2="18"></line>
                <text x="2" y="7" fontSize="7" fill="currentColor">1</text>
                <text x="2" y="13" fontSize="7" fill="currentColor">2</text>
                <text x="2" y="19" fontSize="7" fill="currentColor">3</text>
              </svg>
              <span>Numbered</span>
            </button>

            <div className="h-4 w-[1px] bg-white/10 mx-1" />

            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); addLink(); }}
              disabled={isHtmlMode}
              title="Insert Link"
              className="px-2 py-1.5 text-xs rounded-lg text-[#aaa7b4] hover:text-white hover:bg-white/[0.08] disabled:opacity-40 flex items-center gap-1 transition-colors"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
            </button>

            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); exec('removeFormat'); }}
              disabled={isHtmlMode}
              title="Clear Formatting"
              className="px-2 py-1.5 text-xs rounded-lg text-[#aaa7b4] hover:text-white hover:bg-white/[0.08] disabled:opacity-40 transition-colors"
            >
              &times;
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsHtmlMode(!isHtmlMode)}
            className={`px-2.5 py-1 text-xs font-mono rounded-md border transition-all ${
              isHtmlMode
                ? 'bg-[#f6db00] text-[#0d0c11] border-[#f6db00] font-bold'
                : 'bg-white/[0.04] text-[#aaa7b4] border-white/10 hover:text-white'
            }`}
            title="Toggle between Visual and HTML Code editing"
          >
            {isHtmlMode ? 'Visual Mode' : '<> HTML'}
          </button>
        </div>

        {/* Editor Body */}
        {isHtmlMode ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={5}
            placeholder="<p>Write raw HTML here...</p>"
            className="w-full p-4 bg-transparent text-white font-mono text-xs focus:outline-none min-h-[140px] max-h-[320px] resize-y admin-scrollbar"
          />
        ) : (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onBlur={handleInput}
            role="textbox"
            aria-multiline="true"
            data-placeholder={placeholder}
            className="p-4 text-white text-sm focus:outline-none min-h-[140px] max-h-[320px] overflow-y-auto admin-scrollbar leading-relaxed prose-invert empty:before:content-[attr(data-placeholder)] empty:before:text-[#5d5a67] empty:before:pointer-events-none"
          />
        )}
      </div>

      {error && <p className="text-xs font-medium text-rose-400 mt-1">{error}</p>}
    </div>
  );
}
