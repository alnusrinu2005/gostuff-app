"use client"

import { useEffect, useState, ChangeEvent } from "react"
import { supabase } from "@/lib/supabase"
import { StorePartner } from "@/types"

import Table from "@/components/ui/Table"
import SearchInput from "@/components/ui/SearchInput"
import Select from "@/components/ui/Select"
import StatusBadge from "@/components/ui/StatusBadge"

export default function StoresPage() {
  const [stores, setStores] = useState<StorePartner[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("All")
  const [city, setCity] = useState("")

  useEffect((): () => void => {
    let mounted = true

    const fetchStores = async () => {
      // defer initial state update to avoid synchronous setState within effect
      await Promise.resolve()
      setLoading(true)

      let query = supabase
        .from("store_partners")
        .select("*")
        .order("created_at", { ascending: false })

      if (status !== "All") {
        query = query.eq("status", status.toLowerCase())
      }

      if (search) {
        query = query.ilike("store_name", `%${search}%`)
      }

      if (city) {
        query = query.ilike("city", `%${city}%`)
      }

      const { data, error } = await query

      if (!mounted) return

      if (!error && data) {
        setStores(data)
      }

      setLoading(false)
    }

    fetchStores()

    return () => {
      mounted = false
    }
  }, [search, status, city])

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Store Partners</h1>

      {/* Filters */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <SearchInput
          placeholder="Search store name..."
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
        />

        <SearchInput
          placeholder="Filter by city..."
          onChange={(e: ChangeEvent<HTMLInputElement>) => setCity(e.target.value)}
        />

        <Select
          options={["All", "Active", "Inactive", "Blocked"]}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => setStatus(e.target.value)}
        />
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading store partners...</p>
      ) : (
        <Table
          headers={[
            "Store",
            "Owner",
            "Phone",
            "City",
            "Address",
            "Status",
          ]}
        >
          {stores.map((s: StorePartner & { address?: string }) => (
            <tr key={s.id}>
              <td className="p-2 border">{s.store_name}</td>
              <td className="p-2 border">{s.owner_name || "-"}</td>
              <td className="p-2 border">{s.phone || "-"}</td>
              <td className="p-2 border">{s.city || "-"}</td>
              <td className="p-2 border">{s.address || "-"}</td>
              <td className="p-2 border">
                <StatusBadge status={s.status} />
              </td>
            </tr>
          ))}
        </Table>
      )}
    </>
  )
}
