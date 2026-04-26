import { z } from "@medusajs/framework/zod"

/**
 * POST /store/campaign/qr-scan
 * Body schema for recording a QR scan event from /scan/:id.
 */
export const PostCampaignQrScanSchema = z.object({
  gym_location_id: z.string().min(1),
  device_id: z.string().min(1).max(128).optional(),
  user_agent: z.string().max(512).optional(),
  referrer: z.string().max(512).optional(),
  source: z.enum(["qr", "direct", "share", "unknown"]).optional(),
})

/**
 * POST /store/campaign/email-signup
 * Body schema for waitlist signups from / and /scan/:id.
 */
export const PostCampaignEmailSignupSchema = z.object({
  email: z.string().email().max(254),
  source: z.enum(["coming_soon", "scan", "other"]).optional(),
  gym_location_id: z.string().optional(),
  qr_scan_id: z.string().optional(),
  consent: z.boolean().optional(),
  locale: z.enum(["en", "bn"]).optional(),
})
