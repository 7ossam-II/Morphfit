import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "MorphFit · Scan",
}

/**
 * Minimal layout for the Mobile Tracking Page.
 * Inherits <html>/<body> from the root layout, but renders no nav/footer so
 * the experience feels like a native app.
 */
export default function ScanLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
