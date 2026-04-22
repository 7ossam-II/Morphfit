import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default async function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({
    product,
  })

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group block cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-xl"
      data-testid="product-wrapper"
    >
      <div className="bg-surface-raised rounded-xl overflow-hidden transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-lg">
        <div className="relative overflow-hidden">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            isFeatured={isFeatured}
          />
        </div>
        <div className="p-4">
          <h3
            className="font-heading font-semibold text-foreground text-lg uppercase tracking-wide truncate mb-1"
            data-testid="product-title"
          >
            {product.title}
          </h3>
          <div className="flex items-center justify-between mt-2">
            {cheapestPrice && (
              <div className="font-heading font-bold text-primary text-xl">
                <PreviewPrice price={cheapestPrice} />
              </div>
            )}
            <span className="text-xs font-sans text-grey-40 uppercase tracking-widest">
              View
            </span>
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
