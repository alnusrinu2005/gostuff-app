import NotificationList from "@/components/notifications/NotificationList"

export default function Header() {
 
    <div className="absolute right-4 top-16 bg-white shadow p-4 z-50">
      <NotificationList />
    </div>
  return (
    <header className="bg-white border-b px-6 py-4 flex justify-between">
      <h2 className="font-semibold">Admin Panel</h2>
      <span className="text-sm text-gray-600">Admin</span>
    </header>
  )
}
