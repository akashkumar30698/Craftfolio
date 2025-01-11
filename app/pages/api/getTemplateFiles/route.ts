// pages/api/getTemplateFiles.ts
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { readFileContent } from '@/lib/fileUtils';



export async function GET(req: NextRequest) {
  const url = req.url || ''
  const parsedUrl = new URL(url)
  const fileName = parsedUrl.searchParams.get('fileName')

  console.log(url, "fileName :", fileName)

  if (!fileName) {
    return NextResponse.json({ error: 'File name is required' }, { status: 400 })
  }

  try {
    let filePath: string

    // In production, remove "/public" from the fileName if it contains "/public/index.html"
    // and check if the file is not a sensitive file
    let sanitizedFileName = fileName;
    if (process.env.NODE_ENV === 'production' && fileName.startsWith('/public/')) {
      sanitizedFileName = fileName.replace('/public/', '');
    }

    // Determine the file path based on the environment (production or development)
    if (process.env.NODE_ENV === 'production') {
      // In production, files are typically served from the `public` directory
      filePath = path.join('public', sanitizedFileName);
    } else {
      // In development, use the absolute path to the file from the project's root directory
      filePath = path.join(process.cwd(), sanitizedFileName);
    }

    console.log('File PATH :', filePath)

    const content = await readFileContent(filePath)
    return NextResponse.json({ files: [{ name: fileName, content }] }, { status: 200 })
  } catch (error) {
    console.error('Error reading file:', error)
    return NextResponse.json({ error: 'Error reading file' }, { status: 500 })
  }
}
