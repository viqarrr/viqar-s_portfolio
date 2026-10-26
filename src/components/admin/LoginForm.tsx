import React, { useState } from 'react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid credentials or non-admin account');
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
    <div className="w-full max-w-md p-8 sm:p-10 bg-[#1f1d26] rounded-[28px] shadow-apple-card text-white space-y-6 border border-white/[0.04]">
      <div className="text-center space-y-2">
        <div className="inline-flex items-baseline justify-center">
          <span className="font-display font-extrabold text-3xl tracking-tighter text-white">Viqar</span>
          <span className="text-[#f6db00] font-display font-extrabold text-3xl leading-none">.</span>
        </div>
        <p className="text-xs text-[#aaa7b4]">Sign in to access your portfolio CMS</p>
      </div>

      {error && (
        <div className="p-4 rounded-[14px] bg-red-500/10 text-red-300 text-xs font-medium flex items-start gap-3 border border-red-500/20">
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
            className="w-full min-h-[48px] px-4 py-3 bg-white/[0.04] hover:bg-white/[0.06] focus:bg-white/[0.08] text-sm text-white placeholder-[#5d5a67] rounded-[14px] outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-[#f6db00] transition-all disabled:opacity-40"
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
            className="w-full min-h-[48px] px-4 py-3 bg-white/[0.04] hover:bg-white/[0.06] focus:bg-white/[0.08] text-sm text-white placeholder-[#5d5a67] rounded-[14px] outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-[#f6db00] transition-all disabled:opacity-40"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full min-h-[48px] mt-2 py-3 px-4 bg-[#f6db00] hover:bg-[#e6cc00] disabled:bg-[#f6db00]/50 text-[#0d0c11] font-semibold text-sm rounded-full shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4 text-[#0d0c11]" fill="none" viewBox="0 0 24 24">
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
