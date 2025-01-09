import { NextResponse ,NextRequest} from "next/server";
import axios from "axios"



export async function POST(req: NextRequest) {

  if (req.method !== 'POST') {
    return NextResponse.json({ message: 'Method not allowed' });
  }

  const { repoName, description } = await req.json(); // Extract JSON body
  const token = req.headers.get('token'); // Extract token from headers


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

