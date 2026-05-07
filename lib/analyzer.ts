import Anthropic from "@anthropic-ai/sdk";
import { ScrapedContent } from "./scraper";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface ClaritySuggestion {
  issue: string;
  recommendation: string;
  example: string;
  priority: "high" | "medium" | "low";
}

export interface ClarityRubric {
  value_proposition: { score: number; reasoning: string };
  audience_clarity: { score: number; reasoning: string };
  cta_strength: { score: number; reasoning: string };
  jargon_level: { score: number; reasoning: string };
  scannability: { score: number; reasoning: string };
}

export interface AnalysisResult {
  url: string;
  title: string;
  business_summary: string;
  target_audience: string;
  clarity_score: number;
  rubric: ClarityRubric;
  suggestions: ClaritySuggestion[];
  highlights: { strong: string[]; weak: string[] };
  analyzed_at: string;
}

const SYSTEM_PROMPT = `You are a senior conversion copywriter and product marketing expert evaluating website messaging clarity for Lucid, a tool built in the spirit of Levvate's free site assessment.

You analyze websites against a 5-dimension rubric and return strict JSON. You are direct, specific, and actionable. You never use the em dash character. Use commas, periods, semicolons, or parentheses instead.

Rubric (each scored 1 to 10):
1. value_proposition: Is it instantly clear what the product or service does and why it matters?
2. audience_clarity: Is the target customer obvious from the copy?
3. cta_strength: Are the calls to action specific, visible, and aligned with intent?
4. jargon_level: Is the language accessible (10) or buried in jargon (1)?
5. scannability: Can a visitor grasp the offering in under 10 seconds of scanning?

The overall clarity_score is the rounded average of the 5 rubric scores.

Suggestions must be specific to the site. Never give generic advice like "improve your headline." Always quote or paraphrase what is currently there and propose a concrete replacement.`;

const USER_PROMPT = (c: ScrapedContent) => `Analyze the following website for messaging clarity.

URL: ${c.url}
PAGE TITLE: ${c.title}
META DESCRIPTION: ${c.metaDescription || "(none)"}

H1 HEADINGS:
${c.headings.h1.map((h) => "- " + h).join("\n") || "(none)"}

H2 HEADINGS:
${c.headings.h2.map((h) => "- " + h).join("\n") || "(none)"}

H3 HEADINGS:
${c.headings.h3.map((h) => "- " + h).join("\n") || "(none)"}

CALLS TO ACTION FOUND:
${c.ctas.map((t) => "- " + t).join("\n") || "(none detected)"}

BODY COPY (truncated):
${c.bodyText.slice(0, 6000)}

Return ONLY a JSON object matching this schema, no prose, no markdown fences:

{
  "business_summary": "1 to 2 sentences describing what this business does. Plain English.",
  "target_audience": "Who this is for, in one sentence.",
  "rubric": {
    "value_proposition": { "score": 1-10, "reasoning": "1 sentence" },
    "audience_clarity":  { "score": 1-10, "reasoning": "1 sentence" },
    "cta_strength":      { "score": 1-10, "reasoning": "1 sentence" },
    "jargon_level":      { "score": 1-10, "reasoning": "1 sentence" },
    "scannability":      { "score": 1-10, "reasoning": "1 sentence" }
  },
  "suggestions": [
    {
      "issue": "what is wrong, referencing actual site copy",
      "recommendation": "what to change",
      "example": "concrete rewrite or example, in quotes",
      "priority": "high" | "medium" | "low"
    }
  ],
  "highlights": {
    "strong": ["2 to 3 things this site does well, specific"],
    "weak":   ["2 to 3 things hurting clarity, specific"]
  }
}

Provide exactly 3 suggestions, ordered by priority (highest first). Do not use em dashes anywhere. Use commas or periods.`;

export async function analyzeContent(c: ScrapedContent): Promise<AnalysisResult> {
  const msg = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 2000,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: USER_PROMPT(c) }],
  });

  const text = msg.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text).join("");

  const clean = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
  const parsed = JSON.parse(clean);

  const rubric = parsed.rubric as ClarityRubric;
  const avg =
    (rubric.value_proposition.score +
      rubric.audience_clarity.score +
      rubric.cta_strength.score +
      rubric.jargon_level.score +
      rubric.scannability.score) / 5;

  const sanitize = (s: string) => s.replace(/\u2014/g, ",").replace(/\u2013/g, "-");
  const deepClean = (obj: any): any => {
    if (typeof obj === "string") return sanitize(obj);
    if (Array.isArray(obj)) return obj.map(deepClean);
    if (obj && typeof obj === "object") {
      const out: any = {};
      for (const k of Object.keys(obj)) out[k] = deepClean(obj[k]);
      return out;
    }
    return obj;
  };

  const cleaned = deepClean(parsed);

  return {
    url: c.url,
    title: c.title,
    business_summary: cleaned.business_summary,
    target_audience: cleaned.target_audience,
    clarity_score: Math.round(avg * 10) / 10,
    rubric: cleaned.rubric,
    suggestions: cleaned.suggestions,
    highlights: cleaned.highlights,
    analyzed_at: new Date().toISOString(),
  };
}
