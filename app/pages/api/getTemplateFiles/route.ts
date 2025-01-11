import { NextRequest, NextResponse } from 'next/server';
import { fetchFileFromGitHub } from '@/lib/githubUtils';

export async function GET(req: NextRequest) {
  const url = req.url || ''
  const parsedUrl = new URL(url)
  const fileName = parsedUrl.searchParams.get('fileName')


  if (!fileName) {
    return NextResponse.json({ error: 'File name is required' }, { status: 400 })
  }

  try {
    const owner = process.env.GITHUB_REPO_OWNER;
    const repo = process.env.GITHUB_REPO_NAME;

    if (!owner || !repo) {
      console.error("GitHub repository details are not configured");
      return NextResponse.json({ error: 'GitHub repository details are not configured' }, { status: 500 })
    }


    // Ensure the path includes 'public' directory
    const filePath = `public/${fileName.replace(/^public\//, '')}`;

    const content = await fetchFileFromGitHub(owner, repo, filePath);
    return NextResponse.json({ files: [{ name: fileName, content }] }, { status: 200 })
  } catch (error) {
    console.error('Error in getTemplateFiles:', error.message)
    if (error.message.includes('File not found')) {
      return NextResponse.json({ error: 'File not found in the repository' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Error fetching file from GitHub' }, { status: 500 })
  }
}

