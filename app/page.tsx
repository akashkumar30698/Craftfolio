"use client";

import Link from "next/link";
import { SignedOut, useClerk } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import axios from "axios";
import crypto from "crypto"
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSearchParams } from 'next/navigation'
import { useContextApi } from "./context/getContext";



interface User {
  username: string;
  githubToken: string;
}

interface File {
  name: string;
  text: string | (() => Promise<string>);
}


export default function Home() {
  const [isSignIn, setIsSignIn] = useState<boolean>(false);
  const [uploadResponse, setUploadResponse] = useState<boolean>(false)
  const [getGithubUsernameWithRepo, setGetGithubUsernameWithRepo] = useState<string | null>(null)
  const [githubAccessToken, setGithubAccessToken] = useState<string | null>(null);
  const [tempToken,setTempToken] = useState<string | null>(null)
  const [storeGithubRepoId,setStoreGithubRepoId] = useState<number>(0)

  const { vercelAccessToken,setVercelAccessToken } = useContextApi()

  const { signOut } = useClerk();
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = searchParams.get('github_access_token');
    console.log("token :", token)
    setGithubAccessToken(token)

  }, [searchParams]);

  useEffect(() => {
    const cookies = document.cookie.split("; ");
    const cookieName = "_session";
    const cookie = cookies.find((c) => c.startsWith(`${cookieName}=`));
    setIsSignIn(!!cookie);
  }, []);

  useEffect(()=>{
    router.push("/preview")
  },[])

  // create a CSRF token and store it locally
  const state = crypto.randomBytes(16).toString("hex");
  const storing = localStorage.setItem("latestCSRFToken", state);

  // use prefix NEXT_PUBLIC if you are using .env on client side        
  //const vercelAuthUrl = `https://vercel.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_VERCEL_CLIENT_ID}&redirect_uri=http://localhost:3000/integrations/vercel/oauth2/callback`;
  const vercelAuthUrl = `https://vercel.com/integrations/auto-portfolio/new?state=${state}`

  // Function to handle the redirection
  const redirectToVercel = () => {
    console.log("vercel auth url", vercelAuthUrl)
    window.location.href = vercelAuthUrl;
  };

  const fetchRepos = async () => {
    try {
      const response = await axios.get("/pages/api/some-api", { withCredentials: true });
      console.log("fetch repos data :", response);
    }
    catch (err) {
      console.log("some error occured at frontend:", err)
    }

  };

  const createRepo = async () => {
    try {
      const response = await axios.post(
        'https://api.github.com/user/repos',
        {
          name: "helloGithujiu",
          description: "hi",
          private: false,
        },
        {
          headers: {
            Authorization: `Bearer ${githubAccessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("response :", response)

      if(response.data.id){
        setStoreGithubRepoId(response.data.id)
      }

      setGetGithubUsernameWithRepo(response.data.full_name)
      //setGetGithubUsername(response.owner?.login)

    } catch (error: any) {
      // Handle Axios error
      console.log("some error occured :", error)
    }
  };

  const redirectToGitHubOAuth = () => {
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    const redirectUri = `${window.location.origin}/pages/api/github/callback`;  // This should be the callback endpoint in your app
    const scopes = "repo";  // You may specify more scopes depending on your needs

    const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}`;
    window.location.href = url;  // Redirect to GitHub OAuth page
  };

  const uploadFiles = async (files: File[]): Promise<boolean> => {
    if (!getGithubUsernameWithRepo) {
      console.error("No repository found. Please create a repository first.");
      return false;
    }

    try {
      for (const file of files) {
        try {
          // Check if `text` is a function or string
          const fileContent = typeof file.text === "function" ? await file.text() : file.text;

          if (!fileContent) {
            console.error(`File ${file.name} has no content to upload.`);
            return false;
          }

          const base64Content = Buffer.from(fileContent).toString("base64");
          const url = `https://api.github.com/repos/${getGithubUsernameWithRepo}/contents/${file.name}`;
          const headers = { Authorization: `Bearer ${githubAccessToken}` };
          const body = {
            message: `Add ${file.name}`,
            content: base64Content,
          };

          console.log(`Uploading ${file.name} to ${url}`);
          const uploadResponse = await axios.put(url, body, { headers });
          console.log(`Successfully uploaded ${file.name}: ${uploadResponse.data.content.html_url}`);
        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error);
          return false; // Stop further uploads on error
        }
      }

      return true; // All files uploaded successfully
    } catch (error) {
      console.error("Error uploading files:", error);
      return false; // General failure
    }
  };

  const fetchFileContent = async (fileName: string): Promise<string> => {
    try {
      const response = await axios.get(`/pages/api/getTemplateFiles?fileName=${fileName}`);
      console.log("response from fetchFile :", response);
      console.log("response data files :", response.data.files);
      const files = response.data.files;
      if (Array.isArray(files)) {
        const filesMap = files.map(file => file.content).join("\n")
        console.log("filesMap :", filesMap)
        return files.map(file => file.content).join("\n");
      }
      return "";
    } catch (error) {
      console.error(`Error fetching file content for ${fileName}:`, error);
      return "";
    }
  };

  // Example usage
  // const user: User = { username: "your-github-username", githubToken: `${githubAccessToken}` };

  const files: File[] = [
    { name: "index.html", text: () => fetchFileContent("index.html") },
  ];

  const files2: File[] = [
    { name: "style.css", text: () => fetchFileContent("style.css") }
  ]

  const files3: File[] = [
    { name: "main.js", text: () => fetchFileContent("main.js") }
  ]

  // Upload files sequentially, halting on failure
  const uploadAllFiles = async () => {
    const filesUploaded = await uploadFiles(files);
    if (!filesUploaded) {
      console.error("Failed to upload files. Stopping process.");
      return;
    }

    const files2Uploaded = await uploadFiles(files2);
    if (!files2Uploaded) {
      console.error("Failed to upload files2. Stopping process.");
      return;
    }

    const files3Uploaded = await uploadFiles(files3);
    if (!files3Uploaded) {
      console.error("Failed to upload files3. Stopping process.");
      return;
    }

    console.log("All files uploaded successfully.");
  };

  const deployProject = async () => {
    try {

      if (!getGithubUsernameWithRepo) {
        console.log("no github credientials found")
        return
      }

      const localStorageVercelToken = localStorage.getItem("vercel_access_token")

      if (!localStorageVercelToken) {
        console.error("no vercel token found on local storage or vercel token expired")
        return
      }

  

      const [owner, repo] = getGithubUsernameWithRepo?.split("/")
      const sanitizedRepo = repo.toLowerCase().replace(/[^a-z0-9._-]/g, "").replace(/-{3,}/g, "-");


      console.log("repo :",repo,"getGithub :",getGithubUsernameWithRepo)
      console.log("sanitizedRepo :",sanitizedRepo)
      console.log("vercel token :",vercelAccessToken)

      console.log("localStorageItem :",localStorageVercelToken)

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

      console.log("Deploy Response:", response.data);
      return response.data
    } catch (error) {
      console.error("Error deploying project to Vercel:", error);
      throw error; 
    }
  };

  useEffect(()=>{
    if(vercelAccessToken){
      setTempToken(vercelAccessToken)
      console.log("token :",vercelAccessToken)
    }
  },[vercelAccessToken])

  const deployToVercel = async () => {

    const localStorageVercelToken = localStorage.getItem("vercel_access_token")
    if (!localStorageVercelToken ) {
      console.error("no vercel token found on local storage or vercel token expired")
      return
    }

    if (!getGithubUsernameWithRepo || !storeGithubRepoId || storeGithubRepoId == 0) {
      console.log("no github credientials found")
      return
    }

    const [owner,repo] = getGithubUsernameWithRepo?.split("/")
    const sanitizedRepo = repo.toLowerCase().replace(/[^a-z0-9._-]/g, "").replace(/-{3,}/g, "-");



    try {
      const response = await axios.post(
        "https://api.vercel.com/v13/deployments",
        {
          name: `${sanitizedRepo}`,
          target: "production",
          gitSource: {
        type: "github",
        repo: `${getGithubUsernameWithRepo}`, // Full name of the GitHub repo
        branch: "main",
        ref: "main",
        repoId: storeGithubRepoId,
        projectSettings: {
          devCommand: null, // Optional for development, set to null if not applicable
          installCommand: "npm install", // Command to install dependencies
          buildCommand: "npm run build", // Command to build the project
          outputDirectory: "build", // Directory containing the built files
          rootDirectory: null, // Root directory of the project (null for default)
          framework : null // Framework slug (null for "Other")
        }
      },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorageVercelToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const { url } = response.data;
      console.log("Deployment URL:", `https://${url}`);
      return url; // Return the deployment URL
    } catch (error) {
      console.error("Error deploying to Vercel:", error);
      throw error; // Re-throw the error for higher-level handling
    }
  };

  const handleUpload = async () => {
    //  const filePaths = encodeURIComponent(JSON.stringify(['template/index.html', 'template/index.css']));
    //  const githubToken = encodeURIComponent(githubAccessToken || "");
    //  const githubIdWithUsername = encodeURIComponent(getGithubUsernameWithRepo || "");

    try {
      const response = await axios.post(
        `/pages/api/uploadFiles`,
        {},
        {
          headers: {
            'X-GitHub-Token': githubAccessToken,
            'X-GitHub-Repo': getGithubUsernameWithRepo,
            'X-File-Paths': JSON.stringify(['index.html']),
          },
        }
      );

      console.log(response.data);
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  //uploadFiles(getGithubUsername, files);


  return (
    <>
      <button>
        <Link href="/sign-in">Login</Link>
      </button>

      <br></br>

      {isSignIn && <SignedOut />}

      {/* Link Vercel Account button */}
      <button onClick={redirectToVercel}>
        Link Vercel Account
      </button>
      <br></br>

      <button onClick={createRepo}>CreateRepo</button>
      <br></br>

      <button onClick={redirectToGitHubOAuth}>github login</button>
      <br></br>

      <button onClick={fetchRepos}>Link Github Account</button>
      <br></br>

      <button onClick={uploadAllFiles}>On Upload files</button>
      <br></br>

      <button onClick={deployProject}>Link vercel account</button>
      <br></br>

      <button onClick={deployToVercel}>Deploy on Vercel</button>
    </>
  );
}
