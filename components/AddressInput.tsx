'use client'
import { useState } from 'react'
import { addressFromENS, addressFromFC } from '../lib/nameResolver'
import { isAddressLike, isENS, isFC } from '../lib/utils'

export default function AddressInput({
  onResolved,
}: {
  onResolved: (address: string) => void
}) {
  const [raw, setRaw] = useState('')

  const resolve = async () => {
    if (isAddressLike(raw)) return onResolved(raw)

    if (isENS(raw)) {
      const a = await addressFromENS(raw)
      if (a) return onResolved(a)
    }

    if (isFC(raw)) {
      const a = await addressFromFC(raw)
      if (a) return onResolved(a)
    }

    alert('Could not resolve input')
  }

  return (
    <div className="flex gap-2">
      <input
        className="border rounded px-3 py-2 w-full"
        placeholder="@fName | name.base.eth | 0x..."
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
      />
      <button
        className="px-4 py-2 rounded bg-green-600 text-white"
        onClick={resolve}
      >
        Resolve
      </button>
    </div>
  )
}
