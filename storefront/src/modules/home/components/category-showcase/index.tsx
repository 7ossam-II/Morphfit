import LocalizedClientLink from "@modules/common/components/localized-client-link"

const CATEGORIES = [
  {
    name: "Protein",
    description: "Whey, Casein, Plant-based",
    href: "/categories/protein",
    image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&q=80",
    accent: "#F97316",
  },
  {
    name: "Pre-Workout",
    description: "Energy, Focus, Pump",
    href: "/categories/pre-workout",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80",
    accent: "#22C55E",
  },
  {
    name: "Vitamins",
    description: "Health, Immunity, Recovery",
    href: "/categories/vitamins",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80",
    accent: "#3B82F6",
  },
  {
    name: "Accessories",
    description: "Gear, Apparel, Equipment",
    href: "/categories/accessories",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80",
    accent: "#A855F7",
  },
]

export default function CategoryShowcase() {
  return (
    <section className="bg-[#111827] py-16 small:py-20">
      <div className="content-container">
        {/* Section header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="font-heading font-semibold text-primary uppercase tracking-[0.2em] text-xs mb-2">
              Browse
            </p>
            <h2 className="font-heading font-bold text-4xl small:text-5xl text-white uppercase leading-none">
              Shop by Category
            </h2>
          </div>
          <LocalizedClientLink
            href="/store"
            className="hidden small:inline-flex items-center gap-2 font-heading font-semibold text-primary uppercase tracking-wider text-sm hover:gap-3 transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
          >
            View All
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </LocalizedClientLink>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-2 small:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <LocalizedClientLink
              key={cat.href}
              href={cat.href}
              className="group relative rounded-xl overflow-hidden cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#111827] aspect-[3/4]"
            >
              {/* Background image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url('${cat.image}')` }}
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              {/* Accent line */}
              <div
                className="absolute bottom-0 left-0 right-0 h-1 transition-all duration-300 group-hover:h-1.5"
                style={{ backgroundColor: cat.accent }}
              />
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="font-heading font-bold text-2xl text-white uppercase leading-tight">
                  {cat.name}
                </h3>
                <p className="font-sans text-white/70 text-sm mt-1">
                  {cat.description}
                </p>
                <div
                  className="inline-flex items-center gap-1.5 mt-3 text-xs font-heading font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ color: cat.accent }}
                >
                  Shop Now
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </div>
            </LocalizedClientLink>
          ))}
        </div>
      </div>
    </section>
  )
}
