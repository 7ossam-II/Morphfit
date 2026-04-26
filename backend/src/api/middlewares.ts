import {
  defineMiddlewares,
  validateAndTransformBody,
} from "@medusajs/framework/http"
import {
  PostCampaignQrScanSchema,
  PostCampaignEmailSignupSchema,
} from "./store/campaign/validators"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/campaign/qr-scan",
      method: "POST",
      middlewares: [validateAndTransformBody(PostCampaignQrScanSchema)],
    },
    {
      matcher: "/store/campaign/email-signup",
      method: "POST",
      middlewares: [validateAndTransformBody(PostCampaignEmailSignupSchema)],
    },
  ],
})
