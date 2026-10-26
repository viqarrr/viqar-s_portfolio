import React, { useState } from 'react';

interface MobileNavDrawerProps {
  currentPath: string;
  userEmail?: string;
}

export default function MobileNavDrawer({ currentPath, userEmail }: MobileNavDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const mainNav = [
    {
      href: '/admin',
      label: 'Overview',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      href: '/admin/projects',
      label: 'Projects',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      href: '/admin/skills',
      label: 'Skills',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      href: '/admin/experiences',
      label: 'Timeline',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      href: '/admin/settings',
      label: 'Settings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  const secondaryNav = [
    { href: '/admin/credentials', label: 'Credentials & Honours' },
    { href: '/admin/contact', label: 'Contact Links' },
    { href: '/admin/media', label: 'Media Library' },
    { href: '/admin/preview', label: 'Draft Preview' },
  ];

  return (
    <>
      {/* iOS-Style Frosted Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-xl bg-[#0d0c11]/85 border-t border-white/[0.06] pb-safe px-3 py-1 flex items-center justify-around">
        {mainNav.map((tab) => {
          const isActive =
            tab.href === '/admin'
              ? currentPath === '/admin'
              : currentPath.startsWith(tab.href);

          return (
            <a
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center min-w-[54px] min-h-[48px] py-1 px-2 rounded-xl transition-all active:scale-[0.95] ${
                isActive
                  ? 'text-[#6c3cff] font-semibold'
                  : 'text-[#aaa7b4] hover:text-white'
              }`}
            >
              <div className="w-5 h-5 flex items-center justify-center">
                {tab.icon}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
            </a>
          );
        })}

        {/* More Tab / Drawer Button */}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`flex flex-col items-center justify-center min-w-[54px] min-h-[48px] py-1 px-2 rounded-xl transition-all active:scale-[0.95] ${
            isOpen || (!mainNav.some(n => n.href === '/admin' ? currentPath === '/admin' : currentPath.startsWith(n.href)))
              ? 'text-[#6c3cff] font-semibold'
              : 'text-[#aaa7b4] hover:text-white'
          }`}
          aria-label="More navigation items"
        >
          <div className="w-5 h-5 flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">More</span>
        </button>
      </nav>

      {/* Slide-over Drawer for secondary navigation */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative bg-[#18171f] rounded-t-3xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto admin-scrollbar pb-safe space-y-5 animate-in slide-in-from-bottom duration-200">
            {/* Grab handle */}
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto -mt-2 mb-2" />

            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div>
                <h3 className="font-heading font-bold text-lg text-white">Navigation</h3>
                <p className="text-xs text-[#aaa7b4]">{userEmail || 'Administrator'}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/[0.06] text-[#aaa7b4] hover:text-white text-lg active:scale-95 transition-all"
              >
                &times;
              </button>
            </div>

            <div className="space-y-1">
              <p className="text-[11px] font-semibold text-[#5d5a67] uppercase tracking-wider px-3 mb-1">
                Sections & Tools
              </p>
              {secondaryNav.map((item) => {
                const isActive = currentPath.startsWith(item.href);
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between min-h-[48px] px-4 py-3 rounded-2xl text-sm font-medium transition-all active:scale-[0.98] ${
                      isActive
                        ? 'bg-[#6c3cff] text-white font-semibold'
                        : 'text-[#aaa7b4] hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="text-xs opacity-50">&rarr;</span>
                  </a>
                );
              })}
            </div>

            <div className="pt-2 border-t border-white/[0.06] space-y-2">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center min-h-[44px] w-full px-4 py-2.5 text-xs font-semibold text-white bg-white/[0.06] hover:bg-white/[0.1] rounded-xl transition-all active:scale-[0.98]"
              >
                View Public Site &nearr;
              </a>
              <form method="POST" action="/api/auth/logout">
                <button
                  type="submit"
                  className="flex items-center justify-center min-h-[44px] w-full px-4 py-2.5 text-xs font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-all active:scale-[0.98]"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
