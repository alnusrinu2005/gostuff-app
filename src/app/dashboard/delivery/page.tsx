"use client"

import { useEffect, useState, ChangeEvent } from "react"
import { supabase } from "@/lib/supabase"
import { DeliveryPartner } from "@/types"

import Table from "@/components/ui/Table"
import SearchInput from "@/components/ui/SearchInput"
import Select from "@/components/ui/Select"
import StatusBadge from "@/components/ui/StatusBadge"

export default function DeliveryPartnersPage() {
  const [partners, setPartners] = useState<DeliveryPartner[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("All")

  useEffect(() => {
    const fetchPartners = async () => {
      setLoading(true)

      let query = supabase
        .from("delivery_partners")
        .select("*")
        .order("created_at", { ascending: false })

      if (status !== "All") {
        query = query.eq("status", status.toLowerCase())
      }

      if (search) {
        query = query.or(
          `name.ilike.%${search}%,phone.ilike.%${search}%`
        )
      }

      const { data, error } = await query

      if (!error && data) {
        setPartners(data)
      }

      setLoading(false)
    }

    const id = setTimeout(() => {
      fetchPartners()
    }, 0)
    return () => clearTimeout(id)
  }, [search, status])

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Delivery Partners</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <SearchInput
          placeholder="Search by name or phone..."
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
        />

        <Select
          options={["All", "Active", "Inactive", "Blocked"]}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => setStatus(e.target.value)}
        />
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading delivery partners...</p>
      ) : (
        <Table
          headers={[
            "Name",
            "Phone",
            "Vehicle",
            "Address",
            "Status",
            "Created",
          ]}
        >
          {partners.map(p => (
            <tr key={p.id}>
              <td className="p-2 border">{p.full_name}</td>
              <td className="p-2 border">{p.phone || "-"}</td>
              <td className="p-2 border">{p.vehicle_type || "-"}</td>
              <td className="p-2 border">{p.address || "-"}</td>
              <td className="p-2 border">
                <StatusBadge status={p.status} />
              </td>
              <td className="p-2 border">
                {new Date(p.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </Table>
      )}
    </>
  )
}
