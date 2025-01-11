import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN
});

export async function fetchFileFromGitHub(owner: string, repo: string, path: string) {
  try {
    const response = await octokit.repos.getContent({
      owner,
      repo,
      path,
    });

    if (Array.isArray(response.data)) {
      throw new Error("Path is a directory, not a file");
    }

    if ('content' in response.data) {
      const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
      return content;
    } else {
      throw new Error("Unexpected response format");
    }
  } catch (error) {
    console.error("Error fetching file from GitHub:", error);
    throw error;
  }
}

