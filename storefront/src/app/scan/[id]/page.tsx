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
  const { gym_location } = await fetchCampaignStats(id)
  const gymName = gym_location?.name ?? "Your Gym"

  return {
    title: `MorphFit · ${gymName}`,
    description:
      "Premium supplements built for Bangladeshi athletes. Lab-tested, locally priced, delivered in 48 hours.",
    robots: { index: false, follow: false },
    openGraph: {
      title: `MorphFit × ${gymName}`,
      description:
        "Follow us on Instagram, like us on Facebook, or join the pre-launch waitlist.",
    },
    themeColor: "#0b1220",
  }
}

export default async function ScanPage({ params }: Props) {
  const { id } = await params
  const { gym_location } = await fetchCampaignStats(id)

  return (
    <ScanExperience
      gymLocationId={id}
      initialGym={gym_location}
    />
  )
}
