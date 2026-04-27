import type { Metadata } from "next"
import ComingSoonExperience from "@modules/campaign/coming-soon/coming-soon-experience"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "MorphFit · Premium supplements built for Bangladesh",
  description:
    "Lab-tested supplements priced in taka, shipped in 48 hours from Dhaka. Join the waitlist for launch-day pricing.",
  openGraph: {
    title: "MorphFit · Premium supplements built for Bangladesh",
    description:
      "Lab-tested supplements priced in taka, shipped in 48 hours. Join the waitlist for launch-day pricing.",
  },
  themeColor: "#0b1220",
}

function getLaunchAtIso(): string {
  // Allow override via env so the team can shift the public countdown without
  // a redeploy. Falls back to 14 days from now.
  const fromEnv = process.env.NEXT_PUBLIC_LAUNCH_AT
  if (fromEnv && !Number.isNaN(new Date(fromEnv).getTime())) {
    return new Date(fromEnv).toISOString()
  }
  const fallback = new Date(Date.now() + 16 * 60 * 60 * 1000)
  return fallback.toISOString()
}

export default function ComingSoonPage() {
  return <ComingSoonExperience launchAtIso={getLaunchAtIso()} />
}
