import * as cheerio from "cheerio";

export interface ScrapedContent {
  url: string;
  title: string;
  metaDescription: string;
  headings: { h1: string[]; h2: string[]; h3: string[] };
  ctas: string[];
  bodyText: string;
  wordCount: number;
}

const STRIP_SELECTORS = [
  "script", "style", "noscript", "iframe", "svg",
  "nav", "header", "footer", "aside",
  "[role='navigation']", "[role='banner']", "[role='contentinfo']",
  ".cookie", ".cookies", "#cookie", "#cookies",
  ".navbar", ".menu", ".sidebar",
];

const CTA_KEYWORDS = [
  "sign up", "get started", "try free", "try it", "start free",
  "book a demo", "request demo", "contact sales", "buy now",
  "learn more", "schedule", "join", "subscribe", "download",
  "free assessment", "free site", "get my", "get your",
];

export async function scrapeUrl(url: string): Promise<ScrapedContent> {
  let target = url.trim();
  if (!/^https?:\/\//i.test(target)) target = "https://" + target;

  const res = await fetch(target, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; LucidBot/1.0; clarity analyzer)",
      "Accept": "text/html,application/xhtml+xml",
    },
    redirect: "follow",
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
  const html = await res.text();
  return parseHtml(html, target);
}

export function parseHtml(html: string, url: string): ScrapedContent {
  const $ = cheerio.load(html);

  const title = $("title").first().text().trim();
  const metaDescription =
    $('meta[name="description"]').attr("content")?.trim() ||
    $('meta[property="og:description"]').attr("content")?.trim() ||
    "";

  const h1 = $("h1").map((_, el) => $(el).text().trim()).get().filter(Boolean);
  const h2 = $("h2").map((_, el) => $(el).text().trim()).get().filter(Boolean).slice(0, 12);
  const h3 = $("h3").map((_, el) => $(el).text().trim()).get().filter(Boolean).slice(0, 12);

  const ctas: string[] = [];
  $("button, a").each((_, el) => {
    const t = $(el).text().trim().replace(/\s+/g, " ");
    if (!t || t.length > 60) return;
    const lower = t.toLowerCase();
    if (CTA_KEYWORDS.some((k) => lower.includes(k))) ctas.push(t);
  });
  const uniqueCtas = Array.from(new Set(ctas)).slice(0, 10);

  STRIP_SELECTORS.forEach((sel) => $(sel).remove());
  const bodyText = $("body").text().replace(/\s+/g, " ").trim().slice(0, 8000);

  return {
    url,
    title,
    metaDescription,
    headings: { h1, h2, h3 },
    ctas: uniqueCtas,
    bodyText,
    wordCount: bodyText.split(/\s+/).length,
  };
}
