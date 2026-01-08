export type Profile = {
  id: string
  role: "admin" | "store" | "delivery" | "customer"
}
export type customers = {
  id: string
  customer_name: string
  phone: string | null
  email: string | null
  status: "active" | "inactive" | "blocked"
  address: string | null
  created_at: string
}
export type StorePartner = {
  id: string
  store_name: string
  owner_name: string | null
  phone: string | null
  city: string | null
  store_address: string | null
  latitude: number | null
  longitude: number | null
  status: "active" | "inactive" | "blocked"
  created_at: string
}
export type DeliveryPartner = {
  id: string
  full_name: string
  phone: string | null
  vehicle_type: string | null
  address: string | null
  latitude: number | null
  longitude: number | null
  status: "active" | "inactive" | "blocked"
  created_at: string
}
export type Order = {
  id: string
  order_id: string
  total_amount: number | null
  status:
    | "placed"
    | "accepted"
    | "packed"
    | "assigned"
    | "out_for_delivery"
    | "delivered"
    | "cancelled"
  created_at: string

  customer_id: string | null
  store_id: string | null
  delivery_partner_id: string | null
  order_ids: string | null

  customers: { customer_name: string }[] | null
  store_partners: { store_name: string }[] | null
  delivery_partners: { full_name: string }[] | null
  order_items: { order_id: string }[] | null
}
export type FilterParams = {
  page?: number
  limit?: number
  search?: string
  status?: string
  sort_by?: "created_at" | "customer_name" | "store_name"
  sort_order?: "asc" | "desc"
  order_ids?: Order[]

  customers?: {
    customer_name: string
  }
  store_partners?: {
    store_name: string
  }
  delivery_partners?: {
    full_name: string
  }
  order?: {
    order_id: string
  }
}
