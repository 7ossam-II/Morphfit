import type { Metadata } from "next"
import ScanExperience from "@modules/campaign/scan/scan-experience"
import { fetchCampaignStats } from "@lib/campaign/client"

export const dynamic = "force-dynamic"
export const revalidate = 0

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  return {
    title: `MorphFit · Scan ${id}`,
    description:
      "You scanned a MorphFit sticker. Join the waitlist, claim launch-day pricing, and watch the gym light up live.",
    robots: { index: false, follow: false },
    openGraph: {
      title: "MorphFit · You unlocked the gym",
      description:
        "Premium supplements built for Bangladeshi athletes. Lab-tested, locally priced, fast delivery.",
    },
    viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
    themeColor: "#0b1220",
  }
}

export default async function ScanPage({ params }: Props) {
  const { id } = await params
  const { gym_location, stats } = await fetchCampaignStats(id)

  return (
    <ScanExperience
      gymLocationId={id}
      initialGym={gym_location}
      initialStats={stats}
    />
  )
}
