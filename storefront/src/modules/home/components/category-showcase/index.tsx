import LocalizedClientLink from "@modules/common/components/localized-client-link"

const CATEGORIES = [
  {
    name: "Protein",
    description: "Whey, Casein, Plant-based",
    href: "/categories/protein",
    bgClass: "from-orange-600 to-orange-400",
  },
  {
    name: "Pre-Workout",
    description: "Energy, Focus, Pump",
    href: "/categories/pre-workout",
    bgClass: "from-green-600 to-green-400",
  },
  {
    name: "Vitamins",
    description: "Health, Immunity, Recovery",
    href: "/categories/vitamins",
    bgClass: "from-blue-600 to-blue-400",
  },
  {
    name: "Accessories",
    description: "Gear, Apparel, Equipment",
    href: "/categories/accessories",
    bgClass: "from-purple-600 to-purple-400",
  },
]

export default function CategoryShowcase() {
  return (
    <section className="content-container py-16">
      <h2 className="font-heading font-bold text-4xl text-foreground uppercase text-center mb-2">
        Shop by Category
      </h2>
      <p className="text-grey-40 text-center font-sans mb-10">
        Find exactly what you need to reach your goals
      </p>
      <div className="grid grid-cols-2 small:grid-cols-4 gap-4">
        {CATEGORIES.map((cat) => (
          <LocalizedClientLink
            key={cat.href}
            href={cat.href}
            className="group block rounded-xl overflow-hidden cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <div
              className={`bg-gradient-to-br ${cat.bgClass} p-8 h-40 flex flex-col justify-end transition-opacity duration-200 group-hover:opacity-90`}
            >
              <h3 className="font-heading font-bold text-2xl text-white uppercase">
                {cat.name}
              </h3>
              <p className="font-sans text-white/80 text-sm">{cat.description}</p>
            </div>
          </LocalizedClientLink>
        ))}
      </div>
    </section>
  )
}
