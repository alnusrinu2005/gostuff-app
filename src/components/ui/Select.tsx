export default function Select({
  options,
  onChange,
}: {
  options: string[]
  onChange: (e: any) => void
}) {
  return (
    <select className="border p-2 rounded" onChange={onChange}>
      {options.map(o => (
        <option key={o}>{o}</option>
      ))}
    </select>
  )
}