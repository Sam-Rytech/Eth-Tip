'use client'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import AddressDisplay from './AddressDisplay'

declare global {
  interface Window {
    ethereum?: any
  }
}

export default function ConnectButton() {
  const [account, setAccount] = useState<string>('')

  useEffect(() => {
    if (!window.ethereum) return
    window.ethereum.on?.('accountsChanged', (accs: string[]) =>
      setAccount(accs[0] || '')
    )
  }, [])

  const connect = async () => {
    if (!window.ethereum) return alert('Install MetaMask')
    const provider = new ethers.BrowserProvider(window.ethereum)
    const accs = await provider.send('eth_requestAccounts', [])
    setAccount(accs[0])
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={connect}
        className="px-4 py-2 rounded bg-blue-600 text-white"
      >
        Connect Wallet
      </button>
      {account && <AddressDisplay address={account} />}
    </div>
  )
}
