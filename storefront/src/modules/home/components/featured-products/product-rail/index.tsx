import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"

export default async function ProductRail({
  collection,
  region,
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products: pricedProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: collection.id,
      fields: "*variants.calculated_price",
    },
  })

  if (!pricedProducts || pricedProducts.length === 0) {
    return null
  }

  return (
    <section className="bg-[#111827] py-16 small:py-20">
      <div className="content-container">
        {/* Section header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="font-heading font-semibold text-primary uppercase tracking-[0.2em] text-xs mb-2">
              Featured
            </p>
            <h2 className="font-heading font-bold text-4xl small:text-5xl text-white uppercase leading-none">
              {collection.title}
            </h2>
          </div>
          <LocalizedClientLink
            href={`/collections/${collection.handle}`}
            className="hidden small:inline-flex items-center gap-2 font-heading font-semibold text-primary uppercase tracking-wider text-sm hover:gap-3 transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
          >
            View All
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </LocalizedClientLink>
        </div>

        {/* Product grid */}
        <ul className="grid grid-cols-2 small:grid-cols-3 large:grid-cols-4 gap-4 small:gap-6">
          {pricedProducts.map((product) => (
            <li key={product.id}>
              <ProductPreview product={product} region={region} isFeatured />
            </li>
          ))}
        </ul>

        {/* Mobile view all */}
        <div className="mt-8 small:hidden text-center">
          <LocalizedClientLink
            href={`/collections/${collection.handle}`}
            className="inline-flex items-center gap-2 font-heading font-semibold text-primary uppercase tracking-wider text-sm cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
          >
            View All {collection.title}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </LocalizedClientLink>
        </div>
      </div>
    </section>
  )
}
