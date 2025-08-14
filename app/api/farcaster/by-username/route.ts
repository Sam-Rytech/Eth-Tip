import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const username = searchParams.get('username')
  if (!username)
    return NextResponse.json({ error: 'Missing username' }, { status: 400 })

  const r = await fetch(
    `https://api.neynar.com/v2/farcaster/user/by_username?username=${encodeURIComponent(
      username
    )}`,
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