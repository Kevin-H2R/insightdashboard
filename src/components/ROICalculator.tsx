'use client'

import { useState } from 'react'

export default function ROICalculator() {
  const [numReviews, setNumReviews] = useState(1000)
  const [minutesPerReview, setMinutesPerReview] = useState(2)
  const [hourlyRate, setHourlyRate] = useState(30)

  const hoursSaved = (numReviews * minutesPerReview) / 60
  const moneySaved = hoursSaved * hourlyRate
  const reducedTime = Math.round(hoursSaved * 0.9) // assume AI reduces 90% of manual effort

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 border text-left">
      <div className="grid sm:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Number of Reviews</label>
          <input
            type="number"
            value={numReviews}
            onChange={e => setNumReviews(Number(e.target.value))}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Minutes per Review (manual)</label>
          <input
            type="number"
            value={minutesPerReview}
            onChange={e => setMinutesPerReview(Number(e.target.value))}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Hourly Rate ($)</label>
          <input
            type="number"
            value={hourlyRate}
            onChange={e => setHourlyRate(Number(e.target.value))}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="mt-6 text-center">
        <h3 className="text-lg font-semibold text-green-700 mb-1">
          You could save approximately
        </h3>
        <p className="text-2xl font-bold text-gray-900">
          {reducedTime.toLocaleString()} hours
        </p>
        <p className="text-gray-600 mt-1">
          Worth around <span className="font-semibold text-green-700">${moneySaved.toLocaleString()}</span> of manual work per dataset
        </p>
      </div>
    </div>
  )
}