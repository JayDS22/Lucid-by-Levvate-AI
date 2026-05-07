import { NextRequest, NextResponse } from "next/server";
import { scrapeUrl, ScrapedContent } from "@/lib/scraper";
import { analyzeContent } from "@/lib/analyzer";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session.authenticated) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { url, pastedText } = body as { url?: string; pastedText?: string };

    if (!url && !pastedText) {
      return NextResponse.json(
        { error: "Provide either a URL or pasted text." },
        { status: 400 }
      );
    }

    let scraped: ScrapedContent;

    if (pastedText && pastedText.trim().length > 50) {
      scraped = {
        url: url || "manual-input",
        title: "Manual paste",
        metaDescription: "",
        headings: { h1: [], h2: [], h3: [] },
        ctas: [],
        bodyText: pastedText.slice(0, 8000),
        wordCount: pastedText.split(/\s+/).length,
      };
    } else {
      try {
        scraped = await scrapeUrl(url!);
      } catch (e: any) {
        return NextResponse.json(
          {
            error: "Could not fetch that URL. The site may block bots or be unreachable.",
            hint: "Paste the homepage text manually instead.",
            details: e.message,
          },
          { status: 422 }
        );
      }
    }

    if (scraped.bodyText.length < 100) {
      return NextResponse.json(
        { error: "Not enough content to analyze. Try pasting the homepage text manually." },
        { status: 422 }
      );
    }

    const result = await analyzeContent(scraped);
    return NextResponse.json(result);
  } catch (e: any) {
    console.error("analyze error:", e);
    return NextResponse.json(
      { error: "Analysis failed.", details: e.message },
      { status: 500 }
    );
  }
}
