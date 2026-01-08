"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Order } from "@/types"
import StatusBadge from "@/components/ui/StatusBadge"

export default function StoreDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function fetchOrders() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data } = await supabase
        .from("orders")
        .select(`
          id,
          order_id,
          status,
          created_at
        `)
        .eq("store_id", user.id)
        .order("created_at", { ascending: false })

      if (mounted) {
        setOrders((data ?? []) as Order[])
        setLoading(false)
      }
    }

    fetchOrders()
    return () => {
      mounted = false
    }
  }, [])

  if (loading) return <p>Loading orders…</p>

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Store Orders</h1>

      {orders.map(o => (
        <div
          key={o.id}
          className="border p-4 rounded mb-2 flex justify-between"
        >
          <div>
            <p className="font-semibold">{o.order_id}</p>
            <p className="text-sm text-gray-500">
              {new Date(o.created_at).toLocaleString()}
            </p>
          </div>

          <StatusBadge status={o.status} />
        </div>
      ))}
    </>
  )
}
