export default function SearchInput({
  placeholder,
  onChange,
}: {
  placeholder: string
  onChange: (e: any) => void
}) {
  return (
    <input
      className="border p-2 rounded w-full"
      placeholder={placeholder}
      onChange={onChange}
    />
  )
}