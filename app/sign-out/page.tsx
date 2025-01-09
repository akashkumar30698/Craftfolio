
import { SignedOut } from '@clerk/nextjs'


export default function SignOUTPage() {
  return (
    <>
      <div className="flex items-center justify-center h-screen">
      <SignedOut />
      </div>
    </>
  ) ;
}