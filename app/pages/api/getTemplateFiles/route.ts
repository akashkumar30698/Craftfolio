// pages/api/getTemplateFiles.ts
import fs from 'fs/promises'
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

export async function readFileContent(filePath: string): Promise<string> {
  try {
    if (process.env.NODE_ENV === 'production') {
      // In production, read from the `public` directory
      const publicPath = path.join(process.cwd(), 'public', filePath)
      return await fs.readFile(publicPath, 'utf-8')
    } else {
      // In development, read from the specified path
      return await fs.readFile(filePath, 'utf-8')
    }
  } catch (error) {
    console.error(`Error reading file: ${filePath}`, error)
    throw new Error(`Unable to read file: ${filePath}`)
  }
}

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

    if (process.env.NODE_ENV === 'production') {
      // In production, we'll look for files in the `public` directory
      filePath = path.join('public', fileName)
    } else {
      // In development, use the full path
      filePath = path.join(process.cwd(), fileName)
    }

    console.log('File PATH :', filePath)

    const content = await readFileContent(filePath)
    return NextResponse.json({ files: [{ name: fileName, content }] }, { status: 200 })
  } catch (error) {
    console.error('Error reading file:', error)
    return NextResponse.json({ error: 'Error reading file' }, { status: 500 })
  }
}
