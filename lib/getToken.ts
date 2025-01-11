


export async function getTokenFromServer(tokenName) {
    try {

        if(!tokenName){
            return false
        }
        
      const response = await fetch('/pages/api/getCookie', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tokenName }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to get token');
      }
      const res =  await response.json()

      return  res.data
    } catch (error) {
      console.error('Error getting token:', error);
      return false
    }
  }
  