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
      className="group block cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#111827] rounded-xl"
      data-testid="product-wrapper"
    >
      <div className="bg-[#1a2332] rounded-xl overflow-hidden border border-white/5 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary/30 group-hover:shadow-xl group-hover:shadow-primary/10">
        {/* Image container */}
        <div className="relative overflow-hidden bg-[#0f1923] aspect-square">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            isFeatured={isFeatured}
          />
          {/* Quick view overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <span className="font-heading font-bold text-white uppercase tracking-wider text-sm bg-primary px-5 py-2.5 rounded-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200">
              Quick View
            </span>
          </div>
        </div>

        {/* Card body */}
        <div className="p-4">
          <h3
            className="font-heading font-bold text-white text-base uppercase tracking-wide truncate mb-1"
            data-testid="product-title"
          >
            {product.title}
          </h3>
          {product.subtitle && (
            <p className="font-sans text-white/50 text-xs uppercase tracking-widest mb-2">
              {product.subtitle}
            </p>
          )}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
            {cheapestPrice && (
              <div className="font-heading font-bold text-primary text-xl">
                <PreviewPrice price={cheapestPrice} />
              </div>
            )}
            <span className="inline-flex items-center gap-1 text-xs font-heading font-semibold text-white/60 uppercase tracking-widest group-hover:text-primary transition-colors duration-200">
              View
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
