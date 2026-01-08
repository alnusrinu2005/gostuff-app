"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

type Notification = {
  id: string
  title: string
  message: string
  is_read: boolean
  created_at: string
}

export default function NotificationList() {
  const [list, setList] = useState<Notification[]>([])

  useEffect(() => {
    let mounted = true

    async function fetchNotifications() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (mounted) setList(data ?? [])
    }

    fetchNotifications()
    return () => {
      mounted = false
    }
  }, [])

  async function markRead(id: string) {
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id)

    setList(prev =>
      prev.map(n =>
        n.id === id ? { ...n, is_read: true } : n
      )
    )
  }

  return (
    <div className="space-y-2">
      {list.map(n => (
        <div
          key={n.id}
          className={`border p-3 rounded ${
            n.is_read ? "bg-gray-50" : "bg-white"
          }`}
        >
          <h4 className="font-semibold">{n.title}</h4>
          <p className="text-sm">{n.message}</p>

          {!n.is_read && (
            <button
              className="text-xs text-blue-600 mt-1"
              onClick={() => markRead(n.id)}
            >
              Mark as read
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
