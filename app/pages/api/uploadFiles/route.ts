import { Octokit } from 'octokit';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request): Promise<Response> {
  try {
    // Extract headers
    const githubToken = request.headers.get('x-github-token');
    const repoInfo = request.headers.get('x-github-repo');
    const filesHeader = request.headers.get('x-file-paths');

    console.log("repoInfo:", repoInfo);
    console.log("Token:", githubToken);
    console.log("Files Path (header):", filesHeader);

    // Ensure that required headers are present
    if (!githubToken || !repoInfo || !filesHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing required headers: x-github-token, x-github-repo, or x-file-paths.' }),
        { status: 400 }
      );
    }

    // Split owner/repo
    const [owner, repo] = repoInfo.split('/');
    if (!owner || !repo) {
      return new Response(
        JSON.stringify({ error: 'Invalid githubIdWithUsername format. Expected format: username/repo.' }),
        { status: 400 }
      );
    }

    // Ensure files is an array
    const files = filesHeader.split(',');  // Assuming the file paths are separated by commas in the header
    if (!files.length) {
      return new Response(
        JSON.stringify({ error: 'No file paths provided in x-file-paths header.' }),
        { status: 400 }
      );
    }

    const octokit = new Octokit({ auth: githubToken });

    // Upload files to GitHub
    const results = await Promise.all(
      files.map(async (filePath: string) => {
        const absolutePath = path.join(process.cwd(), filePath.trim());  // Trim any extra spaces
        if (!fs.existsSync(absolutePath)) {
          throw new Error(`File not found: ${absolutePath}`);
        }

        const fileContent = fs.readFileSync(absolutePath, 'utf8');

        try {
          const response = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
            owner,
            repo,
            path: path.basename(filePath),
            message: `Add ${path.basename(filePath)}`,
            content: Buffer.from(fileContent).toString('base64'),
          });
          console.log("GitHub Response:", response);
          return response.data;
        } catch (uploadError) {
          console.error(`Error uploading file ${filePath}:`, uploadError);
          throw uploadError;  // Re-throw the error for handling
        }
      })
    );

    return new Response(JSON.stringify({ success: true, results }), { status: 200 });
  } catch (error: any) {
    console.error("Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
