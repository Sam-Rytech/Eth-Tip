'use client'
import { useEffect, useState } from 'react'
import { getReadContract, getWriteContract } from '../lib/contract'
import { ethers } from 'ethers'

export default function OwnerActions() {
  const [owner, setOwner] = useState<string>('')
  const [me, setMe] = useState<string>('')
  const [summary, setSummary] = useState<{
    totalTips: bigint
    balance: bigint
    fees: bigint
  } | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    ;(async () => {
      const c = getReadContract()
      // owner is public in your contract as contractOwner()
      const ownerAddr: string = await c.contractOwner()
      setOwner(ownerAddr)

      const [totalTips, balance, fees] = await c.getContractSummary()
      setSummary({ totalTips, balance, fees })

      if (window.ethereum) {
        const prov = new ethers.BrowserProvider(window.ethereum)
        const accs = await prov.listAccounts()
        setMe(accs[0]?.address || '')
      }
    })()
  }, [])

  const claimFees = async () => {
    setBusy(true)
    try {
      const c = await getWriteContract()
      const tx = await c.claimFees()
      await tx.wait()
      alert('Fees claimed')
    } catch (e: any) {
      alert(e?.shortMessage || e?.message || 'Failed')
    } finally {
      setBusy(false)
    }
  }

  const emergencyWithdrawAll = async () => {
    setBusy(true)
    try {
      const c = await getWriteContract()
      const tx = await c.emergencyWithdrawAll()
      await tx.wait()
      alert('Emergency withdraw complete')
    } catch (e: any) {
      alert(e?.shortMessage || e?.message || 'Failed')
    } finally {
      setBusy(false)
    }
  }

  const isOwner = me && owner && me.toLowerCase() === owner.toLowerCase()

  return (
    <div className="space-y-3">
      <div>
        <span className="font-semibold">Owner:</span> {owner}
      </div>
      {summary && (
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="p-3 rounded border">
            <div className="text-gray-500">Total Tips</div>
            <div className="font-semibold">{summary.totalTips.toString()}</div>
          </div>
          <div className="p-3 rounded border">
            <div className="text-gray-500">Contract Balance</div>
            <div className="font-semibold">
              {ethers.formatEther(summary.balance)} ETH
            </div>
          </div>
          <div className="p-3 rounded border">
            <div className="text-gray-500">Fees Accumulated</div>
            <div className="font-semibold">
              {ethers.formatEther(summary.fees)} ETH
            </div>
          </div>
        </div>
      )}

      {isOwner ? (
        <div className="flex gap-3">
          <button
            onClick={claimFees}
            disabled={busy}
            className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
          >
            Claim Fees
          </button>
          <button
            onClick={emergencyWithdrawAll}
            disabled={busy}
            className="px-4 py-2 rounded bg-red-600 text-white disabled:opacity-50"
          >
            Emergency Withdraw
          </button>
        </div>
      ) : (
        <p className="text-sm text-gray-500">
          Connect as the contract owner to manage fees.
        </p>
      )}
    </div>
  )
}
