'use client'

import { useState } from 'react'
import ROICalculator from '@/components/ROICalculator'

export default function LandingPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setSubmitted(true)
        setEmail('')
      } else {
        alert('Something went wrong. Please try again.')
      }
    } catch (err) {
      console.error(err)
      alert('Error submitting email.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-green-50 text-gray-900 flex flex-col items-center px-6 py-16">
      {/* Hero */}
      <section className="max-w-3xl text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-green-700">
          Turn Your Product Reviews into Actionable Insights
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          InsightBoard helps you automatically analyze thousands of reviews,
          summarize feedback, and uncover what your customers really think — in minutes.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="px-4 py-3 rounded-lg border border-gray-300 w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-60"
            >
              {loading ? 'Joining...' : 'Join the Waitlist'}
            </button>
          </form>
        ) : (
          <p className="mt-6 text-green-700 font-medium">
            ✅ Thanks for joining! We’ll let you know when InsightBoard launches.
          </p>
        )}
      </section>

      {/* Benefits */}
      <section className="mt-24 max-w-5xl grid md:grid-cols-3 gap-10 text-center">
        <div className="p-6 bg-white shadow-sm rounded-2xl border">
          <h3 className="text-xl font-semibold text-green-700">AI-Powered Analysis</h3>
          <p className="mt-2 text-gray-600">
            Automatically summarize thousands of reviews and highlight what customers love and hate.
          </p>
        </div>
        <div className="p-6 bg-white shadow-sm rounded-2xl border">
          <h3 className="text-xl font-semibold text-green-700">Save Hours Weekly</h3>
          <p className="mt-2 text-gray-600">
            No more manual data cleaning — InsightBoard turns raw CSVs into actionable dashboards.
          </p>
        </div>
        <div className="p-6 bg-white shadow-sm rounded-2xl border">
          <h3 className="text-xl font-semibold text-green-700">Make Smarter Decisions</h3>
          <p className="mt-2 text-gray-600">
            Understand your customers faster and adapt your product based on real sentiment data.
          </p>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="mt-24 max-w-3xl w-full text-center">
        <h2 className="text-3xl font-bold text-green-700">Estimate Your ROI</h2>
        <p className="mt-2 text-gray-600">
          See how much time and money you could save each month with InsightBoard.
        </p>
        <div className="mt-8">
          <ROICalculator />
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-24 text-gray-500 text-sm">
        © {new Date().getFullYear()} InsightBoard. All rights reserved.
      </footer>
    </main>
  )
}