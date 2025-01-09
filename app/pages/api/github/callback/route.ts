// /pages/api/github/callback.ts (Server-side API route)
import axios from 'axios';
import { NextResponse,NextRequest } from 'next/server';


export async function GET(req: NextRequest, res: NextResponse) {
    const url = req.url || "";
    // Create a URL object
    const urlObj = new URL(url);

    // Extract the 'code' parameter
    const extractCoded = urlObj.searchParams.get('code');



    if (!extractCoded) {
        return NextResponse.json({ error: 'Code is required' });
    }
    console.log(res)
    try {
        const response = await axios.post('https://github.com/login/oauth/access_token', null, {
            params: {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code: extractCoded,
                redirect_uri: `http://localhost:3000`,
            },
            headers: {
                'Accept': 'application/json',
            },
        });

        const { access_token } = response.data;

        if (!access_token) {
            return NextResponse.json({ error: 'Failed to retrieve access token' });
        }



        // Set the cookie with the access token
       /// res.setHeader('Set-Cookie', [
       //     `github_access_token=${access_token}; Path=/; HttpOnly; Secure; SameSite=Strict`
       // ]);


        const loginUrl = new URL('/deployment', req.url);
        loginUrl.searchParams.set('github_access_token', access_token);

        return NextResponse.redirect(loginUrl.toString());
    } catch (error) {
        return NextResponse.json({ error: 'Error exchanging code for access token', err: error });
    }
}


