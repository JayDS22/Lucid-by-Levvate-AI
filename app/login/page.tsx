"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LucidMark, LucidWordmark, Lock, Eye, EyeOff, Spinner, ArrowOut, Spark } from "@/app/components/icons";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Login failed.");
        setLoading(false);
        return;
      }
      router.push("/");
      router.refresh();
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen relative overflow-hidden flex items-center justify-center px-4">
      {/* Blurred Levvate watermark backdrop */}
      <div className="login-backdrop" aria-hidden />
      <div className="levvate-watermark" aria-hidden>levvate</div>

      {/* Floating accent dots, subtle parallax feel */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-[20%] left-[12%] w-2 h-2 rounded-full bg-indigo opacity-40" />
        <div className="absolute top-[70%] right-[18%] w-1.5 h-1.5 rounded-full bg-indigo opacity-30" />
        <div className="absolute top-[40%] right-[8%] w-1 h-1 rounded-full bg-indigo opacity-50" />
      </div>

      {/* Login card */}
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Brand strip above card */}
        <div className="flex items-center justify-center gap-2 mb-8 text-indigo">
          <LucidMark size={28} />
          <LucidWordmark className="text-3xl text-indigo-deep" />
        </div>

        <div className="relative bg-white/80 backdrop-blur-2xl rounded-3xl shadow-lift hairline-strong overflow-hidden">
          {/* shimmer line on top edge */}
          <div className="shimmer-line h-px w-full" />

          <div className="p-8 md:p-10">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-pill text-xs font-medium text-indigo mb-4">
                <Spark size={12} /> Levvate clarity engine, demo build
              </div>
              <h1 className="font-display font-extrabold text-3xl text-ink leading-tight tracking-tight">
                Welcome back.
              </h1>
              <p className="text-sm text-muted mt-2 leading-relaxed">
                Enter the demo passcode to access Lucid. Your session is saved for 24 hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-indigo uppercase tracking-wider mb-2">
                  Passcode
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo">
                    <Lock size={16} />
                  </span>
                  <input
                    type={show ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter passcode"
                    autoFocus
                    className="w-full pl-11 pr-11 py-3.5 bg-white hairline rounded-2xl text-base focus:outline-none focus:border-indigo focus:ring-2 focus:ring-indigo/15 transition"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-indigo p-1 transition"
                    tabIndex={-1}
                  >
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-2.5 rounded-xl">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !password}
                className="w-full py-3.5 bg-indigo text-white rounded-2xl font-semibold hover:bg-indigo-deep transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <><Spinner size={16} /> Signing in</>
                ) : (
                  <>Continue <ArrowOut size={14} /></>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-indigo/10">
              <p className="text-xs text-muted leading-relaxed">
                <span className="font-mono px-1.5 py-0.5 bg-indigo-50 text-indigo rounded text-[11px]">
                  lucid2026
                </span>
                <span className="ml-2">demo passcode for evaluators</span>
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-muted mt-6 leading-relaxed">
          Built by Jay Guwalani for the Levvate AI Automation Intern technical assessment.
          <br />
          Powered by Claude Sonnet 4.5.
        </p>
      </motion.div>
    </main>
  );
}
