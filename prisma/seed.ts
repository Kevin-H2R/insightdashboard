import { prisma } from '../src/lib/db'

async function main() {
  // Create a test user
  const user = await prisma.user.upsert({
    where: { email: 'test@insightboard.com' },
    update: {},
    create: {
      email: 'test@insightboard.com',
      name: 'Test User',
    },
  })

  // Create a dataset
  const dataset = await prisma.dataset.create({
    data: {
      name: 'Sample Product Reviews',
      description: 'Seed dataset for testing',
      userId: user.id,
      reviews: {
        create: [
          { productName: 'LV Leather Bag', text: 'Beautiful craftsmanship but strap broke', rating: 2 },
          { productName: 'LV Leather Bag', text: 'Perfect size, feels luxurious', rating: 5 },
          { productName: 'Fendi Wallet', text: 'Loved it! Great quality and packaging', rating: 5 },
        ],
      },
    },
    include: { reviews: true },
  })

  console.log('Seed completed:', { user, dataset })
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })