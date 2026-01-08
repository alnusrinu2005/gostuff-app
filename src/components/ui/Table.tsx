type Props = {
  headers: string[]
  children: React.ReactNode
}

export default function Table({ headers, children }: Props) {
  return (
    <table className="w-full border border-gray-200">
      <thead className="bg-gray-100">
        <tr>
          {headers.map(h => (
            <th key={h} className="p-2 border text-left">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  )
}
console.log(Table)