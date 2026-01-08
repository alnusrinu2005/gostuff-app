"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      })

    if (authError || !data.user) {
      setError(authError?.message || "Login failed")
      setLoading(false)
      return
    }

    // Fetch role from profile table
    const { data: profile, error: profileError } =
      await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single()

    if (profileError || !profile) {
      setError(profileError?.message || "Failed to fetch user profile")
      setLoading(false)
      return
    }

    // Redirect based on role
    switch (profile.role) {
      case "admin":
        router.push("/dashboard")
        break
      case "store":
        router.push("/store")
        break
      case "delivery":
        router.push("/delivery")
        break
      default:
        router.push("/src/app")
    }

    setLoading(false)
  }

  return (
    <div className="p-10 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Login</h1>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label>Email</label>
          <input
            type="email"
            required
            title="Email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            required
            title="Password"
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded w-full"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  )
}
