import React from 'react';

export interface CollectionCounts {
  projects: number;
  skills: number;
  credentials: number;
  experiences: number;
  contactLinks: number;
}

interface DashboardOverviewProps {
  counts: CollectionCounts;
  userEmail: string;
}

export default function DashboardOverview({ counts, userEmail }: DashboardOverviewProps) {
  const collections = [
    {
      title: 'Projects',
      count: counts.projects,
      href: '/admin/projects',
      desc: 'Portfolio showcase cases and featured work',
      icon: (
        <svg className="w-6 h-6 text-[#6c3cff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      title: 'Skills & Tools',
      count: counts.skills,
      href: '/admin/skills',
      desc: 'Interactive radar nodes and categorized stack',
      icon: (
        <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      title: 'Credentials & Honours',
      count: counts.credentials,
      href: '/admin/credentials',
      desc: 'Stacked cards for recognitions and achievements',
      icon: (
        <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
    },
    {
      title: 'Work Experiences',
      count: counts.experiences,
      href: '/admin/experiences',
      desc: 'Chronological career milestones and positions',
      icon: (
        <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'Contact Links',
      count: counts.contactLinks,
      href: '/admin/contact',
      desc: 'Social channels and direct contact destinations',
      icon: (
        <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'Site Settings',
      count: 1,
      href: '/admin/settings',
      desc: 'Global metadata, hero lead, and SEO settings',
      icon: (
        <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 md:p-8 bg-[#18171f] rounded-3xl shadow-apple-card flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6c3cff]"></span>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#aaa7b4]">Control Center</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl md:text-3xl text-white tracking-tight">
            Welcome back
          </h2>
          <p className="text-sm text-[#aaa7b4]">
            Signed in as <span className="text-white font-medium">{userEmail}</span> with full administrative privileges.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/admin/preview"
            className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 text-xs font-semibold bg-[#6c3cff] hover:bg-[#5a2de0] text-white rounded-xl shadow-md transition-all active:scale-[0.98]"
          >
            Draft Preview &rarr;
          </a>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 text-xs font-semibold bg-white/[0.06] hover:bg-white/[0.1] text-white rounded-xl transition-all active:scale-[0.98]"
          >
            Live Site &nearr;
          </a>
        </div>
      </div>

      {/* Grid of collections */}
      <div className="space-y-4">
        <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-[#aaa7b4] px-1">
          Content Collections
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map((col) => (
            <a
              key={col.title}
              href={col.href}
              className="p-6 bg-[#18171f] hover:bg-[#1f1d26] rounded-3xl transition-all duration-150 shadow-apple-card group flex flex-col justify-between active:scale-[0.98] min-h-[160px]"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.04] flex items-center justify-center">
                    {col.icon}
                  </div>
                  <span className="font-heading font-extrabold text-3xl text-white group-hover:text-[#6c3cff] transition-colors">
                    {col.count}
                  </span>
                </div>
                <h4 className="font-heading font-bold text-lg text-white group-hover:text-[#6c3cff] transition-colors">
                  {col.title}
                </h4>
                <p className="text-xs text-[#aaa7b4] mt-1 leading-relaxed">
                  {col.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-semibold text-[#aaa7b4] group-hover:text-[#6c3cff] transition-colors">
                <span>Manage entries</span>
                <span className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
