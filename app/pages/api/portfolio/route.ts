
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

export async function POST(req: NextApiRequest, res: NextApiResponse) {
    try {
            return NextResponse.json({ success: 'Successfully Submitted' });
    } catch (error) {
        return NextResponse.json({ error: 'Error exchanging code for access token' });
    }
}
