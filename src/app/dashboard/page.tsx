import AnalyzeButton from '@/components/AnalyzeButton'
import { prisma } from '@/lib/db'

export default async function DashboardPage() {
  const datasets = await prisma.dataset.findMany({
    include: { reviews: true, user: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">📊 Datasets</h1>
      <div className="space-y-4">
        {datasets.map(dataset => (
          <div key={dataset.id} className="p-4 border rounded-lg shadow-sm">
            <h2 className="font-semibold">{dataset.name}</h2>
            <p className="text-gray-500 text-sm">
              {dataset.description ?? 'No description'}
            </p>
            <p className="mt-2 text-sm">
              Reviews: <strong>{dataset.reviews.length}</strong>
            </p>
            <p className="text-xs text-gray-400">
              Created {new Date(dataset.createdAt).toLocaleString()}
            </p>
            <AnalyzeButton datasetId={dataset.id} />
          </div>
        ))}
      </div>
    </main>
  )
}