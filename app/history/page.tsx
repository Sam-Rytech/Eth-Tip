'use client'
import TipList from '../../components/TipList'

export default function HistoryPage() {
  return (
    <div className="p-6 rounded-lg border bg-white dark:bg-gray-900">
      <h2 className="font-semibold text-lg mb-4">Your Tip History</h2>
      <TipList personal />
    </div>
  )
}