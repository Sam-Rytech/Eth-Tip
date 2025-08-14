'use client'

import ConnectButton from '../components/ConnectButton'
import RegisterHandle from '../components/RegisterHandle'
import TipForm from '../components/TipForm'
import BatchTipForm from '../components/BatchTipForm'

export default function Home() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <section className="p-6 rounded-lg border bg-white dark:bg-gray-900">
        <h2 className="font-semibold text-lg mb-4">Connect & Register</h2>
        <ConnectButton />
        <div className="mt-6">
          <RegisterHandle />
        </div>
      </section>

      <section className="p-6 rounded-lg border bg-white dark:bg-gray-900">
        <h2 className="font-semibold text-lg mb-4">Send a Tip</h2>
        <TipForm />
      </section>

      <section className="p-6 rounded-lg border bg-white dark:bg-gray-900 md:col-span-2">
        <h2 className="font-semibold text-lg mb-4">Batch Tips</h2>
        <BatchTipForm />
      </section>
    </div>
  )
}
