'use client'
import { useState } from 'react'
import { getWriteContract } from '../lib/contract'

export default function RegisterHandle() {
  const [handle, setHandle] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async () => {
    setBusy(true)
    try {
      const c = await getWriteContract()
      const tx = await c.changeHandle(handle)
      await tx.wait()
      alert('Handle updated!')
    } catch (e: any) {
      alert(e?.shortMessage || e?.message || 'Failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-2">
      <input
        className="border rounded px-3 py-2 w-full"
        placeholder="Your Farcaster handle (optional)"
        value={handle}
        onChange={(e) => setHandle(e.target.value)}
      />
      <button
        disabled={busy || !handle}
        onClick={submit}
        className="px-4 py-2 rounded bg-indigo-600 text-white disabled:opacity-50"
      >
        {busy ? 'Saving...' : 'Save Handle'}
      </button>
    </div>
  )
}
