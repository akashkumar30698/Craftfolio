export async function getTokenFromServer(tokenName) {
    try {
      if (!tokenName) {
        console.error('Token name is required');
        return false;
      }
  
      const response = await fetch('/pages/api/getCookie', {
        method: 'POST', // Use POST to send the token name in the body
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tokenName: tokenName }), // Pass the token name in the body
      });
  
      if (!response.ok) {
        throw new Error(`Failed to get token: ${response.statusText}`);
      }
  
      const res = await response.json();
  
      return res.data || false; // Return the token value or false if not found
    } catch (error) {
      console.error('Error getting token:', error);
      return false;
    }
  }
  