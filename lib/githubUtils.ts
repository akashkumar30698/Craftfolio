export async function fetchFileFromGitHub(owner: string, repo: string, path: string) {
    const token = process.env.GITHUB_ACCESS_TOKEN;
    if (!token) {
      throw new Error("GitHub access token is not configured");
    }
  
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
  
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`File not found: ${path}`);
        }
        throw new Error(`GitHub API responded with status ${response.status}`);
      }
  
      const data = await response.json();
  
      if (Array.isArray(data)) {
        throw new Error("Path is a directory, not a file");
      }
  
      if ('content' in data) {
        const content = Buffer.from(data.content, 'base64').toString('utf-8');
        return content;
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.error("Error fetching file from GitHub:", error);
      throw error;
    }
  }
  
  