import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import axios from "axios"



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

