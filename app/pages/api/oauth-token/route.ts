import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
    try {
        // Parse the request body to extract the code
        const body = await req.json();
        const { code } = body;

        if (!code) {
            return NextResponse.json({ error: "Authorization code is missing" }, { status: 400 });
        }


        // Make the POST request to exchange the code for an access token
        const response = await axios.post(
            "https://api.vercel.com/v2/oauth/access_token",
            new URLSearchParams({
                code: code,
                client_id: process.env.VERCEL_CLIENT_ID || "",
                client_secret: process.env.VERCEL_CLIENT_SECRET || "",
                redirect_uri: `http://localhost:3000/integrations/vercel/oauth2/callback`, // Replace with your actual domain
            }).toString(),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        // Extract the access token from the response
        const { access_token } = response.data;

        if (!access_token) {
            return NextResponse.json(
                { error: "Access token not found in response" },
                { status: 500 }
            );
        }

        // Create a response and set the cookie
        const nextResponse = NextResponse.json(response.data);
        nextResponse.cookies.set("access_token", access_token, {
            httpOnly: false,
            secure: false,  
            sameSite: "strict", // Prevents cross-site requests
            maxAge: 3600, // Expiry in seconds
        });


        return nextResponse;
    } catch (err) {
        console.error("Some error occurred:", err);

        // Return a structured error response
        return NextResponse.json(
            { error: "Failed to exchange authorization code", details: err },
            { status: 500 }
        );
    }
}
