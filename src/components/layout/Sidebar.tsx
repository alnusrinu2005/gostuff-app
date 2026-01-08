import Link from "next/link"

export default function Sidebar() {
  return (
    <aside className="w-64 bg-black text-white p-6">
      <h1 className="text-xl font-bold mb-6">GoStuff Admin</h1>

      <nav className="space-y-3">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/dashboard/customers">Customers</Link>
        <Link href="/dashboard/stores">Store Partners</Link>
        <Link href="/dashboard/delivery">Delivery Partners</Link>
        <Link href="/dashboard/orders">Orders</Link>
      </nav>
    </aside>
  )
}
