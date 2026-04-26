import { model } from "@medusajs/framework/utils"

/**
 * EmailSignup
 * Pre-launch waitlist captured from the Coming Soon page (/) and from the
 * Mobile Tracking Page (/scan/:id). Tracks which gym (if any) the lead came
 * from so we can attribute conversions back to specific stickers.
 */
const EmailSignup = model.define("email_signup", {
  id: model.id().primaryKey(),
  email: model.text().unique().searchable(),
  // Source page: 'coming_soon' or 'scan'.
  source: model
    .enum(["coming_soon", "scan", "other"])
    .default("coming_soon"),
  // Optional attribution to a gym sticker.
  gym_location_id: model
    .text()
    .index("IDX_EMAIL_SIGNUP_GYM_LOCATION_ID")
    .nullable(),
  // The matching qr_scan row, if the signup came from a scan flow.
  qr_scan_id: model.text().nullable(),
  // Marketing consent (Bangladesh privacy hygiene).
  consent: model.boolean().default(true),
  locale: model.enum(["en", "bn"]).default("en"),
})

export default EmailSignup
