'use client'
import { useEffect, useState } from 'react'
import { displayNameForAddress } from '../lib/nameResolver'
import { shorten } from '../lib/utils'

export default function AddressDisplay({ address }: { address: string }) {
  const [name, setName] = useState<string>(shorten(address))

  useEffect(() => {
    displayNameForAddress(address).then((n) => setName(n))
  }, [address])

  const isENS = name.endsWith('.eth')
  const isFC = name.startsWith('@')
  const target = isENS
    ? `https://app.ens.domains/name/${name}`
    : isFC
    ? `https://warpcast.com/${name.slice(1)}`
    : `https://basescan.org/address/${address}`

  return (
    <a
      href={target}
      target="_blank"
      rel="noopener noreferrer"
      className={`underline ${
        isENS ? 'text-blue-600' : isFC ? 'text-purple-500' : 'text-green-600'
      }`}
    >
      {name}
    </a>
  )
}
