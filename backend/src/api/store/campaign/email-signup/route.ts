import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "@medusajs/framework/zod"
import { PostCampaignEmailSignupSchema } from "../validators"
import CampaignModuleService from "../../../../modules/campaign/service"
import { CAMPAIGN_MODULE } from "../../../../modules/campaign"

type Body = z.infer<typeof PostCampaignEmailSignupSchema>

export const POST = async (
  req: MedusaRequest<Body>,
  res: MedusaResponse
): Promise<void> => {
  const campaign: CampaignModuleService = req.scope.resolve(CAMPAIGN_MODULE)
  const body = req.validatedBody

  // Idempotent: if the email already exists, return 200 with `already=true`
  // instead of erroring on the unique constraint. This matches the manifesto's
  // requirement that the Coming Soon page never shows a scary error to users
  // who re-submit.
  const existing = await campaign.listEmailSignups(
    { email: body.email.toLowerCase() },
    { take: 1 }
  )

  if (existing.length) {
    res.status(200).json({ email_signup: existing[0], already: true })
    return
  }

  const [signup] = await campaign.createEmailSignups([
    {
      email: body.email.toLowerCase(),
      source: body.source ?? "coming_soon",
      gym_location_id: body.gym_location_id ?? null,
      qr_scan_id: body.qr_scan_id ?? null,
      consent: body.consent ?? true,
      locale: body.locale ?? "en",
    },
  ])

  res.status(201).json({ email_signup: signup, already: false })
}
