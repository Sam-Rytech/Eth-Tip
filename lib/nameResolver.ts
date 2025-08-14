import { ethers } from 'ethers'

const mainnetENS = new ethers.JsonRpcProvider(
  `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_MAINNET_KEY}`
)

// Address → ENS or Farcaster → fallback to short address
export async function displayNameForAddress(addr: string): Promise<string> {
  try {
    const ens = await mainnetENS.lookupAddress(addr)
    if (ens) return ens
  } catch {}
  try {
    const r = await fetch(`/api/farcaster/by-address?address=${addr}`)
    const data = await r.json()
    const u = data?.users?.[0]
    if (u?.username) return `@${u.username}`
  } catch {}
  return addr
}

// ENS → address
export async function addressFromENS(name: string): Promise<string | null> {
  try {
    return await mainnetENS.resolveName(name)
  } catch {
    return null
  }
}

// Farcaster username → address
export async function addressFromFC(username: string): Promise<string | null> {
  try {
    const r = await fetch(
      `/api/farcaster/by-username?username=${username.replace('@', '')}`
    )
    const data = await r.json()
    const user = data?.user || data?.result?.user
    const verifications: string[] = user?.verifications || []
    if (verifications.length > 0) return verifications[0]
    const custody = user?.custody_address || user?.custodyAddress
    return custody || null
  } catch {
    return null
  }
}