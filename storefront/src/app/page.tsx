import type { Metadata } from "next"
import ComingSoonExperience from "@modules/campaign/coming-soon/coming-soon-experience"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "MorphFit · Premium supplements built for Bangladesh",
  description:
    "Lab-tested supplements priced in taka, shipped in 48 hours from Dhaka. Join the waitlist for launch-day pricing.",
  themeColor: "#0b1220",
}

function getLaunchAtIso(): string {
  const fromEnv = process.env.NEXT_PUBLIC_LAUNCH_AT
  if (fromEnv && !Number.isNaN(new Date(fromEnv).getTime())) {
    return new Date(fromEnv).toISOString()
  }
  const fallback = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
  return fallback.toISOString()
}

/**
 * Pre-launch root page. Once the storefront opens, replace this with the
 * region-aware redirect by deleting this file (or by routing it to
 * `redirect("/{defaultRegion}")`).
 */
export default function RootPage() {
  return <ComingSoonExperience launchAtIso={getLaunchAtIso()} />
}
