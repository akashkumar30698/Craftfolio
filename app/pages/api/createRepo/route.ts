import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  const { repoName, description, accessToken } = await req.json();

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await axios.post(
      "https://api.github.com/user/repos",
      {
        name: repoName,
        description,
        private: false, // Change to `true` for private repos
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json({ repoData: response.data });
  } catch (error: any) {
    // Handle Axios error object
    const status = error.response?.status || 500;
    const errorMessage = error.response?.data || "Failed to create repository";

    return NextResponse.json({ error: errorMessage }, { status });
  }
}
