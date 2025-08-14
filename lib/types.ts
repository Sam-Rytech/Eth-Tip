export type TipData = {
  sender: string
  recipient: string
  value: bigint
  note: string
  handle: string
  sentAt: bigint
  visible: boolean
}

export type Profile = {
  givenTotal: bigint
  receivedTotal: bigint
  tipsSent: bigint
  handle: string
}