import React, { useState, useEffect } from 'react';

interface MobileNavDrawerProps {
  currentPath: string;
  userEmail?: string;
}

export default function MobileNavDrawer({ currentPath, userEmail }: MobileNavDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Close drawer on Escape key & lock body scroll when open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const navItems = [
    {
      href: '/admin',
      label: 'Overview',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      href: '/admin/projects',
      label: 'Projects',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      ),
    },
    {
      href: '/admin/skills',
      label: 'Skills & Tools',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      href: '/admin/credentials',
      label: 'Credentials',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
    },
    {
      href: '/admin/experiences',
      label: 'Experiences',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      href: '/admin/contact',
      label: 'Contact Links',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      href: '/admin/media',
      label: 'Media Library',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      href: '/admin/settings',
      label: 'Site Settings',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      href: '/admin/preview',
      label: 'Draft Preview',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* 1. Mobile Clean Sticky Header with Drawer Trigger (Only on mobile screens: md:hidden) */}
      <header className="md:hidden sticky top-0 z-40 bg-[#0d0c11]/85 backdrop-blur-md px-5 py-3.5 flex items-center justify-between border-b border-white/[0.04]">
        {/* Left Side: Studio Wordmark "Viqar." */}
        <a href="/admin" className="inline-flex items-baseline group" aria-label="Viqar Admin Overview">
          <span className="font-display font-extrabold text-2xl tracking-tighter text-white">Viqar</span>
          <span className="text-[#f6db00] font-display font-extrabold text-2xl leading-none">.</span>
        </a>

        {/* Right Side: Accessible 44x44px Menu Button (Hamburger) */}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={isOpen}
          className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white/[0.06] hover:bg-white/[0.1] active:bg-white/[0.14] flex items-center justify-center text-white transition-all active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>

      {/* 2. Apple HIG-Compliant Slide-Over Drawer Navigation */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel: Slide in from the side, full-height */}
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Drawer"
            className="relative z-50 w-72 max-w-[85vw] h-full bg-[#0d0c11] border-l border-white/[0.08] p-6 flex flex-col justify-between shadow-2xl transition-transform duration-200 ease-out overflow-y-auto admin-scrollbar"
          >
            <div className="flex flex-col min-h-0 flex-1">
              {/* Drawer Header: Logo "Viqar." with 44x44px Close ('X') Button */}
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-5">
                <a
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-baseline"
                  aria-label="Viqar Admin Overview"
                >
                  <span className="font-display font-extrabold text-2xl tracking-tighter text-white">Viqar</span>
                  <span className="text-[#f6db00] font-display font-extrabold text-2xl leading-none">.</span>
                </a>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close navigation menu"
                  className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white/[0.06] hover:bg-white/[0.1] active:bg-white/[0.14] flex items-center justify-center text-[#aaa7b4] hover:text-white transition-all active:scale-95"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Vertical Nav List with generous 44px+ touch targets */}
              <nav className="flex-1 py-4 space-y-1.5 overflow-y-auto admin-scrollbar">
                {navItems.map((item) => {
                  const isActive =
                    item.href === '/admin'
                      ? currentPath === '/admin'
                      : currentPath.startsWith(item.href);

                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between min-h-[44px] px-4 py-2.5 rounded-full text-sm font-medium transition-all active:scale-[0.98] ${
                        isActive
                          ? 'bg-[#1f1d26] text-white font-semibold shadow-sm'
                          : 'text-[#aaa7b4] hover:bg-[#1f1d26]/50 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={isActive ? 'text-[#f6db00]' : 'text-[#aaa7b4]'}>
                          {item.icon}
                        </span>
                        <span className="truncate">{item.label}</span>
                      </div>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#f6db00] shadow-[0_0_8px_rgba(246,219,0,0.6)] flex-shrink-0"></span>
                      )}
                    </a>
                  );
                })}
              </nav>
            </div>

            {/* Drawer Footer: Actions & Status */}
            <div className="pt-4 border-t border-white/[0.06] space-y-2.5 flex-shrink-0">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-1.5 min-h-[44px] w-full px-4 py-2 text-xs font-semibold text-white bg-white/[0.06] hover:bg-white/[0.1] rounded-full transition-all active:scale-[0.98]"
              >
                <span>View Public Site</span>
                <span aria-hidden="true" className="text-sm">↗</span>
              </a>

              <form method="POST" action="/api/auth/logout">
                <button
                  type="submit"
                  className="flex items-center justify-center min-h-[44px] w-full px-4 py-2 text-xs font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-full transition-all active:scale-[0.98]"
                >
                  Sign Out
                </button>
              </form>

              {userEmail && (
                <div className="pt-1 text-center">
                  <span className="text-[11px] text-[#5d5a67] font-medium truncate block">
                    {userEmail}
                  </span>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
