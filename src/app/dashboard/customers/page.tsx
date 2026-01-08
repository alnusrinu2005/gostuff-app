"use client"

import { useEffect, useState, useCallback, ChangeEvent } from "react"
import { supabase } from "@/lib/supabase"
import type { customers as Customer } from "@/types"

import Table from "@/components/ui/Table"
import SearchInput from "@/components/ui/SearchInput"
import Select from "@/components/ui/Select"
import StatusBadge from "@/components/ui/StatusBadge"

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("All")

  const fetchCustomers = useCallback(async () => {
    setLoading(true)

    let query = supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false })

    if (status !== "All") {
      query = query.eq("status", status.toLowerCase())
    }

    if (search) {
      query = query.ilike("name", `%${search}%`)
    }

    const { data, error } = await query

    setLoading(false)

    if (!error && data) {
      return data as Customer[]
    }

    return [] as Customer[]
  }, [search, status])

  useEffect(() => {
    let mounted = true
    const load = async () => {
      const data = await fetchCustomers()
      if (!mounted) return
      setCustomers(data)
    }
    load()
    return () => { mounted = false }
  }, [fetchCustomers])

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Customers</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <SearchInput
          placeholder="Search by name..."
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
        />

        <Select
          options={["All", "Active", "Inactive", "Blocked"]}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => setStatus(e.target.value)}
        />
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading customers...</p>
      ) : (
        <Table headers={["Name", "Phone", "Email", "Status", "Created"]}>
          {customers.map(c => (
            <tr key={c.id}>
              <td className="p-2 border">{c.customer_name}</td>
              <td className="p-2 border">{c.phone || "-"}</td>
              <td className="p-2 border">{c.email || "-"}</td>
              <td className="p-2 border">
                <StatusBadge status={c.status} />
              </td>
              <td className="p-2 border">
                {new Date(c.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </Table>
      )}
    </>
  )
}
