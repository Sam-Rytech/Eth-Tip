'use client'
import { useEffect, useState } from 'react'
import { getReadContract } from '../lib/contract'
import { ethers } from 'ethers'
import AddressDisplay from './AddressDisplay'

export default function ProfileCard() {
  const [acct, setAcct] = useState<string>('')
  const [profile, setProfile] = useState<{
    givenTotal: bigint
    receivedTotal: bigint
    tipsSent: bigint
    handle: string
  } | null>(null)

  useEffect(() => {
    ;(async () => {
      if (!window.ethereum) return
      const prov = new ethers.BrowserProvider(window.ethereum)
      const accs = await prov.listAccounts()
      const me = accs[0]?.address
      if (!me) return
      setAcct(me)
      const c = getReadContract()
      const p = await c.getProfile(me)
      setProfile(p)
    })()
  }, [])

  if (!acct) return <p>Connect your wallet on the home page.</p>
  if (!profile) return <p>Loading...</p>

  return (
    <div className="space-y-2">
      <div>
        <span className="font-semibold">Account:</span>{' '}
        <AddressDisplay address={acct} />
      </div>
      <div>
        <span className="font-semibold">Handle:</span> {profile.handle || '—'}
      </div>
      <div>
        <span className="font-semibold">Given Total:</span>{' '}
        {ethers.formatEther(profile.givenTotal)} ETH
      </div>
      <div>
        <span className="font-semibold">Received Total:</span>{' '}
        {ethers.formatEther(profile.receivedTotal)} ETH
      </div>
      <div>
        <span className="font-semibold">Tips Sent:</span>{' '}
        {profile.tipsSent.toString()}
      </div>
    </div>
  )
}
