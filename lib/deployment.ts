import axios from 'axios'
import { createRandomId } from './utils'
import Cookies from "js-cookie"
import { getCookie } from './getCookie'



let storeUrl = ""

export function storeUrlTemp() {
    return storeUrl
}

export async function createRepo(setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setStepStatus: React.Dispatch<React.SetStateAction<string | null>>
): Promise<{ fullName: string; id: number } | null> {
    try {

        // Extract the GitHub token from the URL query string
        const urlParams = new URLSearchParams(window.location.search);

        // Get the 'github_access_token' parameter
        const githubTokenSecond = urlParams.get('github_access_token');
        const githubToken = getCookie("github_access_token") || Cookies.get("github_access_token") || githubTokenSecond

        if (!githubToken) {
            setIsLoading(false)
            setStepStatus("No GitHub access token found")
            return null
        }

        const response = await axios.post(
            "https://api.github.com/user/repos",
            {
                name: `portfolio-${createRandomId()}`,
                description: "My portfolio website",
                private: false,
            },
            {
                headers: {
                    Authorization: `Bearer ${githubToken}`,
                    "Content-Type": "application/json",
                },
            }
        )

        if (response.data.id) {
            return {
                fullName: response.data.full_name,
                id: response.data.id,
            }
        }

        return null
    } catch (error) {
        console.error("Error creating repository:", error)
        setIsLoading(false)
        setStepStatus("Error creating repository")
        return null
    }
}

export async function uploadFiles(repoFullName: string, setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setStepStatus: React.Dispatch<React.SetStateAction<string | null>>, setRandomId: React.Dispatch<React.SetStateAction<string | null>>, randomId: string | null): Promise<boolean> {

    // Extract the GitHub token from the URL query string
    const urlParams = new URLSearchParams(window.location.search);
    console.log(randomId,setRandomId)

    // Get the 'github_access_token' parameter
    const githubTokenSecond = urlParams.get('github_access_token');
    const githubToken = getCookie("github_access_token") || Cookies.get("github_access_token") || githubTokenSecond
    if (!githubToken) {
        console.error("No GitHub access token found. Please authenticate with GitHub first.")
        setIsLoading(false)
        setStepStatus("No GitHub access token found. Please authenticate with GitHub first.")
        return false
    }

    const files = [
        { name: "index.html", path: "/public/index.html" },
        { name: "style.css", path: "/public/style.css" },
        { name: "main.js", path: "/public/main.js" },
    ]



    try {
        for (const file of files) {
            const content = await fetchFileContent(file.path)
            if (!content) {
                console.error(`File ${file.name} has no content to upload.`)
                setIsLoading(false)
                setStepStatus(`File ${file.name} has no content to upload.`)
                return false
            }

            const base64Content = Buffer.from(content).toString("base64")
            const url = `https://api.github.com/repos/${repoFullName}/contents/${file.name}`
            const headers = { Authorization: `Bearer ${githubToken}` }
            const body = {
                message: `Add ${file.name}`,
                content: base64Content,
            }

            await axios.put(url, body, { headers })
        }

        // Create and upload the env file with a random ID
        const idMain = localStorage.getItem("randomId")

        if (!idMain) {
            setIsLoading(false)
            setStepStatus(`Failed to retrieve Id or Id expired`)

            return false
        }
        // Create the randomId.json content dynamically with the random ID
        const randomIdJsonContent = JSON.stringify({ randomId: idMain });

        // Encode the content to base64
        const randomIdBase64Content = Buffer.from(randomIdJsonContent).toString('base64');
        const randomIdUrl = `https://api.github.com/repos/${repoFullName}/contents/randomId.json`;

        const headers = { Authorization: `Bearer ${githubToken}` };
        const body = {
            message: 'Add randomId.json file with random ID',
            content: randomIdBase64Content,
        };

        try {
            // Upload the randomId.json file
            await axios.put(randomIdUrl, body, { headers });
        } catch (error) {
            console.error("Error uploading randomId.json:", error);
        }


        return true
    } catch (error) {
        console.error("Error uploading files:", error)
        setIsLoading(false)
        setStepStatus("Error uploading files")
        return false
    }
}

