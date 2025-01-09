export async function removeCacheStorage(): Promise<boolean> {
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error clearing cache storage:", error);
      return false;
    }
  }
  
  