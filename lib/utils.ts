export const shorten = (addr: string) =>
  `${addr.slice(0, 6)}...${addr.slice(-4)}`
export const toEth = (wei: bigint) => Number(wei) / 1e18
export const isAddressLike = (v: string) => /^0x[a-fA-F0-9]{40}$/.test(v)
export const isENS = (v: string) => v.endsWith('.eth')
export const isFC = (v: string) => v.startsWith('@')