async function fetchFileContent(filePath: string): Promise<string> {
    try {
        const response = await axios.get(`/pages/api/getTemplateFiles?fileName=${filePath}`)
        const files = response.data.files
        if (Array.isArray(files)) {
            return files.map(file => file.content).join("\n")
        }
        return ""
    } catch (error) {
        console.error(`Error fetching file content for ${filePath}:`, error)
        return ""
    }
}



export const deployProject = async (setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setStepStatus: React.Dispatch<React.SetStateAction<string | null>>) => {
    try {
        const getGithubUsernameWithRepo = localStorage.getItem("repoInfo_fullName");
        if (!getGithubUsernameWithRepo) {
            setIsLoading(false)
            setStepStatus("No GitHub credentials found")
            return false;
        }

        const localStorageVercelToken = Cookies.get("vercel_access_token");

        if (!localStorageVercelToken) {
            console.error("No Vercel token found in local storage or Vercel token expired");
            setIsLoading(false)
            setStepStatus("No Vercel token found in local storage or Vercel token expired")
            return false;
        }

        const [owner, repo] = getGithubUsernameWithRepo?.split("/");
        const sanitizedRepo = repo
            .toLowerCase()
            .replace(/[^a-z0-9._-]/g, "")
            .replace(/-{3,}/g, "-");

      

        const response = await axios.post(
            "https://api.vercel.com/v8/projects",
            {
                name: sanitizedRepo,
                gitRepository: {
                    type: "github",
                    repo: `${getGithubUsernameWithRepo}`,
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorageVercelToken}`,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log(response,owner)


        return true; // Return true if the deployment is successful
    } catch (error) {
        console.error("Error deploying project to Vercel:", error);
        setIsLoading(false)
        setStepStatus("Error deploying project to Vercel")
        return false; // Return false if an error occurs
    }
};

export async function deployToVercel(setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setStepStatus: React.Dispatch<React.SetStateAction<string | null>>, setUrl: React.Dispatch<React.SetStateAction<string | null>>): Promise<boolean> {
    const vercelToken = Cookies.get("vercel_access_token")
    const repoFullName = localStorage.getItem("repoInfo_fullName")
    const repoId = localStorage.getItem("repoInfo_id")

    if (!vercelToken || !repoFullName || !repoId) {
        console.error("No Vercel token found in local storage or token expired")
        setIsLoading(false)
        setStepStatus("No Vercel token found in local storage or token expired")
        return false
    }

    const randomId = localStorage.getItem("randomId")

    if (!randomId) {
        setIsLoading(false)
        setStepStatus("No random Id found or random Id expired")
        return false
    }

    const [owner, repo] = repoFullName?.split("/")
    const sanitizedRepo = repo.toLowerCase().replace(/[^a-z0-9._-]/g, "").replace(/-{3,}/g, "-")


    try {


        const response = await axios.post(
            "https://api.vercel.com/v13/deployments",
            {
                name: `${sanitizedRepo}-${randomId}-deployment`,
                target: "production",
                gitSource: {
                    type: "github",
                    repo: `${repoFullName}`, // Full name of the GitHub repo
                    branch: "main",
                    ref: "main",
                    repoId: repoId,
                },
                projectSettings: {
                    framework: null,
                    devCommand: null,
                    installCommand: null,
                    buildCommand: null,
                    outputDirectory: ".",
                    rootDirectory: null,
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${vercelToken}`,
                    "Content-Type": "application/json",
                },
            }
        )

        const { url } = response.data
        console.log(owner)

        storeUrl = `${url}`
        setUrl(`${url}`)

        return url

    } catch (error) {
        console.error("Error deploying to Vercel:", error)
        setIsLoading(false)
        setStepStatus("Error deploying to Vercel")
        return false
    }
}

