import React, { useState } from 'react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Authentication failed. Please verify your credentials.');
        setLoading(false);
        return;
      }

      window.location.href = data.redirect || '/admin';
    } catch {
      setError('A network or server error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 sm:p-10 bg-[#18171f] rounded-3xl shadow-apple-card text-white space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#6c3cff]/15 text-[#6c3cff] mb-2 shadow-[0_0_20px_rgba(108,60,255,0.25)]">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <h2 className="font-heading font-extrabold text-2xl tracking-tight text-white">
          Portfolio Admin
        </h2>
        <p className="text-xs text-[#aaa7b4]">Sign in to access your CMS control center</p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 text-red-300 text-xs font-medium flex items-start gap-3">
          <svg className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="leading-relaxed">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[#aaa7b4] uppercase tracking-wider">
            Email Address
          </label>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@viqar.dev"
            disabled={loading}
            className="w-full min-h-[48px] px-4 py-3 bg-white/[0.04] hover:bg-white/[0.06] focus:bg-white/[0.08] text-sm text-white placeholder-[#5d5a67] rounded-xl outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-[#6c3cff] transition-all disabled:opacity-40"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[#aaa7b4] uppercase tracking-wider">
            Password
          </label>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            disabled={loading}
            className="w-full min-h-[48px] px-4 py-3 bg-white/[0.04] hover:bg-white/[0.06] focus:bg-white/[0.08] text-sm text-white placeholder-[#5d5a67] rounded-xl outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-[#6c3cff] transition-all disabled:opacity-40"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full min-h-[48px] mt-2 py-3 px-4 bg-[#6c3cff] hover:bg-[#5a2de0] disabled:bg-[#6c3cff]/50 text-white font-semibold text-sm rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span>Verifying...</span>
            </>
          ) : (
            <span>Sign In</span>
          )}
        </button>
      </form>
    </div>
  );
}
