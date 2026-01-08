"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

import Sidebar from "@/components/layout/Sidebar"
import Header from "@/components/layout/Header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function checkAuth() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      const { data: profiles } = await supabase
        .from ("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      if (!profiles || profiles.role !== "admin") {
        router.push("/unauthorized")
        return
      }

      // ✅ update state ONLY if component is still mounted
      if (isMounted) {
        setLoading(false)
      }
    }

    checkAuth()

    return () => {
      isMounted = false
    }
  }, [router])

  if (loading) {
    return <p className="p-6">Checking access…</p>
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-50">
        <Header />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
