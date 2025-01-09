


export async function setTokenOnServer(token: any, type: any) {
    try {

        if(!token || !type){
            return false
        }
        
      const response = await fetch('/pages/api/setCookie', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, type }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to set token');
      }
  
      await response.json();

      return true
    } catch (error) {
      console.error('Error setting token:', error);
      return false
    }
  }
  