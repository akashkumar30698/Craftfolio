function setCookieWithExpiry(name: string, value: string, minutes: number = 30): void {
    const now = new Date();
    now.setTime(now.getTime() + minutes * 60 * 1000);
    const expires = now.toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
  }
  
 
  
  function deleteCookie(name: string): void {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
  
  // Usage
  setCookieWithExpiry("latestCSRFToken", "some_token");
  setCookieWithExpiry("vercel_access_token", "some_token");
  setCookieWithExpiry("github_access_token", "some_token");

  deleteCookie("latestCSRFToken");
  deleteCookie("vercel_access_token");
  deleteCookie("github_access_token");

  