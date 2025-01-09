
import { NextResponse,NextRequest } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        console.log(req,res)
            return NextResponse.json({ success: 'Successfully Submitted' });
    } catch (error) {
        return NextResponse.json({ error: 'Error exchanging code for access token' ,err: error});
    }
}
