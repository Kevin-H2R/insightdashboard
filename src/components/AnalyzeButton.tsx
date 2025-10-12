'use client'

import { useState } from 'react'

export default function AnalyzeButton({ datasetId }: { datasetId: string }) {
  const [loading, setLoading] = useState(false)

  const handleAnalyze = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/analyze/${datasetId}`, { method: 'POST' })
      if (!res.ok) throw new Error('Failed to analyze dataset')
      alert('✅ Analysis complete!')
    } catch (err) {
      console.error(err)
      alert('❌ Error analyzing dataset')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleAnalyze}
      disabled={loading}
      className={`mt-3 inline-flex items-center justify-center px-4 py-2 rounded-xl font-medium transition 
        ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg'
        }`}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Analyzing...
        </div>
      ) : (
        'Run Analysis'
      )}
    </button>
  )
}