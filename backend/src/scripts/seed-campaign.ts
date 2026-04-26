import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import CampaignModuleService from "../modules/campaign/service"
import { CAMPAIGN_MODULE } from "../modules/campaign"

/**
 * Seeds a small set of partner gyms in Dhaka and Chattogram for the launch
 * sprint. Run with: `npx medusa exec ./src/scripts/seed-campaign.ts`
 */
export default async function seedCampaign({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const campaign: CampaignModuleService = container.resolve(CAMPAIGN_MODULE)

  const seeds = [
    {
      sticker_code: "DHK-001",
      name: "Iron Republic Gulshan",
      city: "Dhaka",
      area: "Gulshan-2",
      contact_name: "Rafiq",
      contact_phone: "+8801XXXXXXXXX",
    },
    {
      sticker_code: "DHK-002",
      name: "PowerHouse Banani",
      city: "Dhaka",
      area: "Banani",
    },
    {
      sticker_code: "DHK-003",
      name: "FitFactory Dhanmondi",
      city: "Dhaka",
      area: "Dhanmondi",
    },
    {
      sticker_code: "CTG-001",
      name: "Beast Mode Agrabad",
      city: "Chattogram",
      area: "Agrabad",
    },
  ]

  for (const seed of seeds) {
    const existing = await campaign.listGymLocations(
      { sticker_code: seed.sticker_code },
      { take: 1 }
    )
    if (existing.length) {
      logger.info(`Gym ${seed.sticker_code} already exists, skipping.`)
      continue
    }
    const [created] = await campaign.createGymLocations([seed])
    logger.info(`Created gym ${created.sticker_code} -> ${created.id}`)
  }

  logger.info("Campaign seed complete.")
}
