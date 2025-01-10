import { NextResponse } from 'next/server';

export async function POST(request) {
  const { token, type } = await request.json();

  

  const response = NextResponse.json({ message: `${type} token set successfully!` });

  response.cookies.set(type, token, {
    httpOnly: true,  // Prevent JavaScript access
    secure: true,  // Ensure the cookie is sent only over HTTPS
    sameSite: 'strict', // Prevent cross-site usage
    path: '/', // Cookie available on the entire site
  });

  return response;
}
