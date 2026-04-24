import Link from "next/link"

export const metadata = { title: "Auth Error" }

export default function AuthErrorPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center gap-4 text-center">
        <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
          <span className="text-red-600 text-2xl">!</span>
        </div>
        <h1 className="text-lg font-semibold text-slate-800">Sign In Failed</h1>
        <p className="text-sm text-slate-500">
          Your account could not be authenticated. Please ensure you are using your YCP Microsoft account.
        </p>
        <Link
          href="/"
          className="mt-2 px-6 py-2 rounded-lg bg-[#c0272d] text-white text-sm font-medium hover:bg-[#a8222a] transition-colors"
        >
          Back to Sign In
        </Link>
      </div>
    </main>
  )
}
