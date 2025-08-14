'use client'
import { useEffect, useState } from 'react'
import { getReadContract } from '../lib/contract'
import { ethers } from 'ethers'
import AddressDisplay from './AddressDisplay'

type Props = { maxCount?: number; personal?: boolean }

export default function TipList({ maxCount = 20, personal = false }: Props) {
  const [items, setItems] = useState<any[]>([])
  const [me, setMe] = useState<string>('')

  useEffect(() => {
    ;(async () => {
      const c = getReadContract()
      let tips: any[] = []
      if (personal) {
        const prov = new ethers.BrowserProvider(window.ethereum)
        const accs = await prov.listAccounts()
        const addr = accs[0]?.address
        if (!addr) return
        setMe(addr)
        // paginate sent tips
        const ids: bigint[] = await c.getSentTips(addr, 0, 50)
        for (const id of ids) tips.push(await c.getTip(id))
      } else {
        tips = await c.getPublicTips(maxCount)
      }
      setItems(tips)
    })()
  }, [maxCount, personal])

  if (!items.length) return <p>No tips yet.</p>

  return (
    <ul className="divide-y">
      {items.map((t, i) => (
        <li key={i} className="py-3 flex flex-col gap-1">
          <div className="flex flex-wrap gap-2 text-sm">
            <span>
              From: <AddressDisplay address={t.sender} />
            </span>
            <span>→</span>
            <span>
              To: <AddressDisplay address={t.recipient} />
            </span>
            <span className="ml-auto font-mono">
              {new Date(Number(t.sentAt) * 1000).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <div className="text-gray-600">{t.note || '—'}</div>
            <div className="font-semibold">
              {ethers.formatEther(t.value)} ETH
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
