import { model } from "@medusajs/framework/utils"

/**
 * GymLocation
 * Represents a partner gym in Bangladesh where a MorphFit QR sticker is placed.
 * Each location has its own unique QR code that resolves to /scan/:id.
 */
const GymLocation = model.define("gym_location", {
  id: model.id().primaryKey(),
  name: model.text().searchable(),
  city: model.text().index("IDX_GYM_LOCATION_CITY"),
  area: model.text().nullable(),
  contact_name: model.text().nullable(),
  contact_phone: model.text().nullable(),
  is_active: model.boolean().default(true),
  // Internal reference shown on the printed sticker, e.g. "DHK-001"
  sticker_code: model.text().unique(),
  notes: model.text().nullable(),
})

export default GymLocation
