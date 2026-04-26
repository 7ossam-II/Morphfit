import { MedusaService } from "@medusajs/framework/utils"
import GymLocation from "./models/gym-location"
import QrScan from "./models/qr-scan"
import EmailSignup from "./models/email-signup"

/**
 * CampaignModuleService
 * Auto-generates list/create/retrieve/update/delete methods for each model:
 *   - listGymLocations / createGymLocations / retrieveGymLocation / ...
 *   - listQrScans / createQrScans / ...
 *   - listEmailSignups / createEmailSignups / ...
 *
 * We also expose a few convenience aggregates used by the Mobile Tracking Page
 * to render real-time stats (total scans + unique devices for a given gym).
 */
class CampaignModuleService extends MedusaService({
  GymLocation,
  QrScan,
  EmailSignup,
}) {
  async getScanStats(gymLocationId: string): Promise<{
    total_scans: number
    unique_devices: number
    last_scan_at: Date | null
  }> {
    const scans = await this.listQrScans(
      { gym_location_id: gymLocationId },
      { take: 10000, order: { created_at: "DESC" } }
    )

    const uniqueDevices = new Set(
      scans
        .map((s: any) => s.device_id)
        .filter((d: string | null): d is string => Boolean(d))
    )

    return {
      total_scans: scans.length,
      unique_devices: uniqueDevices.size,
      last_scan_at: scans.length ? (scans[0] as any).created_at : null,
    }
  }
}

export default CampaignModuleService
