import crypto from 'crypto'
import { setTokenOnServer } from './setToken'


export async function redirectToGitHubOAuth(setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setStepStatus: React.Dispatch<React.SetStateAction<string | null>>): Promise<boolean> {
  try {
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID

   // setIsLoading(true)

    if (!clientId) {
      console.error("GitHub Client ID is missing")
      setIsLoading(false)
      setStepStatus("GitHub Client ID is missing")
      return false
    }
    setStepStatus("Setting Github Token")

    const redirectUri = `${window.location.origin}/pages/api/github/callback`
    const scopes = "repo"

    const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}`
    setStepStatus(null)

    window.location.href = url
   // setIsLoading(false)
    return true
  } catch (error) {
    console.error("Error during GitHub OAuth redirection:", error)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsLoading(false)
    setStepStatus('Error during GitHub OAuth redirection')
    return false
  }
}

export async function redirectToVercel(
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setStepStatus: React.Dispatch<React.SetStateAction<string | null>>
): Promise<boolean> {
  try {
    // Generate a random CSRF token
    const state = crypto.randomBytes(16).toString("hex");

    setStepStatus("Setting Token")

    // Store the CSRF token on the server
    const storing = await setTokenOnServer(state, "latestCSRFToken");

    if (storing) {
      // Construct the Vercel authorization URL
      const vercelAuthUrl = `https://vercel.com/integrations/auto-portfolio/new?state=${state}`;

      // Redirect the user to the Vercel auth page
      window.location.href = vercelAuthUrl;
      setStepStatus(null)
      return true;
    } else {
      console.error("Failed to store CSRF token.");
      setIsLoading(false);
      setStepStatus("Failed to store CSRF token.");
      return false;
    }
  } catch (error) {
    // Log the error and update the UI accordingly
    console.error("Error during redirect to Vercel:", error);
    setIsLoading(false);
    setStepStatus("Error during redirect to Vercel");
    return false;
  }
}

