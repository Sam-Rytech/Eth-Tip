'use client'
import ProfileCard from '../components/ProfileCard'
import TipList from '../components/TipList'

export default function StatsPage() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <section className="p-6 rounded-lg border bg-white dark:bg-gray-900">
        <h2 className="font-semibold text-lg mb-4">Your Profile</h2>
        <ProfileCard />
      </section>
      <section className="p-6 rounded-lg border bg-white dark:bg-gray-900">
        <h2 className="font-semibold text-lg mb-4">Recent Public Tips</h2>
        <TipList maxCount={20} />
      </section>
    </div>
  )
}
