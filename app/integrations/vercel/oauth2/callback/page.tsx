"use client";

import React, { useEffect } from "react";
import axios from "axios";
import queryString from "query-string";
import { useRouter } from "next/navigation";
import { useContextApi } from "@/app/context/getContext";
import { useFormContext } from "@/app/context/formContext";
import { setTokenOnServer } from "@/lib/setToken";
import Cookies from "js-cookie"


export function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() ?? null; // Ensuring a safe fallback to null if the split fails
  }
  return null;
}

const CallbackPage: React.FC = () => {
  const router = useRouter();
  const { setVercelAccessToken } = useContextApi()
  const {  setIsLoading,setStepStatus } = useFormContext()


  useEffect(() => {
    const handleCallback = async () => {
      setIsLoading(true)
      if (typeof window === "undefined") return; // Ensure this runs in the browser

      const queryPart = window.location.search; // Get the query string from the URL
      const hello =  queryPart.includes("?") ? queryPart.split("?")[1] : null;

      if (!queryPart) {
        console.error("No query string found in the URL.",hello);
        setStepStatus("No query string found in the URL")
        setIsLoading(false)
        return;
      }

      const { code, state } = queryString.parse(queryPart);

      // Validate the state parameter
      const latestCSRFToken = getCookie("latestCSRFToken");
      if (state !== latestCSRFToken) {
        console.error("Invalid CSRF token.");
        setStepStatus("Invalid CSRF token")
        setIsLoading(false)
        localStorage.removeItem("latestCSRFToken");
        router.push("/error")
        return ;
      }

      try {
        // Send the code to the backend
        const res = await axios.post("/pages/api/oauth-token", { code });

        // Store the token in React state and localStorage
          setVercelAccessToken(res.data.access_token);



             setStepStatus("Setting Token")

          const cookieSetResult = await setTokenOnServer(res.data.access_token,"vercel_access_token")

        const githubToken = Cookies.get("github_access_token")


        if (!githubToken || !cookieSetResult) {
          console.error("No GitHub token found or error setting cookie ");
          setIsLoading(false)
          setStepStatus("No GitHub token found or error setting cookie")
          return
        }

        setIsLoading(false)
        // Redirect to the home page
        router.push("/deployment?github_access_token=" + githubToken + "&deployment_process=" + 3);
        setStepStatus(null)

      } catch (error) {
        setVercelAccessToken(null); // Reset token on error
        setStepStatus("Error during OAuth token exchange")
        setIsLoading(false)
        console.error("Error during OAuth token exchange:", error);
      }
    };

    handleCallback();
  }, [router,setIsLoading,setStepStatus,setVercelAccessToken]);

  return (
    <>
     <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg">Processing your authentication.This may take a few seconds...</p>
    </div>
    </>
  );
};

export default CallbackPage;

