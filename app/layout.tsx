"use client"

import localFont from "next/font/local";
import "./globals.css";
import { UserProvider } from "./context/getContext";
import { FormProvider } from "./context/formContext";
import { SessionProvider } from "next-auth/react";
import { ClerkProvider, SignInButton, SignedIn, UserButton, SignedOut } from '@clerk/nextjs'



const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>)
{

  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <FormProvider>
          <UserProvider>
            {children}
          </UserProvider>
          </FormProvider>
         
        </body>
      </html>
    </ClerkProvider>

  );
}
