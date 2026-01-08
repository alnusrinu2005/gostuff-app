"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Order } from "@/types"
import StatusBadge from "@/components/ui/StatusBadge"
export default function DeliveryDashboard() {
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
        .select("*")
        .eq("delivery_partner_id", user.id)
        .order("created_at", { ascending: false })

      if (mounted) {
        setOrders(data ?? [])
        setLoading(false)
      }
    }

    fetchOrders()
    return () => {
      mounted = false
    }
  }, [])

  async function updateStatus(
    orderId: string,
    status: "out_for_delivery" | "delivered"
  ) {
    await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId)

    setOrders(prev =>
      prev.map(o =>
        o.id === orderId ? { ...o, status } : o
      )
    )
  }

  if (loading) return <p>Loading assigned orders…</p>

  return (
    <>
      <h1 className="text-xl font-bold mb-4">
        My Deliveries
      </h1>

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

          <div className="flex gap-2 items-center">
            <StatusBadge status={o.status} />

            {o.status === "assigned" && (
              <button
                className="text-blue-600 text-sm"
                onClick={() =>
                  updateStatus(o.id, "out_for_delivery")
                }
              >
                Start
              </button>
            )}

            {o.status === "out_for_delivery" && (
              <button
                className="text-green-600 text-sm"
                onClick={() =>
                  updateStatus(o.id, "delivered")
                }
              >
                Delivered
              </button>
            )}
          </div>
        </div>
      ))}
    </>
  )
}
