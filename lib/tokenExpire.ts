// Function to set an item in localStorage with expiration
function setItemWithExpiry(key: string, value: string, expiryInMinutes: number): void {
    const now = new Date();
    const expiryTime = now.getTime() + expiryInMinutes * 60 * 1000; // Expiry timestamp
    const itemData = {
      value: value,
      expiry: expiryTime,
    };
    localStorage.setItem(key, JSON.stringify(itemData));
  }
  
  // Function to get an item from localStorage, checking for expiration
  function getItemWithExpiry(key: string): string | null {
    const itemData = localStorage.getItem(key);
  
    if (!itemData) {
      return null; // Item not found
    }
  
    const parsedItem = JSON.parse(itemData);
    const now = new Date();
  
    if (now.getTime() > parsedItem.expiry) {
      localStorage.removeItem(key); // Item expired, remove it
      return null;
    }
  
    return parsedItem.value; // Item is valid
  }
  
  // Function to set all items with expiration
  function setAllItemsWithExpiry(expiryInMinutes: number): void {
    setItemWithExpiry("repoInfo_fullName", "some_full_name_value", expiryInMinutes);
    setItemWithExpiry("repoInfo_id", "some_id_value", expiryInMinutes);
    setItemWithExpiry("github_access_token", "some_github_token", expiryInMinutes);
    setItemWithExpiry("vercel_access_token", "some_vercel_token", expiryInMinutes);
    setItemWithExpiry("latestCSRFToken", "some_csrf_token", expiryInMinutes);
  //  setItemWithExpiry("deployId", "some_deploy_id", expiryInMinutes);
    setItemWithExpiry("formData","some_formData",expiryInMinutes)
    setItemWithExpiry("randomId","some_random_id",expiryInMinutes)
    setItemWithExpiry("deployId","some_deploy_Id",expiryInMinutes)
  }
  
  // Function to clear all expired items
  function clearExpiredItems(keys: string[]): void {
    keys.forEach((key) => {
      getItemWithExpiry(key); // Automatically removes if expired
    });
  }
  
  // Usage Example
  setAllItemsWithExpiry(30); // Set items with a 15-minute expiry
  
  setTimeout(() => {
    clearExpiredItems([
      "repoInfo_fullName",
      "repoInfo_id",
      "github_access_token",
      "vercel_access_token",
      "latestCSRFToken",
      "formData",
      "randomId",
      "deployId"
    ]);
    console.log("Expired items cleared!");
  }, 30 * 60 * 1000); // Check after 15 minutes
  