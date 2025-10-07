'use client'

import Papa from 'papaparse'
import { useState } from 'react'

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<string | null>(null)

  const handleUpload = async () => {
    if (!file) return
    setStatus('Uploading...')

    Papa.parse(file, {
      header: true,
      complete: async (results: any) => {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(results.data),
        })

        if (res.ok) setStatus('✅ Uploaded successfully!')
        else setStatus('❌ Upload failed')
      },
    })
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Upload Reviews CSV</h1>
      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
      <button
        onClick={handleUpload}
        className="ml-3 bg-green-600 text-white px-4 py-2 rounded"
      >
        Upload
      </button>
      {status && <p className="mt-3 text-sm">{status}</p>}
    </main>
  )
}