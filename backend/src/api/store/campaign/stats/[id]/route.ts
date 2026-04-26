import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import CampaignModuleService from "../../../../../modules/campaign/service"
import { CAMPAIGN_MODULE } from "../../../../../modules/campaign"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  const campaign: CampaignModuleService = req.scope.resolve(CAMPAIGN_MODULE)
  const id = req.params.id

  let gym: any = null
  try {
    gym = await campaign.retrieveGymLocation(id)
  } catch {
    // Unknown gym is not a 404 here: the Mobile Tracking Page will still
    // render in "demo" mode with zeroed stats while the team prints a
    // sticker for a brand-new location.
  }

  const stats = await campaign.getScanStats(id)

  res.json({
    gym_location: gym
      ? {
          id: gym.id,
          name: gym.name,
          city: gym.city,
          area: gym.area,
          sticker_code: gym.sticker_code,
          is_active: gym.is_active,
        }
      : null,
    stats,
  })
}
