import { model } from "@medusajs/framework/utils"

/**
 * QrScan
 * One row per QR-code scan event. The `gym_location_id` is the foreign key
 * (string id) to the GymLocation that the sticker belongs to. We avoid a hard
 * relationship() here so the storefront can record a scan even if the
 * location was deleted (we still want analytics).
 */
const QrScan = model.define("qr_scan", {
  id: model.id().primaryKey(),
  gym_location_id: model.text().index("IDX_QR_SCAN_GYM_LOCATION_ID"),
  // Anonymous device fingerprint stored client-side in localStorage; lets us
  // distinguish unique scanners from total scans without using cookies.
  device_id: model.text().index("IDX_QR_SCAN_DEVICE_ID").nullable(),
  user_agent: model.text().nullable(),
  ip_hash: model.text().nullable(),
  referrer: model.text().nullable(),
  // Source channel: 'qr' (sticker), 'direct' (typed URL), 'share' (social)
  source: model
    .enum(["qr", "direct", "share", "unknown"])
    .default("qr"),
})

export default QrScan
