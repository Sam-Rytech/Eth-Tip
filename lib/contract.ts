import { ethers } from 'ethers'
import abiJson from '../abi/SocialTippingBase.json'

declare global {
  interface Window {
    ethereum?: any
  }
}

export const BASE_RPC = process.env.NEXT_PUBLIC_BASE_RPC!
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!

export const getReadProvider = () => new ethers.JsonRpcProvider(BASE_RPC)
export const getWriteProvider = async () => {
  if (typeof window === 'undefined' || !window.ethereum)
    throw new Error('No wallet')
  const prov = new ethers.BrowserProvider(window.ethereum)
  // ensure chain is Base mainnet (8453)
  const net = await prov.getNetwork()
  if (net.chainId !== BigInt(8453)) {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x2105' }],
    })
  }
  return prov
}

export const getReadContract = () =>
  new ethers.Contract(CONTRACT_ADDRESS, abiJson.abi, getReadProvider())
export const getWriteContract = async () => {
  const prov = await getWriteProvider()
  const signer = await prov.getSigner()
  return new ethers.Contract(CONTRACT_ADDRESS, abiJson.abi, signer)
}
