'use client'
import { useState } from 'react'
import AddressInput from './AddressInput'
import { ethers } from 'ethers'
import { getWriteContract } from '../lib/contract'

export default function TipForm() {
  const [to, setTo] = useState<string>('')
  const [amount, setAmount] = useState<string>('')
  const [note, setNote] = useState<string>('')
  const [handle, setHandle] = useState<string>('')
  const [publicTip, setPublicTip] = useState(true)
  const [busy, setBusy] = useState(false)

  const send = async () => {
    if (!to || !amount) return alert('Recipient and amount required')
    setBusy(true)
    try {
      const c = await getWriteContract()
      const value = ethers.parseEther(amount)

      console.log('Sending tip:', {
        to,
        note,
        handle,
        publicTip,
        value: amount,
      })

      const tx = await c.sendTip(to, note, handle, publicTip, { value })
      console.log('TX hash:', tx.hash)

      await tx.wait()
      setNote('')
      setAmount('')
      alert('✅ Tip sent!')
    } catch (e: any) {
      console.error('Tip error:', e)
      alert(e?.shortMessage || e?.reason || e?.message || 'Failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-4">
      <AddressInput onResolved={setTo} />
      <input
        className="border rounded px-3 py-2 w-full"
        placeholder="Amount in ETH"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        className="border rounded px-3 py-2 w-full"
        placeholder="Note (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <input
        className="border rounded px-3 py-2 w-full"
        placeholder="Your handle to attach (optional)"
        value={handle}
        onChange={(e) => setHandle(e.target.value)}
      />
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={publicTip}
          onChange={(e) => setPublicTip(e.target.checked)}
        />
        Make this tip public
      </label>
      <button
        onClick={send}
        disabled={busy || !to || !amount}
        className="px-4 py-2 rounded bg-emerald-600 text-white disabled:opacity-50"
      >
        {busy ? 'Sending...' : 'Send Tip'}
      </button>
    </div>
  )
}
