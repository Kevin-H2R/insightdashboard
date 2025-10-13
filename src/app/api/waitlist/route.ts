import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { email } = await req.json()
  await prisma.waitlist.upsert({
    where: { email },
    update: {},
    create: { email },
  })
  return NextResponse.json({ success: true })
}