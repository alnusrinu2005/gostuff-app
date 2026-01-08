"use client"

import { useEffect, useState, type ChangeEvent } from "react"
import { supabase } from "@/lib/supabase"
import { Order, DeliveryPartner } from "@/types"

import Table from "@/components/ui/Table"
import Select from "@/components/ui/Select"
import StatusBadge from "@/components/ui/StatusBadge"

type OrdersQueryRow = {
  id: string
  order_id?: string
  total_amount?: number | null
  status?: string
  created_at?: string
  delivery_partner_id?: string | null
  customers?: { id?: string; customer_name?: string }[]
  store_partners?: { id?: string; store_name?: string }[]
  delivery_partners?: { id?: string; full_name?: string }[]
  order_items?: unknown[]
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [partners, setPartners] = useState<DeliveryPartner[]>([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState("All")

  useEffect(() => {
    let isMounted = true

    async function fetchData() {
      setLoading(true)

      /* ---- Fetch Orders ---- */
      let ordersQuery = supabase
        .from("orders")
        .select(`
          id,
          order_id,
          total_amount,
          status,
          created_at,
          delivery_partner_id,
          customers ( customer_name ),
          store_partners ( store_name ),
          delivery_partners ( full_name )
        `)
        .order("created_at", { ascending: false })

      if (status !== "All") {
        ordersQuery = ordersQuery.eq("status", status)
      }

      const { data: ordersData } = await ordersQuery

      /* ---- Fetch Delivery Partners ---- */
      const { data: partnersData } = await supabase
        .from("delivery_partners")
        .select("id, full_name")
        .eq("status", "active")

      if (isMounted) {
        const mappedOrders: Order[] = (ordersData ?? []).map((r: OrdersQueryRow) => ({
          id: r.id,
          order_id: r.order_id,
          total_amount: r.total_amount,
          status: r.status,
          created_at: r.created_at,
          delivery_partner_id: r.delivery_partner_id,
          customers: r.customers,
          store_partners: r.store_partners,
          delivery_partners: r.delivery_partners,
          // fill missing fields expected by Order type
          customer_id: r.customers?.[0]?.id ?? null,
          store_id: r.store_partners?.[0]?.id ?? null,
          order_ids: r.order_id ?? "",
          order_items: (r.order_items ?? []) as unknown as Order["order_items"],
        } as Order))
        
        setOrders(mappedOrders)
        setPartners((partnersData ?? []) as unknown as DeliveryPartner[])
        setLoading(false)
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [status])

  async function assignDelivery(orderId: string, partnerId: string) {
    await supabase
      .from("orders")
      .update({
        delivery_partner_id: partnerId,
        status: "assigned",
      })
      .eq("id", orderId)

    // refresh after assignment
    setStatus(prev => prev)
  }

  function findNearestPartner(
    delivery_latitude: number | string | null | undefined,
    delivery_longitude: number | string | null | undefined,
    partners: DeliveryPartner[]
  ): DeliveryPartner | undefined {
    if (delivery_latitude == null || delivery_longitude == null) return undefined

    let nearest: DeliveryPartner | undefined = undefined
    let minDist = Infinity

    for (const p of partners) {
      const obj = p as unknown as Record<string, unknown>
      const lat = obj["delivery_latitude"] ?? obj["latitude"] ?? obj["lat"]
      const lon = obj["delivery_longitude"] ?? obj["longitude"] ?? obj["lng"] ?? obj["lon"]

      if (lat == null || lon == null) continue

      const dLat = Number(lat as string | number) - Number(delivery_latitude)
      const dLon = Number(lon as string | number) - Number(delivery_longitude)
      const distSq = dLat * dLat + dLon * dLon

      if (distSq < minDist) {
        minDist = distSq
        nearest = p
      }
    }

    return nearest
  }

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Orders</h1>

      {/* Status Filter */}
      <div className="mb-4 w-48">
        <Select
          options={[
            "All",
            "placed",
            "accepted",
            "packed",
            "assigned",
            "out_for_delivery",
            "delivered",
            "cancelled",
          ]}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => setStatus(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <Table
          headers={[
            "Order",
            "Customer",
            "Store",
            "Amount",
            "Delivery Partner",
            "Status",
          ]}
        >
          {orders.map(o => (
            <tr key={o.id}>
              <td className="p-2 border">{o.order_id}</td>
              <td className="p-2 border">
                {o.customers?.[0]?.customer_name || "-"}
              </td>
              <td className="p-2 border">
                {o.store_partners?.[0]?.store_name || "-"}
              </td>
              <td className="p-2 border">
                ₹{o.total_amount ?? 0}
              </td>

<td className="p-2 border">
  {o.delivery_partners?.[0]?.full_name || (
    <button
      className="text-sm text-blue-600 underline"
      onClick={() => {
        const oObj = o as unknown as Record<string, unknown>
        if (
          oObj["delivery_latitude"] == null ||
          oObj["delivery_longitude"] == null
        ) {
          alert("Order location missing")
          return
        }

        const nearest = findNearestPartner(
          oObj["delivery_latitude"] as number | string,
          oObj["delivery_longitude"] as number | string,
          partners
        )

        if (!nearest) {
          alert("No delivery partners with location")
          return
        }

        assignDelivery(o.id, nearest.id)
      }}
    >
      Auto Assign Nearest
    </button>
  )}
</td>
<td className="p-2 border">
                {o.delivery_partners?.[0]?.full_name || (
                  <select
                    className="border p-1 rounded"
                    defaultValue=""
                    aria-label={`Assign delivery partner for order ${o.order_id}`}
                    title={`Assign delivery partner for order ${o.order_id}`}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      assignDelivery(o.id, e.target.value)
                    }
                  >
                    <option value="" disabled>
                      Assign
                    </option>
                    {partners.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.full_name}
                      </option>
                    ))}
                  </select>
                )}
              </td>

              <td className="p-2 border">
                <StatusBadge status={o.status} />
              </td>
            </tr>
          ))}
        </Table>
      )}
    </>
  )
}
