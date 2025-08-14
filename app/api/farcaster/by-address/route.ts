import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const address = searchParams.get('address')
  if (!address)
    return NextResponse.json({ error: 'Missing address' }, { status: 400 })

  const r = await fetch(
    `https://api.neynar.com/v2/farcaster/user/bulk-by-address?addresses=${address}`,
    {
      headers: {
        accept: 'application/json',
        api_key: process.env.NEYNAR_API_KEY!,
      },
    }
  )
  const data = await r.json()
  return NextResponse.json(data)
}