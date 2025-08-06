import { NextResponse } from 'next/server';

export async function POST(request) {
  const body = await request.json();

  const res = await fetch(`${process.env.FLASK_API_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    credentials: 'include'
  });

  // Copy cookies from Flask to browser
  const flaskSetCookie = res.headers.get('set-cookie');
  const data = await res.json();

  const nextRes = NextResponse.json(data, { status: res.status });
  if (flaskSetCookie) {
    nextRes.headers.set('set-cookie', flaskSetCookie);
  }

  return nextRes;
}
