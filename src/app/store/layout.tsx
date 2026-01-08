"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function checkRole() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      if (!profile || profile.role !== "store") {
        router.push("/unauthorized")
        return
      }

      if (mounted) setLoading(false)
    }

    checkRole()
    return () => {
      mounted = false
    }
  }, [router])

  if (loading) return <p className="p-6">Loading store panel…</p>

  return <div className="p-6">{children}</div>
}
