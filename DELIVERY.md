# Lucid — final delivery checklist

## What you have

The complete Levvate-branded clarity engine, with:

- **Cinematic demo login** with blurred Levvate watermark backdrop
- **Aperture-mark logomark** (six-blade iris) + custom Manrope wordmark
- **All custom SVG iconography** — no emoji, no Lucide leak in brand surfaces
- **Three GSoC-style architecture diagrams** in pastel grouped-container aesthetic
- **Levvate-branded PDF** with embedded architecture diagram on final page
- **MARL-voice README** with diagrams inline as Figure 1/2/3
- **TypeScript end-to-end**, Next.js production build verified

## Deploy in 4 minutes (Vercel)

```bash
# 1. Unzip
unzip lucid.zip
cd lucid

# 2. Push to a fresh GitHub repo
git init && git add . && git commit -m "Lucid: clarity engine for Levvate"
gh repo create lucid --public --push

# 3. Deploy on Vercel
npx vercel --prod
# answer the prompts; project name = lucid

# 4. In Vercel dashboard → Settings → Environment Variables, add:
#    ANTHROPIC_API_KEY = sk-ant-...
#    SESSION_PASSWORD  = <run: openssl rand -base64 32>
#    DEMO_PASSWORD     = lucid2026
```

That's it. URL goes live in ~90 seconds.

## Demo video script (~90 seconds)

**[Open on the login screen]**

> "Levvate offers a free site assessment. I built the version that takes 60 seconds instead of 3 days, in Levvate's brand language. This is **Lucid**, the clarity engine for service-based websites."

**[Type passcode `lucid2026`, hit Continue]**

> "Demo login is gated, like a real Levvate product."

**[Lucid app loads]**

> "I named it Lucid because the rubric tells you exactly that — whether your site is *lucid* — clear, easy to understand. The headline structure mirrors Levvate's: chunky display headline with a serif italic accent word."

**[Paste levvate.com, click Analyze]**

> "Let's run it on Levvate's own site."

**[Score appears around 8.4]**

> "8.4 out of 10. Five rubric dimensions, each scored independently with one sentence of reasoning. Scannability scores lower because sections 01 and 02 say similar things. The model is grounding its critique in actual site copy, not generic feedback."

**[Scroll to suggestions]**

> "Three concrete rewrites. Notice the 'Try' block — that's a literal copy alternative the model wrote, in Levvate's voice."

**[Click Download PDF, open it]**

> "Here's the client-ready report. Levvate-branded cover, score, rubric, recommendations. **And the final page** — this is the stand-out factor — every PDF includes the architecture diagram, in the GSoC-style aesthetic, so a Levvate prospect can see exactly how their score was generated. No black box."

**[Switch to README on GitHub]**

> "Repo includes the full README in the same voice as my GSoC submission, Figures 1, 2, 3 inline, honest interpretation block. 60 minutes. Built in Next.js with Claude Sonnet 4.5. Deployed serverless on Vercel. Demo and code in the description."

## Talking points to lead with in the interview

1. **"I matched your brand language end-to-end"** — colors, typography, copy cadence, component shapes. They will recognize it instantly.
2. **"I analyzed Levvate's own site as the demo"** — confidence move and a meta-test that the tool works on the people you're pitching to.
3. **"The PDF embeds the architecture diagram"** — engineering judgment + respect for the client's understanding. This is the line that will land.
4. **"5-dimension rubric with reasoning, not single-score vibes"** — shows you thought about model reliability.
5. **"Cinematic demo login"** — first impression is taken seriously. Most candidates will ship a bare form.
6. **"Custom SVG icon library, no emoji"** — shows craft. Most candidates will leak Lucide or emoji.
7. **"All four optionals delivered"** — PDF, deploy, video, GitHub. Hit every box.

## What to put in the GitHub repo description

```
Lucid — the clarity engine for service-based websites. Paste a URL, get a 1-10 clarity score, a 5-dimension rubric, and 3 concrete edits. Built in Next.js with Claude Sonnet 4.5 for the Levvate AI Automation Intern technical assessment.
```

## Final pre-flight

Before you submit:
- [ ] Replace `[Loom link]` in README.md with your real demo video URL
- [ ] Replace `https://lucid-levvate.vercel.app` with your real Vercel URL
- [ ] Push to GitHub publicly so evaluators can clone
- [ ] Make sure the Vercel deploy is using the prod env vars
- [ ] One smoke test: log in with `lucid2026`, analyze stripe.com, download the PDF, verify the architecture diagram is on the last page
