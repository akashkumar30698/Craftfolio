"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the type for the context
interface UserContextType {
 
  isLoggedIn: boolean
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
  vercelAccessToken: string | null;
  setVercelAccessToken: (token: string | null) => void;

}

// Create context with default values
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create a provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {

  const [isLoggedIn,setIsLoggedIn] = useState<boolean>(false)
  const [vercelAccessToken, setVercelAccessToken] = useState<string | null>(null);


  return (
    <UserContext.Provider value={{ isLoggedIn,setIsLoggedIn ,vercelAccessToken,setVercelAccessToken }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for consuming the UserContext
export const useContextApi = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useContextApi must be used within a UserProvider');
  }
  return context;
};