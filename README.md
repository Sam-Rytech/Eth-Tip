# **BaseSocialTipping** 💙💸  
_A decentralized tipping platform for the Base ecosystem with ENS and Farcaster integration_  

---

## **📖 Overview**  
**BaseSocialTipping** is a decentralized application (dApp) built for the **Base mainnet** that allows users to **send crypto tips** to others using either:  
- An Ethereum address  
- An **ENS name**
- A **Farcaster username**  

The platform automatically **resolves usernames and addresses** using **ENS** and the **Neynar API** (for Farcaster), ensuring a smooth tipping experience without requiring users to manually find wallet addresses.  

---

## **✨ Features**
- **Tip anyone on Base** — send tips to any wallet address, ENS name, or Farcaster handle.
- **ENS Resolution** — supports `.base.eth` domains via Alchemy API.
- **Farcaster Resolution** — supports `@username` lookup and address reverse lookup via Neynar API.
- **Reverse Resolution** — if you enter an ENS name, it will display the linked Farcaster username (and vice versa).
- **Interactive Profile Links** — ENS names open in **Etherscan**, Farcaster handles open in **Warpcast** in a new tab.
- **On-Chain Storage of Tips** — smart contract records sender, recipient, amount, and optional message.
- **Base Mainnet Ready** — optimized for low gas fees.
- **Clean & Responsive UI** — built with **Next.js + Tailwind CSS**.
