import NotificationList from "@/components/notifications/NotificationList"

export default function Header() {
  return (
    <header className="bg-white border-b px-6 py-4 flex justify-between">
      <h2 className="font-semibold">Admin Panel</h2>
      <span className="text-sm text-gray-600">Admin</span>
    </header>
  )
}
