// types/next-auth.d.ts or in the root file, e.g., next-auth.d.ts
import NextAuth from "next-auth";
import { Session } from "next-auth";

// Declare module to extend the Session interface
declare module "next-auth" {
  interface Session {
    accessToken: string; // Add accessToken property to the session
    textWrapStyle: string

  }

  interface JWT {
    accessToken: string; // Add accessToken property to the JWT
  }
}

declare module "./client-components" {
  export const SkeletonOne: React.ComponentType;
  // Add other exported components here if needed
}


declare module 'multer' {
  const multer: any;
  export default multer;
}

