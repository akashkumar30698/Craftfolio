import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { tokenName } = await request.json();

    if (!tokenName) {
      return NextResponse.json({ error: "Token name is required" }, { status: 400 });
    }

    const authToken = request.cookies.get(tokenName);

    if (!authToken) {
      return NextResponse.json({ error: "Token not found" }, { status: 404 });
    }

    return NextResponse.json({ data: authToken });
  } catch (err) {
    console.error("Error occurred:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
