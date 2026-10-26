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
  userEmail?: string;
}

export default function DashboardOverview({ counts }: DashboardOverviewProps) {
  const collections = [
    {
      title: 'Projects',
      countBadge: `${counts.projects}`,
      href: '/admin/projects',
      desc: 'Portfolio showcase cases and featured work',
      heroGraphic: (
        <svg
          viewBox="0 0 96 96"
          className="w-20 h-20 sm:w-24 sm:h-24 text-[#aaa7b4] opacity-35 group-hover:opacity-60 transition-opacity duration-300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Layered Showcase Windows / Screens */}
          <rect x="8" y="16" width="80" height="60" rx="10" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" strokeOpacity="0.6" />
          <path d="M8 28H88" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
          <circle cx="18" cy="22" r="2.5" fill="currentColor" fillOpacity="0.8" />
          <circle cx="26" cy="22" r="2.5" fill="currentColor" fillOpacity="0.5" />
          <circle cx="34" cy="22" r="2.5" fill="currentColor" fillOpacity="0.3" />
          {/* Inner Content Card Preview */}
          <rect x="18" y="36" width="36" height="26" rx="6" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.5" />
          <rect x="60" y="36" width="20" height="5" rx="2" fill="currentColor" fillOpacity="0.5" />
          <rect x="60" y="45" width="14" height="4" rx="2" fill="currentColor" fillOpacity="0.3" />
          <rect x="60" y="53" width="18" height="4" rx="2" fill="currentColor" fillOpacity="0.2" />
          {/* Floating Action Star / Badge */}
          <circle cx="70" cy="64" r="13" fill="#f6db00" fillOpacity="0.85" />
          <path d="M70 57L72.2 61.8L77.5 62.5L73.6 66L74.6 71.2L70 68.7L65.4 71.2L66.4 66L62.5 62.5L67.8 61.8L70 57Z" fill="#0d0c11" />
        </svg>
      ),
    },
    {
      title: 'Skills & Tools',
      countBadge: `${counts.skills}`,
      href: '/admin/skills',
      desc: 'Interactive radar nodes and categorized stack',
      heroGraphic: (
        <svg
          viewBox="0 0 96 96"
          className="w-20 h-20 sm:w-24 sm:h-24 text-[#aaa7b4] opacity-35 group-hover:opacity-60 transition-opacity duration-300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Orbital Radar System */}
          <circle cx="48" cy="48" r="38" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3" strokeDasharray="4 4" />
          <circle cx="48" cy="48" r="26" stroke="currentColor" strokeWidth="1.8" strokeOpacity="0.5" />
          <circle cx="48" cy="48" r="14" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="2" strokeOpacity="0.7" />
          <circle cx="48" cy="48" r="5" fill="#f6db00" />
          {/* Sweep Lines */}
          <line x1="48" y1="10" x2="48" y2="86" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.25" />
          <line x1="10" y1="48" x2="86" y2="48" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.25" />
          {/* Constellation Nodes */}
          <circle cx="70" cy="32" r="6" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="2" />
          <circle cx="26" cy="62" r="5" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="2" />
          <circle cx="64" cy="68" r="4.5" fill="#f6db00" fillOpacity="0.7" stroke="#f6db00" strokeWidth="1.5" />
          <path d="M48 48L70 32M48 48L26 62M48 48L64 68" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
        </svg>
      ),
    },
    {
      title: 'Credentials & Honours',
      countBadge: `${counts.credentials}`,
      href: '/admin/credentials',
      desc: 'Stacked cards for recognitions and achievements',
      heroGraphic: (
        <svg
          viewBox="0 0 96 96"
          className="w-20 h-20 sm:w-24 sm:h-24 text-[#aaa7b4] opacity-35 group-hover:opacity-60 transition-opacity duration-300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Ribbon Tail */}
          <path d="M32 58L22 86L48 74L74 86L64 58" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeOpacity="0.5" />
          {/* Rosette Medal */}
          <circle cx="48" cy="40" r="28" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="2" strokeOpacity="0.6" />
          <circle cx="48" cy="40" r="22" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="3 3" />
          <circle cx="48" cy="40" r="16" fill="currentColor" fillOpacity="0.15" />
          {/* Star Laureate */}
          <path d="M48 24L52.8 34.6L64 36.2L55.8 44.4L58 56L48 50.4L38 56L40.2 44.4L32 36.2L43.2 34.6L48 24Z" fill="#f6db00" />
        </svg>
      ),
    },
    {
      title: 'Work Experiences',
      countBadge: `${counts.experiences}`,
      href: '/admin/experiences',
      desc: 'Chronological career milestones and positions',
      heroGraphic: (
        <svg
          viewBox="0 0 96 96"
          className="w-20 h-20 sm:w-24 sm:h-24 text-[#aaa7b4] opacity-35 group-hover:opacity-60 transition-opacity duration-300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Executive Career Briefcase */}
          <rect x="12" y="32" width="72" height="48" rx="10" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="2.2" strokeOpacity="0.6" />
          <path d="M34 32V23C34 19.6863 36.6863 17 40 17H56C59.3137 17 62 19.6863 62 23V32" stroke="currentColor" strokeWidth="2.2" strokeOpacity="0.7" />
          <line x1="12" y1="48" x2="84" y2="48" stroke="currentColor" strokeWidth="1.8" strokeOpacity="0.3" />
          <rect x="41" y="44" width="14" height="10" rx="3" fill="#f6db00" fillOpacity="0.85" />
          {/* Milestone Growth Chart Line */}
          <path d="M22 66L38 56L50 62L70 48" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.7" />
          <circle cx="70" cy="48" r="4" fill="#f6db00" />
        </svg>
      ),
    },
    {
      title: 'Contact Links',
      countBadge: `${counts.contactLinks}`,
      href: '/admin/contact',
      desc: 'Social channels and direct contact destinations',
      heroGraphic: (
        <svg
          viewBox="0 0 96 96"
          className="w-20 h-20 sm:w-24 sm:h-24 text-[#aaa7b4] opacity-35 group-hover:opacity-60 transition-opacity duration-300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Global Communication Sphere */}
          <circle cx="48" cy="48" r="34" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="2.2" strokeOpacity="0.6" />
          <ellipse cx="48" cy="48" rx="15" ry="34" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.5" />
          <line x1="14" y1="48" x2="82" y2="48" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.5" />
          <path d="M20 33C30 38 40 40 48 40C56 40 66 38 76 33" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3" />
          <path d="M20 63C30 58 40 56 48 56C56 56 66 58 76 63" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3" />
          {/* Active Beacon Signal */}
          <circle cx="68" cy="28" r="6" fill="#f6db00" />
          <path d="M68 18C74 20 80 25 82 31" stroke="#f6db00" strokeWidth="2.2" strokeLinecap="round" strokeOpacity="0.7" />
        </svg>
      ),
    },
    {
      title: 'Site Settings',
      countBadge: '1 configured',
      href: '/admin/settings',
      desc: 'Global metadata, hero lead, and SEO settings',
      heroGraphic: (
        <svg
          viewBox="0 0 96 96"
          className="w-20 h-20 sm:w-24 sm:h-24 text-[#aaa7b4] opacity-35 group-hover:opacity-60 transition-opacity duration-300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Precision Cogs & Knobs */}
          <circle cx="42" cy="42" r="20" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="2.2" strokeOpacity="0.6" />
          <circle cx="42" cy="42" r="8" fill="#f6db00" fillOpacity="0.85" />
          <path d="M42 16V22M42 62V68M16 42H22M62 42H68M24 24L28 28M56 56L60 60M24 60L28 56M56 28L60 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.7" />
          {/* Satellite Toggle Matrix */}
          <circle cx="70" cy="70" r="14" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="2" strokeOpacity="0.5" />
          <circle cx="70" cy="70" r="5" fill="#f6db00" />
          <path d="M70 52V56M70 84V88M52 70H56M84 70H88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.5" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Clean Page Header (no AI slop / banner cards) */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-white/[0.04]">
        <div className="space-y-1">
          <h1 className="font-display font-bold text-3xl md:text-4xl text-white tracking-tight">
            Overview
          </h1>
          <p className="text-sm text-[#aaa7b4]">
            Manage, organize, and publish content across your portfolio collections.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <a
            href="/admin/preview"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-[#f6db00] hover:bg-[#e6cc00] text-[#0d0c11] rounded-full shadow-sm transition-all active:scale-[0.98]"
          >
            <span>Draft Preview</span>
          </a>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#1f1d26] hover:bg-white/[0.1] text-white rounded-full border border-white/[0.08] transition-all active:scale-[0.98]"
          >
            <span>Live Site</span>
            <span aria-hidden="true" className="text-sm leading-none">↗</span>
          </a>
        </div>
      </div>

      {/* Asymmetric 2-Column Collection Cards Grid */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {collections.map((col) => (
            <a
              key={col.title}
              href={col.href}
              className="group relative flex flex-row items-center justify-between p-6 bg-[#1f1d26] hover:bg-[#282631] rounded-[28px] border border-white/[0.04] hover:border-white/[0.08] transition-all duration-300 overflow-hidden shadow-apple-card hover:shadow-apple-float min-h-[175px] select-none"
            >
              {/* Left Column (Content & Action) */}
              <div className="flex-1 flex flex-col justify-between h-full z-10 pr-3 min-w-0">
                <div className="space-y-1.5">
                  <h2 className="font-display font-bold text-xl text-white tracking-tight truncate">
                    {col.countBadge} {col.title}
                  </h2>
                  <p className="text-xs text-[#aaa7b4] leading-relaxed line-clamp-2">
                    {col.desc}
                  </p>
                </div>

                  <span className="rounded-full bg-[#f6db00] text-[#0d0c11] font-semibold text-xs px-4 py-2 hover:opacity-90 transition inline-flex items-center gap-1.5 shadow-sm flex-shrink-0">
                    <span>Manage</span>
                    <span aria-hidden="true" className="group-hover:translate-x-0.5 transition-transform duration-200">&rarr;</span>
                  </span>
              </div>

              {/* Right Column (Visual Hero — Oversized Thematic SVG) */}
              <div className="relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center self-center z-10 ml-2">
                <div className="transform group-hover:scale-105 transition-transform duration-300">
                  {col.heroGraphic}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
