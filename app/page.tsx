import { getServerSession } from "next-auth"
import { authOptions } from "@/app/lib/auth"
import { redirect } from "next/navigation"
import SignInButton from "@/app/components/SignInButton"
import Image from "next/image"

export const metadata = { title: "Sign In" }

export default async function SignInPage() {
  const session = await getServerSession(authOptions)
  if (session) redirect("/dashboard")

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#001C44] via-[#0a2a6e] to-[#1524A9]">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-4">
          <Image
            src="/logo-ycp-navy.svg"
            alt="YCP"
            width={140}
            height={50}
            className="h-10 w-auto"
            priority
          />
          <div className="text-center">
            <h1 className="text-xl font-semibold text-[#001C44]">Business Card Generator</h1>
            <p className="text-sm text-slate-500 mt-1 text-center">
              Sign in with your YCP Microsoft account to create and manage your business cards.
            </p>
          </div>
        </div>

        <SignInButton />

        <p className="text-xs text-slate-400 text-center">
          Only YCP organisation accounts are permitted.
        </p>
      </div>
    </main>
  )
}
