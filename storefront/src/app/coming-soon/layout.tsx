import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "MorphFit · Coming Soon",
}

export default function ComingSoonLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
