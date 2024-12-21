"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import queryString from "query-string";
import { useRouter } from "next/navigation";
import { useContextApi } from "@/app/context/getContext";

const CallbackPage: React.FC = () => {
  const router = useRouter();
  const { setVercelAccessToken }  = useContextApi()

  useEffect(() => {
    const handleCallback = async () => {
      if (typeof window === "undefined") return; // Ensure this runs in the browser

      const queryPart = window.location.search; // Get the query string from the URL
      const codeFound = queryPart.includes("?") ? queryPart.split("?")[1] : null;
      console.log("queryPart :", codeFound);

      if (!queryPart) {
        console.error("No query string found in the URL.");
        return;
      }

      const { code, state } = queryString.parse(queryPart);
      console.log("code :", code);

      // Validate the state parameter
      const latestCSRFToken = localStorage.getItem("latestCSRFToken");
      if (state !== latestCSRFToken) {
        console.error("Invalid CSRF token.");
        localStorage.removeItem("latestCSRFToken");
        return;
      }

      try {
        // Send the code to the backend
        const res = await axios.post("/pages/api/oauth-token", { code });
        console.log("OAuth token exchange response:", res.data);

        // Store the token in React state and localStorage
        setVercelAccessToken(res.data.access_token);
        localStorage.setItem("vercel_access_token", res.data.access_token);

        // Redirect to the home page
        router.push("/");
      } catch (error) {
        setVercelAccessToken(null); // Reset token on error
        console.error("Error during OAuth token exchange:", error);
      }
    };

    handleCallback();
  }, []);

  return (
    <>
      <div>Callback Page</div>
    </>
  );
};

export default CallbackPage;

