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
   
  )
}
