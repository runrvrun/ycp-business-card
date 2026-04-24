import { getServerSession } from "next-auth"
import { authOptions } from "@/app/lib/auth"
import { redirect } from "next/navigation"
import SignInButton from "@/app/components/SignInButton"

export const metadata = { title: "Sign In" }

export default async function SignInPage() {
  const session = await getServerSession(authOptions)
  if (session) redirect("/dashboard")

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center gap-6">
        {/* Logo / Brand */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-xl bg-[#c0272d] flex items-center justify-center">
            <span className="text-white font-bold text-2xl tracking-tight">YCP</span>
          </div>
          <h1 className="text-xl font-semibold text-slate-800 mt-2">Business Card Generator</h1>
          <p className="text-sm text-slate-500 text-center">
            Sign in with your YCP Microsoft account to create and manage your business cards.
          </p>
        </div>

        <SignInButton />

        <p className="text-xs text-slate-400 text-center">
          Only YCP organisation accounts are permitted.
        </p>
      </div>
    </main>
  )
}
