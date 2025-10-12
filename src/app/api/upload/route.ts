import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
  const reviews = await req.json()

  const user = await prisma.user.findFirst()
  if (!user) return NextResponse.json({ error: 'No user found' }, { status: 400 })

  const dataset = await prisma.dataset.create({
    data: {
      name: `Upload ${new Date().toLocaleString()}`,
      userId: user.id,
      reviews: {
        create: reviews.map((r: any) => ({
          productName: r.product_name || r.productName || 'Unknown Product',
          text: r.review_text || r.text || '',
          rating: Number(r.rating) || null,
        })),
      },
    },
  })

  return NextResponse.json({ success: true, dataset })
}