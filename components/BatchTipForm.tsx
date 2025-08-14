'use client'
import { useState } from 'react'
import { ethers } from 'ethers'
import { addressFromENS, addressFromFC } from '../lib/nameResolver'
import { getWriteContract } from '../lib/contract'

export default function BatchTipForm() {
  const [list, setList] = useState<string>('')
  const [note, setNote] = useState<string>('')
  const [handle, setHandle] = useState<string>('')
  const [totalEth, setTotalEth] = useState<string>('')
  const [busy, setBusy] = useState(false)

  const resolveEntry = async (e: string): Promise<string | null> => {
    const v = e.trim()
    if (!v) return null
    if (v.startsWith('@')) return await addressFromFC(v)
    if (v.endsWith('.eth')) return await addressFromENS(v)
    return /^0x[a-fA-F0-9]{40}$/.test(v) ? v : null
  }

  const sendBatch = async () => {
    setBusy(true)
    try {
      const entries = list
        .split(/[\n,]+/)
        .map((s) => s.trim())
        .filter(Boolean)
      const resolved: string[] = []
      for (const e of entries) {
        const addr = await resolveEntry(e)
        if (addr) resolved.push(addr)
      }
      if (resolved.length === 0) return alert('No valid recipients')
      const value = ethers.parseEther(totalEth || '0')
      const c = await getWriteContract()
      const tx = await c.sendBatchTips(resolved, note, handle, { value })
      await tx.wait()
      alert('Batch tips sent!')
      setList('')
      setNote('')
      setTotalEth('')
    } catch (e: any) {
      alert(e?.shortMessage || e?.message || 'Failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-3">
      <textarea
        className="border rounded px-3 py-2 w-full h-28"
        placeholder="Recipients: @farcaster, name.base.eth, or 0x... (comma/newline separated)"
        value={list}
        onChange={(e) => setList(e.target.value)}
      />
      <input
        className="border rounded px-3 py-2 w-full"
        placeholder="Total ETH to distribute equally"
        value={totalEth}
        onChange={(e) => setTotalEth(e.target.value)}
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
      <button
        onClick={sendBatch}
        disabled={busy}
        className="px-4 py-2 rounded bg-emerald-600 text-white disabled:opacity-50"
      >
        {busy ? 'Sending...' : 'Send Batch'}
      </button>
    </div>
  )
}
