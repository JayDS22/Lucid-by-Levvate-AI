"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LucidMark, LucidWordmark, Spark, ArrowOut, Refresh, DocIcon, CodeIcon,
  Plus, Minus, Spinner, Alert, ExternalLink, LogOut,
} from "@/app/components/icons";

type Suggestion = {
  issue: string;
  recommendation: string;
  example: string;
  priority: "high" | "medium" | "low";
};
type Rubric = Record<string, { score: number; reasoning: string }>;
type Result = {
  url: string;
  title: string;
  business_summary: string;
  target_audience: string;
  clarity_score: number;
  rubric: Rubric;
  suggestions: Suggestion[];
  highlights: { strong: string[]; weak: string[] };
  analyzed_at: string;
};

export default function LucidApp() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [pasted, setPasted] = useState("");
  const [showPaste, setShowPaste] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [view, setView] = useState<"report" | "json">("report");
  const [pdfLoading, setPdfLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, pastedText: showPaste ? pasted : undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error + (data.hint ? ` ${data.hint}` : ""));
        if (data.hint) setShowPaste(true);
      } else {
        setResult(data);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function downloadPdf() {
    if (!result) return;
    setPdfLoading(true);
    try {
      const res = await fetch("/api/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result),
      });
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `lucid-${(result.title || "report").replace(/\W+/g, "-").toLowerCase().slice(0, 40)}.pdf`;
      a.click();
    } finally {
      setPdfLoading(false);
    }
  }

  function reset() {
    setResult(null);
    setUrl("");
    setPasted("");
    setError(null);
  }

  async function logout() {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/login");
    router.refresh();
  }

  return (
    <main className="min-h-screen">
      {/* NAV */}
      <nav className="hero-bg">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-indigo flex items-center gap-2">
              <LucidMark size={26} />
              <LucidWordmark className="text-2xl text-indigo-deep" />
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-indigo px-2.5 py-1 bg-white/70 rounded-pill hairline">
              for levvate
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm font-medium text-ink/80">
            <a href="#how" className="hidden md:inline hover:text-indigo transition">How it works</a>
            <a href="#examples" className="hidden md:inline hover:text-indigo transition">Examples</a>
            <a href="https://levvate.com" target="_blank" rel="noopener" className="hidden md:flex items-center gap-1 hover:text-indigo transition">
              levvate.com <ExternalLink size={11} />
            </a>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-muted hover:text-indigo transition px-3 py-1.5 hairline rounded-pill bg-white/60"
              title="Sign out"
            >
              <LogOut size={13} /> <span className="hidden md:inline">Sign out</span>
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero-bg pb-24 md:pb-32">
        <div className="max-w-5xl mx-auto px-6 md:px-12 pt-12 md:pt-20">
          {!result && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/70 hairline rounded-pill text-xs font-medium text-indigo mb-8">
                <Spark size={12} />
                Powered by Claude Sonnet 4.5
              </div>

              <h1 className="font-display font-extrabold text-5xl md:text-7xl leading-[1.02] tracking-tight text-ink mb-6 max-w-4xl">
                The clarity engine for{" "}
                <span className="serif-italic text-indigo">service-based</span> websites.
              </h1>

              <p className="text-lg md:text-xl text-ink/70 max-w-2xl mb-10 leading-relaxed">
                Paste a URL. Get a clarity score from 1 to 10, a 5-dimension rubric breakdown,
                and three concrete edits a copywriter would charge you for.
                Built in the spirit of Levvate's free site assessment.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4 max-w-3xl">
                <div className="flex gap-2 flex-col md:flex-row p-2 bg-white rounded-pill hairline-strong shadow-soft focus-within:shadow-lift transition-shadow">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="yourbusiness.com"
                    className="flex-1 px-6 py-3 bg-transparent rounded-pill text-base focus:outline-none placeholder:text-muted/50"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading || (!url && !pasted)}
                    className="px-7 py-3 bg-indigo text-white rounded-pill font-semibold hover:bg-indigo-deep transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <><Spinner size={14} /> Analyzing</>
                    ) : (
                      <>Analyze site <ArrowOut size={14} /></>
                    )}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPaste((v) => !v)}
                  className="text-sm text-indigo hover:text-indigo-deep underline underline-offset-4 ml-2"
                >
                  {showPaste ? "Hide paste field" : "Site blocks bots? Paste homepage text manually"}
                </button>

                {showPaste && (
                  <textarea
                    value={pasted}
                    onChange={(e) => setPasted(e.target.value)}
                    placeholder="Paste your homepage copy here..."
                    rows={8}
                    className="w-full px-5 py-4 bg-white hairline-strong rounded-2xl text-sm focus:outline-none focus:border-indigo focus:ring-2 focus:ring-indigo/15"
                  />
                )}
              </form>

              {error && (
                <div className="mt-6 max-w-3xl flex items-start gap-3 p-4 bg-white hairline rounded-2xl text-sm">
                  <span className="text-red-600 flex-shrink-0 mt-0.5"><Alert size={16} /></span>
                  <span className="text-ink">{error}</span>
                </div>
              )}

              <div id="examples" className="mt-16">
                <p className="text-xs uppercase tracking-widest text-indigo font-semibold mb-3">
                  Try these
                </p>
                <div className="flex gap-2 flex-wrap">
                  {["levvate.com", "stripe.com", "linear.app", "notion.so"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setUrl(s)}
                      className="px-4 py-2 text-sm bg-white hairline rounded-pill hover:border-indigo hover:text-indigo transition"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          <AnimatePresence>
            {result && (
              <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-12"
              >
                <div className="flex items-center justify-between flex-wrap gap-4 pt-6">
                  <div>
                    <p className="text-xs font-mono text-muted mb-1">{result.url}</p>
                    <h2 className="font-display font-extrabold text-3xl md:text-5xl leading-tight text-ink">
                      {result.title || "Untitled page"}
                    </h2>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => setView(view === "report" ? "json" : "report")}
                      className="px-4 py-2 bg-white hairline rounded-pill text-sm font-medium hover:border-indigo hover:text-indigo flex items-center gap-2 transition"
                    >
                      {view === "report" ? <><CodeIcon size={14} /> JSON</> : <><DocIcon size={14} /> Report</>}
                    </button>
                    <button
                      onClick={downloadPdf}
                      disabled={pdfLoading}
                      className="px-5 py-2 bg-indigo text-white rounded-pill text-sm font-semibold hover:bg-indigo-deep transition flex items-center gap-2 disabled:opacity-60"
                    >
                      {pdfLoading ? <><Spinner size={14} /> Building PDF</> : <><DocIcon size={14} /> Download PDF</>}
                    </button>
                    <button onClick={reset} className="px-4 py-2 bg-white hairline rounded-pill text-sm hover:border-indigo flex items-center gap-2 transition">
                      <Refresh size={14} /> New
                    </button>
                  </div>
                </div>

                {view === "json" ? (
                  <pre className="bg-indigo-ink text-lavender-mist p-6 overflow-x-auto text-xs font-mono leading-relaxed rounded-2xl">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                ) : (
                  <ResultsView result={result} />
                )}
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </section>

      {!result && (
        <section id="how" className="bg-white py-20">
          <div className="max-w-5xl mx-auto px-6 md:px-12">
            <p className="text-xs uppercase tracking-widest text-indigo font-semibold mb-3">
              How it works
            </p>
            <h2 className="font-display font-extrabold text-3xl md:text-5xl text-ink mb-12 max-w-3xl leading-tight">
              Five rubric dimensions, <span className="serif-italic text-indigo">one</span> score, three fixes.
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { n: "01", t: "Scrape and strip", d: "Pulls headings, CTAs, and body copy. Drops nav, footer, scripts, cookie banners. Capped at 8k characters so the model focuses on signal." },
                { n: "02", t: "Score against rubric", d: "Claude rates value prop, audience clarity, CTA strength, jargon level, and scannability. Each dimension is independent." },
                { n: "03", t: "Recommend and ship", d: "Three prioritized rewrites that quote your actual copy, plus a Levvate-branded PDF and raw JSON for engineers." },
              ].map((s) => (
                <div key={s.n} className="bg-lavender-mist hairline rounded-3xl p-8">
                  <span className="text-xs font-mono text-indigo">{s.n}</span>
                  <h3 className="font-display font-bold text-xl mt-4 mb-3">{s.t}</h3>
                  <p className="text-sm text-ink/70 leading-relaxed">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <footer className="bg-indigo-ink text-lavender-mist py-10">
        <div className="max-w-5xl mx-auto px-6 md:px-12 flex justify-between flex-wrap gap-4 text-sm">
          <span className="flex items-center gap-2">
            <LucidMark size={18} />
            <LucidWordmark className="text-base" />
            <span className="opacity-60 ml-2">v1.0</span>
          </span>
          <span className="font-mono text-xs opacity-70">
            Built by Jay Guwalani · for Levvate
          </span>
        </div>
      </footer>
    </main>
  );
}

function ResultsView({ result }: { result: Result }) {
  return (
    <>
      <div className="grid md:grid-cols-[280px_1fr] gap-12 items-start bg-white hairline rounded-3xl p-8 md:p-10 shadow-soft">
        <ScoreRing score={result.clarity_score} />
        <div className="space-y-6">
          <Block label="What this business does">
            <p className="font-display font-semibold text-2xl leading-snug text-ink">{result.business_summary}</p>
          </Block>
          <Block label="Target audience">
            <p className="text-base text-ink/75">{result.target_audience}</p>
          </Block>
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest text-indigo font-semibold mb-5">
          Rubric breakdown
        </p>
        <div className="grid md:grid-cols-2 gap-3">
          {Object.entries(result.rubric).map(([key, val]) => (
            <RubricRow key={key} label={key.replace(/_/g, " ")} score={val.score} reason={val.reasoning} />
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white hairline rounded-3xl p-7">
          <p className="text-xs uppercase tracking-widest text-indigo font-semibold mb-4">Working</p>
          <ul className="space-y-3">
            {result.highlights.strong.map((s, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="text-indigo mt-1 flex-shrink-0"><Plus size={12} /></span>
                <span className="text-ink/85">{s}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-lavender-mist hairline rounded-3xl p-7">
          <p className="text-xs uppercase tracking-widest text-indigo font-semibold mb-4">Hurting clarity</p>
          <ul className="space-y-3">
            {result.highlights.weak.map((w, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="text-muted mt-1 flex-shrink-0"><Minus size={12} /></span>
                <span className="text-ink/85">{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest text-indigo font-semibold mb-5">
          Recommendations
        </p>
        <div className="space-y-4">
          {result.suggestions.map((s, i) => <SuggestionCard key={i} idx={i + 1} s={s} />)}
        </div>
      </div>
    </>
  );
}

function ScoreRing({ score }: { score: number }) {
  const pct = (score / 10) * 100;
  return (
    <div className="flex flex-col items-center md:items-start">
      <div
        className="score-ring relative w-52 h-52 rounded-full flex items-center justify-center"
        style={{ ["--p" as any]: pct }}
      >
        <div className="absolute inset-3 bg-white rounded-full flex flex-col items-center justify-center shadow-soft">
          <span className="font-display font-extrabold text-6xl leading-none text-indigo">{score}</span>
          <span className="text-[10px] tracking-widest text-muted mt-1 font-mono">/ 10</span>
        </div>
      </div>
      <p className="text-xs uppercase tracking-widest text-indigo font-semibold mt-4">
        Clarity score
      </p>
    </div>
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-indigo font-semibold mb-2">{label}</p>
      {children}
    </div>
  );
}

function RubricRow({ label, score, reason }: { label: string; score: number; reason: string }) {
  return (
    <div className="hairline bg-white rounded-2xl p-5 hover:shadow-soft transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold capitalize text-ink">{label}</span>
        <span className="font-display font-extrabold text-2xl text-indigo">
          {score}
          <span className="text-muted text-base font-normal">/10</span>
        </span>
      </div>
      <div className="h-1.5 bg-lavender-mist rounded-pill mb-3 overflow-hidden">
        <div className="h-full bg-indigo rounded-pill transition-all duration-700" style={{ width: `${score * 10}%` }} />
      </div>
      <p className="text-xs text-ink/65 leading-relaxed">{reason}</p>
    </div>
  );
}

function SuggestionCard({ idx, s }: { idx: number; s: Suggestion }) {
  const tag = {
    high: "bg-indigo text-white",
    medium: "bg-indigo/15 text-indigo-deep",
    low: "bg-lavender text-indigo-deep",
  }[s.priority];
  return (
    <div className="bg-white hairline rounded-3xl p-7 hover:shadow-soft transition-shadow">
      <div className="flex items-start gap-4 mb-4">
        <span className="font-display font-extrabold text-3xl text-lavender leading-none mt-1 flex-shrink-0">
          {String(idx).padStart(2, "0")}
        </span>
        <div className="flex-1">
          <span className={`inline-block px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider mb-2 rounded-pill ${tag}`}>
            {s.priority} priority
          </span>
          <h3 className="font-display font-bold text-xl leading-snug text-ink">{s.issue}</h3>
        </div>
      </div>
      <div className="ml-14 space-y-3 text-sm">
        <p>
          <span className="text-xs uppercase tracking-wider text-indigo font-semibold mr-2">Fix</span>
          <span className="text-ink/85">{s.recommendation}</span>
        </p>
        <p className="bg-lavender-mist border-l-2 border-indigo pl-4 py-2 rounded-r-xl">
          <span className="text-xs uppercase tracking-wider text-indigo font-semibold mr-2 not-italic">Try</span>
          <span className="serif-italic text-ink">{s.example}</span>
        </p>
      </div>
    </div>
  );
}
