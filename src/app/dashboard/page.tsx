export default function Dashboard() {
  return (
    <div className="grid grid-cols-4 gap-6">
      {["Customers", "Stores", "Delivery", "Orders"].map(item => (
        <div key={item} className="bg-white p-6 rounded shadow">
          <h3 className="font-semibold">{item}</h3>
          <p className="text-2xl mt-2">0</p>
        </div>
      ))}
    </div>
  )
}
