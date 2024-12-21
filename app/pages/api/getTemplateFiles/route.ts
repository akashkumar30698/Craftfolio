// pages/api/getTemplateFiles.ts
import fs from 'fs';
import path from 'path';
import { NextApiRequest } from 'next';
import { NextResponse } from 'next/server';

// Helper function to get all files in a folder recursively
const getFilesRecursively = (directory: string, relativePath = '') => {
  const files = fs.readdirSync(directory, { withFileTypes: true });
  let fileList: { name: string; content: string }[] = [];

  for (const file of files) {
    const absolutePath = path.join(directory, file.name);
    const currentRelativePath = path.join(relativePath, file.name);

    if (file.isDirectory()) {
      // If it's a directory, recurse into it
      fileList = fileList.concat(getFilesRecursively(absolutePath, currentRelativePath));
    } else {
      // If it's a file, read its content
      const content = fs.readFileSync(absolutePath, 'utf8');
      fileList.push({ name: currentRelativePath, content });
    }
  }

  return fileList;
};

export async function GET(req: NextApiRequest) {
  const url = req.url || '';
  const parsedUrl = new URL(url);
  const fileName = parsedUrl.searchParams.get('fileName');

  if (!fileName) {
    return NextResponse.json({ error: 'File or folder name is required' }, { status: 400 });
  }

  try {
    const targetPath = path.join(process.cwd(), fileName);
    console.log('Target Path:', targetPath);

    if (!fs.existsSync(targetPath)) {
      return NextResponse.json({ error: 'File or folder not found' }, { status: 404 });
    }

    const stats = fs.statSync(targetPath);

    if (stats.isFile()) {
      // Handle single file
      const content = fs.readFileSync(targetPath, 'utf8');
      return NextResponse.json({ files: [{ name: fileName, content }] }, { status: 200 });
    }

    if (stats.isDirectory()) {
      // Handle directory
      const files = getFilesRecursively(targetPath);
      return NextResponse.json({ files }, { status: 200 });
    }

    return NextResponse.json({ error: 'Invalid path type' }, { status: 400 });
  } catch (error) {
    console.error('Error reading file or folder:', error);
    return NextResponse.json({ error: 'Error reading file or folder' }, { status: 500 });
  }
}
