import fs from 'fs/promises'
import path from 'path'

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

