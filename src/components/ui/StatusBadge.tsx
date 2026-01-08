// src/components/ui/StatusBadge.tsx
export default function StatusBadge({ status }: { status: string }) {
  const colors: any = {
    active: "bg-green-100 text-green-700",
    inactive: "bg-gray-200 text-gray-700",
    pending: "bg-yellow-100 text-yellow-700",
    delivered: "bg-blue-100 text-blue-700"
  }

  return (
    <span className={`px-2 py-1 text-xs rounded ${colors[status]}`}>
      {status}
    </span>
  )
}
