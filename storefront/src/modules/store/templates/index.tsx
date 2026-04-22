import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = ({
  sortBy,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div
      className="flex flex-col small:flex-row small:items-start py-8 content-container gap-8"
      data-testid="category-container"
    >
      <aside className="small:min-w-[220px]">
        <RefinementList sortBy={sort} />
      </aside>

      <div className="w-full">
        <div className="mb-8">
          <h1
            className="font-heading font-bold text-4xl text-foreground uppercase"
            data-testid="store-page-title"
          >
            All Products
          </h1>
          <p className="font-sans text-grey-40 mt-1">
            Premium supplements and workout gear
          </p>
        </div>
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            countryCode={countryCode}
          />
        </Suspense>
      </div>
    </div>
  )
}

export default StoreTemplate
