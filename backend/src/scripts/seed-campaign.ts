import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import CampaignModuleService from "../modules/campaign/service"
import { CAMPAIGN_MODULE } from "../modules/campaign"

/**
 * Seeds all 22 partner gyms for the MorphFit launch sprint.
 * Run with: npx medusa exec ./src/scripts/seed-campaign.ts
 *
 * Each gym gets a unique sticker_code (e.g. DHK-001) which becomes the path
 * segment in the QR URL: https://morphfit.com/scan/<sticker_code>
 *
 * Note: sticker_code is used as the QR payload ID so the printed sticker
 * never needs to change even if the database row is updated.
 */
const GYMS = [
  {
    sticker_code: "DHK-001",
    name: "Rigan Fitness",
    city: "Dhaka",
    area: "Dhaka",
    maps_url: "https://maps.app.goo.gl/KacW49qVEtHJtBc89",
  },
  {
    sticker_code: "DHK-002",
    name: "Fame Fitness",
    city: "Dhaka",
    area: "Dhaka",
    maps_url: "https://maps.app.goo.gl/NhURmDmKAgkmXnEw7",
  },
  {
    sticker_code: "DHK-003",
    name: "Pears Body Building Centre",
    city: "Dhaka",
    area: "Uttara",
    maps_url: "https://maps.app.goo.gl/HiH4uEvaYbdwSyuSA",
  },
  {
    sticker_code: "DHK-004",
    name: "Cherry Drops",
    city: "Dhaka",
    area: "Dhaka",
    maps_url: "https://maps.app.goo.gl/BH2dugrm1vZWnubh8",
  },
  {
    sticker_code: "DHK-005",
    name: "Fitness Plus",
    city: "Dhaka",
    area: "Dhaka",
    maps_url: "https://maps.app.goo.gl/8uNVusks5Qk6AhfC6",
  },
  {
    sticker_code: "DHK-006",
    name: "South Pacific Health Club",
    city: "Dhaka",
    area: "Dhaka",
    maps_url: "https://maps.app.goo.gl/emFUpu1vNFWCPKPg6",
  },
  {
    sticker_code: "DHK-007",
    name: "Xtreme Fitness",
    city: "Dhaka",
    area: "Dhaka",
    maps_url: "https://maps.app.goo.gl/7in5twZB6um5N7H48",
  },
  {
    sticker_code: "DHK-008",
    name: "Muscle and Fitness Arena",
    city: "Dhaka",
    area: "Dhaka",
    maps_url: "https://maps.app.goo.gl/exfLXjcmLntVbZUcA",
  },
  {
    sticker_code: "DHK-009",
    name: "Fitlife Gym",
    city: "Dhaka",
    area: "Dhaka",
    maps_url: "https://maps.app.goo.gl/4GfRR1kxhc4osS8SA",
  },
  {
    sticker_code: "DHK-010",
    name: "Riverview Gym",
    city: "Dhaka",
    area: "Dhaka",
    maps_url: "https://maps.app.goo.gl/inuSQ8CbYrj2UbYAA",
  },
  {
    sticker_code: "DHK-011",
    name: "Hammer Gym",
    city: "Dhaka",
    area: "Dhaka",
    maps_url: "https://maps.app.goo.gl/kWq9F5HRpRPNUmYdA",
  },
  {
    sticker_code: "DHK-012",
    name: "Being Strong Gym",
    city: "Dhaka",
    area: "Dhaka",
    maps_url: "https://maps.app.goo.gl/RyZFDFZdWzHGYd3F8",
  },
  {
    sticker_code: "DHK-013",
    name: "Fitness Factory",
    city: "Dhaka",
    area: "Dhaka",
    maps_url: "https://maps.app.goo.gl/ydDB59Jn2guXwzk8A",
  },
  {
    sticker_code: "DHK-014",
    name: "Esporta Gym",
    city: "Dhaka",
    area: "Dhaka",
    maps_url: "https://maps.app.goo.gl/7pkJVtgvxLFUWeyQA",
  },
  {
    sticker_code: "DHK-015",
    name: "Radical Fit Gym",
    city: "Dhaka",
    area: "Dhaka",
    maps_url: "https://maps.app.goo.gl/7pkJVtgvxLFUWeyQA",
  },
  {
    sticker_code: "DHK-016",
    name: "Golden Gym",
    city: "Dhaka",
    area: "Dhaka",
    maps_url: "https://maps.app.goo.gl/rwCrfLVEsyPTusSJ6",
  },
  {
    sticker_code: "DHK-017",
    name: "Fit Revolution",
    city: "Dhaka",
    area: "Dhaka",
    maps_url: "https://maps.app.goo.gl/5ET9fzTaCLSikQSP7",
  },
  {
    sticker_code: "DHK-018",
    name: "Gifairy Fitness",
    city: "Dhaka",
    area: "Dhaka",
    maps_url: "https://maps.app.goo.gl/VPD81cFJik7CzoLv7",
  },
  {
    sticker_code: "DHK-019",
    name: "Metro Fitness",
    city: "Dhaka",
    area: "Dhaka",
    maps_url: "https://maps.app.goo.gl/DBKYXesst3Tgx2cE8",
  },
  {
    sticker_code: "DHK-020",
    name: "My Gym",
    city: "Dhaka",
    area: "Dhaka",
    maps_url: "https://maps.app.goo.gl/emNHxcJ2EZZkR1zh6",
  },
  {
    sticker_code: "DHK-021",
    name: "CrossFit Gym",
    city: "Dhaka",
    area: "Dhaka",
    maps_url: "https://maps.app.goo.gl/TgBmADRDRqK3F98d7",
  },
  {
    sticker_code: "DHK-022",
    name: "Fitness Science",
    city: "Dhaka",
    area: "Dhaka",
    maps_url: "https://maps.app.goo.gl/ch3JohKSmj8PtgmCA",
  },
]

export default async function seedCampaign({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const campaign: CampaignModuleService = container.resolve(CAMPAIGN_MODULE)

  for (const seed of GYMS) {
    const existing = await campaign.listGymLocations(
      { sticker_code: seed.sticker_code },
      { take: 1 }
    )
    if (existing.length) {
      logger.info(`Gym ${seed.sticker_code} already exists — skipping.`)
      continue
    }
    const [created] = await campaign.createGymLocations([seed])
    logger.info(`Created: ${created.sticker_code} → ${created.id}  (${created.name})`)
  }

  logger.info(`Campaign seed complete. ${GYMS.length} gyms processed.`)
}
