"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

type Notification = {
  id: string
  title: string
  message: string
  is_read: boolean
  created_at: string
  user_id: string
}

export default function NotificationList() {
  const [list, setList] = useState<Notification[]>([])
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    let channel: any

    async function init() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return
      setUserId(user.id)

      // 1️⃣ Initial fetch
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      setList(data ?? [])

      // 2️⃣ Subscribe to realtime inserts
      channel = supabase
        .channel("notifications-realtime")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${user.id}`,
          },
          payload => {
            setList(prev => [
              payload.new as Notification,
              ...prev,
            ])
          }
        )
        .subscribe()
    }

    init()

    return () => {
      if (channel) supabase.removeChannel(channel)
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

  if (!userId) return null

  return (
    <div className="space-y-2 max-w-sm">
      {list.length === 0 && (
        <p className="text-sm text-gray-500">
          No notifications
        </p>
      )}

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
