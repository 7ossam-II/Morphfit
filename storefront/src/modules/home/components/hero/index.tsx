import LocalizedClientLink from "@modules/common/components/localized-client-link"

const TRUST_ITEMS = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
    title: "Free Shipping $50+",
    subtitle: "On all US orders",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
    title: "100% Lab Tested",
    subtitle: "Quality guaranteed",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
    title: "50K+ Athletes",
    subtitle: "Trust MorphFit",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
      </svg>
    ),
    title: "500+ Products",
    subtitle: "Supplements & gear",
  },
]

export default function Hero() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[600px] small:min-h-[680px] flex items-center overflow-hidden bg-[#111827]">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#111827]/95 via-[#111827]/75 to-[#111827]/30" />
        <div className="relative content-container py-20 small:py-28 w-full">
          <div className="max-w-xl">
            <p className="inline-flex items-center gap-2 font-heading font-semibold text-primary uppercase tracking-[0.2em] text-xs mb-5 bg-primary/10 border border-primary/30 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Fuel Your Transformation
            </p>
            <h1 className="font-heading font-bold text-5xl small:text-7xl text-white leading-[0.9] uppercase mb-6">
              BUILD THE
              <br />
              <span className="text-primary">BODY</span>
              <br />
              YOU DESERVE
            </h1>
            <p className="font-sans text-white/70 text-lg mb-10 max-w-md leading-relaxed">
              Premium supplements, vitamins, and workout gear — everything you
              need to reach your peak performance.
            </p>
            <div className="flex flex-col xsmall:flex-row gap-4">
              <LocalizedClientLink
                href="/store"
                className="inline-flex items-center justify-center gap-2 bg-primary text-white font-heading font-bold uppercase tracking-wider px-8 py-4 rounded-lg hover:bg-orange-500 transition-all duration-200 cursor-pointer shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#111827]"
              >
                Shop Now
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/store"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-heading font-bold uppercase tracking-wider px-8 py-4 rounded-lg hover:bg-white/20 transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#111827]"
              >
                Best Sellers
              </LocalizedClientLink>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <div className="bg-[#1a2332] border-y border-white/10">
        <div className="content-container py-5">
          <div className="grid grid-cols-2 small:grid-cols-4 gap-4 small:gap-0 small:divide-x small:divide-white/10">
            {TRUST_ITEMS.map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-3 small:px-8 first:pl-0 last:pr-0"
              >
                <div className="text-primary flex-shrink-0">{item.icon}</div>
                <div>
                  <p className="font-heading font-bold text-white text-sm uppercase tracking-wide leading-tight">
                    {item.title}
                  </p>
                  <p className="font-sans text-white/50 text-xs mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
