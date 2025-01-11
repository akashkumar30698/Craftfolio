import { NextRequest, NextResponse } from 'next/server';
import { fetchFileFromGitHub } from '@/lib/githubUtils';

export async function GET(req: NextRequest) {
  const url = req.url || ''
  const parsedUrl = new URL(url)
  const fileName = parsedUrl.searchParams.get('fileName')

  console.log(url, "fileName :", fileName)

  if (!fileName) {
    return NextResponse.json({ error: 'File name is required' }, { status: 400 })
  }

  try {
    // GitHub repository details
    const owner = process.env.GITHUB_REPO_OWNER;
    const repo = process.env.GITHUB_REPO_NAME;

    if (!owner || !repo) {
      throw new Error("GitHub repository details are not configured");
    }

    // Remove leading slash if present
    const filePath = fileName.startsWith('/') ? fileName.slice(1) : fileName;

    console.log("filepath :",filePath)

    const content = await fetchFileFromGitHub(owner, repo, filePath);
    console.log("content :",content)
    return NextResponse.json({ files: [{ name: fileName, content }] }, { status: 200 })
  } catch (error) {
    console.error('Error fetching file from GitHub:', error)
    return NextResponse.json({ error: 'Error fetching file from GitHub' }, { status: 500 })
  }
}

