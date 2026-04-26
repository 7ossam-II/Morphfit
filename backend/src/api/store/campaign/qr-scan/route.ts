import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "@medusajs/framework/zod"
import crypto from "crypto"
import { PostCampaignQrScanSchema } from "../validators"
import CampaignModuleService from "../../../../modules/campaign/service"
import { CAMPAIGN_MODULE } from "../../../../modules/campaign"

type Body = z.infer<typeof PostCampaignQrScanSchema>

function hashIp(ip: string | undefined): string | null {
  if (!ip) return null
  // SHA-256 truncated; we never store raw IPs.
  return crypto.createHash("sha256").update(ip).digest("hex").slice(0, 32)
}

export const POST = async (
  req: MedusaRequest<Body>,
  res: MedusaResponse
): Promise<void> => {
  const campaign: CampaignModuleService = req.scope.resolve(CAMPAIGN_MODULE)
  const body = req.validatedBody

  // Best-effort: confirm the gym exists. If not, we still record the scan as
  // "unknown" so we don't lose analytics for a sticker that points to a
  // deleted location, but we never auto-create gyms.
  let knownGym = true
  try {
    await campaign.retrieveGymLocation(body.gym_location_id)
  } catch {
    knownGym = false
  }

  const forwardedFor = (req.headers["x-forwarded-for"] as string) || ""
  const ip = forwardedFor.split(",")[0]?.trim() || req.socket?.remoteAddress

  const [scan] = await campaign.createQrScans([
    {
      gym_location_id: body.gym_location_id,
      device_id: body.device_id ?? null,
      user_agent: body.user_agent ?? (req.headers["user-agent"] as string) ?? null,
      referrer: body.referrer ?? (req.headers.referer as string) ?? null,
      ip_hash: hashIp(ip),
      source: body.source ?? "qr",
    },
  ])

  res.status(201).json({
    qr_scan: { id: scan.id, created_at: (scan as any).created_at },
    known_gym: knownGym,
  })
}
