import { getSession } from "next-auth/react";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios"

/*
export  async function GET(req: NextApiRequest, res: NextApiResponse) {
    
  // Retrieve the session from NextAuth
  const session = await getSession({ req });
  console.log("Request headers:");


  // Log the session to the console for debugging
  console.log("got session :", session);

  // If there's no session, return a 401 Unauthorized response
  if (!session) {
    return NextResponse.json({ error: "Not Authenthicated" }, { status: 401 });
}

  // Extract the GitHub access token from the session
  const githubToken = session.accessToken;

  try {
    // Fetch user repositories from GitHub using axios
    const response = await axios.get("https://api.github.com/user/repos", {
      headers: {
        Authorization: `Bearer ${githubToken}`,
      },
    });

    console.log("response from github :",response)

    // Send the repositories data as the response
     return  NextResponse.json(response.data)
  } catch (error) {
    // Catch any errors during the axios call
    console.error("Error fetching GitHub repos:", error);
    return NextResponse.json({ error: "Internal Server Error", message: error });
  }
}
*/

export async function POST(req: NextApiRequest, res: NextApiResponse) {

  if (req.method !== 'POST') {
    return NextResponse.json({ message: 'Method not allowed' });
  }

  const { repoName, description } = req.body;
  const { token } = req.headers;

  if (!repoName || !description || !token) {
    return NextResponse.json({ message: 'Missing required fields' });
  }

  try {
    const response = await axios.post(
      'https://api.github.com/user/repos',
      {
        name: repoName,
        description: description,
        private: false,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return NextResponse.json({ message: 'Repository created successfully', repo: response.data });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating repository', error: error});
  }
}

