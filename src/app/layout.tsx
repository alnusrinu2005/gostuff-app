import "./globals.css"

export const metadata = {
  title: "GoStuff",
  description: "GoStuff Delivery Platform",
  }
export const viewport = {
  themeColor: "#000000",
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
