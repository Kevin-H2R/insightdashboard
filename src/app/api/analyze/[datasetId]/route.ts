import { NextResponse } from "next/server";
import { prisma } from '@/lib/db'
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(
  req: Request,
  { params }: { params: { datasetId: string } }
) {
  const { datasetId } = params;

  // 1️⃣ Fetch reviews for this dataset
  const reviews = await prisma.review.findMany({
    where: { datasetId },
    select: { id: true, text: true },
  });

  if (!reviews.length) {
    return NextResponse.json({ error: "No reviews found" }, { status: 404 });
  }

  // 2️⃣ Optional: classify each review’s sentiment individually
  // (You can skip this if you just want the global summary)
  for (const review of reviews) {
    if (!review.text) continue;

    const sentimentPrompt = `
      Classify this review as "positive", "neutral", or "negative":
      "${review.text}"
      Reply ONLY with one word.
    `;

    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: sentimentPrompt }],
    });

    const sentiment = res.choices[0].message?.content?.trim().toLowerCase();
    if (sentiment && ["positive", "neutral", "negative"].includes(sentiment)) {
      await prisma.review.update({
        where: { id: review.id },
        data: { sentiment },
      });
    }
  }

  // 3️⃣ Aggregate counts
  const counts = await prisma.review.groupBy({
    by: ["sentiment"],
    where: { datasetId },
    _count: { sentiment: true },
  });

  const sentimentCounts = {
    positive: counts.find((c) => c.sentiment === "positive")?._count.sentiment || 0,
    neutral: counts.find((c) => c.sentiment === "neutral")?._count.sentiment || 0,
    negative: counts.find((c) => c.sentiment === "negative")?._count.sentiment || 0,
  };
  const total = reviews.length;

  // 4️⃣ Ask OpenAI for summary, positives, and negatives
  const reviewTexts = reviews.map((r) => r.text).join("\n\n");

  const summaryPrompt = `
  Analyze these customer reviews and provide:
  - A short overall summary paragraph.
  - A list (max 5 items) of common positive themes.
  - A list (max 5 items) of common negative themes.
  Return JSON with fields: summary, positives, negatives.

  Reviews:
  ${reviewTexts.slice(0, 8000)}  // limit tokens for safety
  `;

  const analysisRes = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: summaryPrompt }],
    response_format: { type: "json_object" },
  });

  const analysisJson = JSON.parse(
    analysisRes.choices[0].message?.content ?? "{}"
  );

  // 5️⃣ Save to DB
  const analysis = await prisma.analysis.upsert({
    where: { datasetId },
    update: {
      summary: analysisJson.summary,
      positives: analysisJson.positives || [],
      negatives: analysisJson.negatives || [],
      positiveCount: sentimentCounts.positive,
      neutralCount: sentimentCounts.neutral,
      negativeCount: sentimentCounts.negative,
      totalReviews: total,
    },
    create: {
      datasetId,
      summary: analysisJson.summary,
      positives: analysisJson.positives || [],
      negatives: analysisJson.negatives || [],
      positiveCount: sentimentCounts.positive,
      neutralCount: sentimentCounts.neutral,
      negativeCount: sentimentCounts.negative,
      totalReviews: total,
    },
  });

  return NextResponse.json({ success: true, analysis });
}