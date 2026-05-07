import { NextRequest, NextResponse } from "next/server";
import { jsPDF } from "jspdf";
import { AnalysisResult } from "@/lib/analyzer";
import { getSession } from "@/lib/session";
import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const maxDuration = 30;

const INDIGO: [number, number, number] = [30, 42, 138];
const INDIGO_DEEP: [number, number, number] = [20, 27, 92];
const LAVENDER: [number, number, number] = [216, 217, 242];
const LAVENDER_MIST: [number, number, number] = [242, 243, 250];
const INK: [number, number, number] = [10, 10, 10];
const MUTED: [number, number, number] = [90, 92, 114];

async function loadDiagramPng(): Promise<Buffer | null> {
  try {
    const p = path.join(process.cwd(), "public", "diagrams", "architecture.png");
    return await fs.readFile(p);
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session.authenticated) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const result = (await req.json()) as AnalysisResult;
  const diagramBuf = await loadDiagramPng();

  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 56;
  let y = 0;

  const setFill = (c: [number, number, number]) => doc.setFillColor(c[0], c[1], c[2]);
  const setText = (c: [number, number, number]) => doc.setTextColor(c[0], c[1], c[2]);
  const setDraw = (c: [number, number, number]) => doc.setDrawColor(c[0], c[1], c[2]);

  const ensureSpace = (needed: number) => {
    if (y + needed > H - 60) {
      addFooter();
      doc.addPage();
      y = M;
    }
  };

  const writeWrapped = (
    text: string,
    size: number,
    weight: "normal" | "bold" | "italic",
    lineH: number,
    color: [number, number, number] = INK,
    indent = 0
  ) => {
    doc.setFontSize(size);
    doc.setFont("helvetica", weight);
    setText(color);
    const lines = doc.splitTextToSize(text, W - M * 2 - indent);
    for (const line of lines) {
      ensureSpace(lineH);
      doc.text(line, M + indent, y);
      y += lineH;
    }
  };

  const sectionLabel = (label: string) => {
    ensureSpace(28);
    setText(INDIGO);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(label.toUpperCase(), M, y);
    y += 16;
  };

  const rule = () => {
    ensureSpace(20);
    setDraw([220, 222, 240]);
    doc.setLineWidth(0.5);
    doc.line(M, y, W - M, y);
    y += 18;
  };

  const addFooter = () => {
    setText(MUTED);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text("Lucid · Built for Levvate · Powered by Claude Sonnet 4.5", M, H - 30);
    doc.text(
      `Page ${doc.getCurrentPageInfo().pageNumber}`,
      W - M, H - 30, { align: "right" }
    );
  };

  // === COVER HEADER ===
  setFill(INDIGO);
  doc.rect(0, 0, W, 140, "F");

  setText([255, 255, 255]);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("LUCID  ·  CLARITY ENGINE FOR LEVVATE", M, 40);

  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  const title = (result.title || result.url).slice(0, 70);
  const titleLines = doc.splitTextToSize(title, W - M * 2);
  let ty = 75;
  for (const line of titleLines.slice(0, 2)) {
    doc.text(line, M, ty);
    ty += 30;
  }

  setText(LAVENDER);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(result.url, M, 125);

  y = 180;

  // === SCORE BLOCK ===
  setFill(LAVENDER_MIST);
  doc.roundedRect(M, y, W - M * 2, 110, 8, 8, "F");

  setText(INDIGO);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("CLARITY SCORE", M + 24, y + 28);

  setText(INDIGO);
  doc.setFontSize(56);
  doc.setFont("helvetica", "bold");
  doc.text(`${result.clarity_score}`, M + 24, y + 88);

  setText(MUTED);
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  const scoreNumWidth = doc.getTextWidth(`${result.clarity_score}`);
  doc.text(" / 10", M + 24 + scoreNumWidth * 1.6, y + 88);

  setText(INK);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  const verdict =
    result.clarity_score >= 8 ? "Strong clarity"
    : result.clarity_score >= 6 ? "Solid foundation, room to sharpen"
    : result.clarity_score >= 4 ? "Mixed signals, focus the message"
    : "Confused messaging, urgent rewrite";
  setText(INDIGO);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("VERDICT", W - M - 200, y + 28);
  setText(INK);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  const vLines = doc.splitTextToSize(verdict, 200);
  let vy = y + 48;
  for (const l of vLines) { doc.text(l, W - M - 200, vy); vy += 14; }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  setText(INDIGO);
  doc.text(`Analyzed ${new Date(result.analyzed_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, W - M - 200, y + 90);

  y += 140;

  sectionLabel("What this business does");
  writeWrapped(result.business_summary, 13, "normal", 18, INK);
  y += 8;

  sectionLabel("Target audience");
  writeWrapped(result.target_audience, 11, "normal", 16, [60, 60, 80]);
  y += 8;

  rule();

  // === RUBRIC ===
  sectionLabel("Rubric breakdown");

  const rubricEntries: [string, { score: number; reasoning: string }][] = [
    ["Value proposition", result.rubric.value_proposition],
    ["Audience clarity", result.rubric.audience_clarity],
    ["CTA strength", result.rubric.cta_strength],
    ["Jargon level", result.rubric.jargon_level],
    ["Scannability", result.rubric.scannability],
  ];

  for (const [label, item] of rubricEntries) {
    ensureSpace(56);
    setText(INK);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(label, M, y);
    setText(INDIGO);
    doc.setFontSize(13);
    doc.text(`${item.score}/10`, W - M, y, { align: "right" });
    y += 12;

    setFill(LAVENDER_MIST);
    doc.roundedRect(M, y, W - M * 2, 5, 2.5, 2.5, "F");
    setFill(INDIGO);
    doc.roundedRect(M, y, ((W - M * 2) * item.score) / 10, 5, 2.5, 2.5, "F");
    y += 14;

    setText(MUTED);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const reasonLines = doc.splitTextToSize(item.reasoning, W - M * 2);
    for (const l of reasonLines) {
      ensureSpace(11);
      doc.text(l, M, y);
      y += 11;
    }
    y += 10;
  }

  rule();

  // === HIGHLIGHTS ===
  ensureSpace(140);
  const colW = (W - M * 2 - 20) / 2;

  setText(INDIGO);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("WORKING", M, y);

  let leftY = y + 16;
  for (const s of result.highlights.strong) {
    setText(INDIGO);
    doc.setFont("helvetica", "bold");
    doc.text("+", M, leftY);
    setText(INK);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(s, colW - 14);
    for (const line of lines) {
      doc.text(line, M + 14, leftY);
      leftY += 13;
    }
    leftY += 4;
  }

  let rightY = y + 16;
  setText(INDIGO);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("HURTING CLARITY", M + colW + 20, y);

  for (const w of result.highlights.weak) {
    setText(MUTED);
    doc.setFont("helvetica", "bold");
    doc.text("-", M + colW + 20, rightY);
    setText(INK);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(w, colW - 14);
    for (const line of lines) {
      doc.text(line, M + colW + 34, rightY);
      rightY += 13;
    }
    rightY += 4;
  }

  y = Math.max(leftY, rightY) + 6;
  rule();

  // === SUGGESTIONS ===
  sectionLabel("Recommendations");

  result.suggestions.forEach((s, i) => {
    ensureSpace(100);

    const priorityColor = s.priority === "high" ? INDIGO : s.priority === "medium" ? INDIGO_DEEP : MUTED;
    setFill(priorityColor);
    doc.roundedRect(M, y, 70, 16, 8, 8, "F");
    setText([255, 255, 255]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(s.priority.toUpperCase(), M + 35, y + 11, { align: "center" });

    setText(INK);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    const issueLines = doc.splitTextToSize(`${i + 1}. ${s.issue}`, W - M * 2 - 80);
    let iy = y + 12;
    for (const line of issueLines) {
      doc.text(line, M + 80, iy);
      iy += 14;
    }
    y = Math.max(y + 24, iy) + 4;

    setText(MUTED);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("FIX", M, y);
    setText(INK);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const recLines = doc.splitTextToSize(s.recommendation, W - M * 2 - 30);
    let ry = y;
    for (const line of recLines) {
      ensureSpace(12);
      doc.text(line, M + 30, ry);
      ry += 12;
    }
    y = ry + 6;

    const exLines = doc.splitTextToSize(s.example, W - M * 2 - 40);
    const blockH = 18 + exLines.length * 11 + 8;
    ensureSpace(blockH);
    setFill(LAVENDER_MIST);
    doc.roundedRect(M, y, W - M * 2, blockH, 6, 6, "F");
    setText(INDIGO);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("TRY", M + 14, y + 14);
    setText(INK);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    let ey = y + 28;
    for (const line of exLines) {
      doc.text(line, M + 14, ey);
      ey += 11;
    }
    y += blockH + 14;
  });

  // === ARCHITECTURE DIAGRAM PAGE ===
  if (diagramBuf) {
    doc.addPage();
    y = M;

    setFill(INDIGO);
    doc.rect(0, 0, W, 6, "F");

    sectionLabel("How this report was generated");
    writeWrapped(
      "Lucid analyzes every site through the same pipeline. Raw HTML is parsed, cleaned, and structured into channels (headings, CTAs, body) before Claude Sonnet 4.5 scores it against a 5-dimension rubric. The diagram below maps the full system.",
      10, "normal", 14, INK
    );
    y += 8;

    try {
      const imgW = W - M * 2;
      const imgH = (imgW * 700) / 1200; // diagram is 1200x700
      ensureSpace(imgH + 30);
      const dataUrl = `data:image/png;base64,${diagramBuf.toString("base64")}`;
      doc.addImage(dataUrl, "PNG", M, y, imgW, imgH, undefined, "FAST");
      y += imgH + 12;

      setText(MUTED);
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.text("Figure 1: Lucid system architecture, end to end.", W / 2, y, { align: "center" });
      y += 18;
    } catch (e) {
      writeWrapped("[Architecture diagram could not be embedded]", 9, "italic", 12, MUTED);
    }

    rule();
    setText(INDIGO);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("WHY THIS DESIGN", M, y);
    y += 14;
    setText(INK);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const designNotes = [
      "Single Next.js app keeps frontend and API in one deploy. No infrastructure split, no CORS plumbing.",
      "Cheerio for parsing instead of a headless browser: fewer dependencies, faster cold starts on serverless.",
      "Channel-structured prompt (title, headings, CTAs, body separated) gives Claude reasoning surface that a flat blob does not.",
      "5-dimension rubric averaged for the score, with reasoning per dimension. Reproducible across very different sites.",
      "Em-dash sanitizer runs deeply through the parsed JSON tree as a post-processing pass.",
    ];
    for (const note of designNotes) {
      const lines = doc.splitTextToSize("• " + note, W - M * 2);
      for (const line of lines) {
        ensureSpace(13);
        doc.text(line, M, y);
        y += 13;
      }
      y += 4;
    }
  }

  addFooter();

  const buf = Buffer.from(doc.output("arraybuffer"));
  return new NextResponse(buf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="lucid-report-${Date.now()}.pdf"`,
    },
  });
}
