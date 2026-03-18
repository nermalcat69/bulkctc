BulkChai — Routing, Location Pages & SEO Architecture
1. Routing Strategy
Technique: Static Site Generation (SSG) with generateStaticParams

All location pages are pre-rendered at build time. No runtime data fetching occurs for any location page. The app uses Next.js App Router with a (states) route group.


app/
├── (states)/
│   ├── maharashtra/
│   │   ├── page.tsx          ← State listing page
│   │   └── [city]/
│   │       └── page.tsx      ← Individual city page (dynamic route)
│   ├── karnataka/
│   ├── tamil-nadu/
│   └── [28+ other state folders]/
├── available-locations/       ← Master location directory
├── robots.ts
└── sitemap.ts
Each state has its own hard-coded folder (not a dynamic state route). Within each state, [city] is a dynamic segment resolved at build time.

2. Location Page Creation
Data Source
All city data lives in a single file: cities.json


{
  "Maharashtra": {
    "Mumbai": {
      "city": "Mumbai",
      "state": "Maharashtra",
      "nearbyAreas": ["Thane", "Navi Mumbai"],
      "industries": ["FMCG", "Hospitality"],
      "transitDays": "2-3 days",
      "cityContext": "...",
      "usageFocus": "...",
      "faqs": [{ "question": "...", "answer": "..." }],
      "supplyChain": { ... },
      "localContext": { ... }
    }
  }
}
Utility Functions (lib/cityData.ts)
getAllCities() — full city map organized by state
getCityInfoFromSlugs(stateSlug, citySlug) — looks up city data from URL params
getRelatedCities(currentCitySlug) — returns nearby cities for internal linking
getCityCoordinates(city) — returns lat/lng for structured data
slugify(text) — converts city names to URL-safe slugs
getAllCityPages() — returns all { state, city } pairs for sitemap/params
generateStaticParams Pattern
Each state's [city]/page.tsx implements this:


export async function generateStaticParams() {
  const { getAllCities, slugify } = await import('@/lib/cityData')
  const allCities = getAllCities()
  const stateData = Object.entries(allCities).find(
    ([state]) => slugify(state) === 'maharashtra'  // hard-coded per state file
  )
  if (!stateData) return []
  const [, cities] = stateData
  return Object.keys(cities).map((city) => ({ city: slugify(city) }))
}
This generates routes like /maharashtra/mumbai, /maharashtra/pune, etc. at build time.

Page Component Pattern

interface CityPageProps {
  params: Promise<{ city: string }>
}

export default async function CityPage({ params }: CityPageProps) {
  const { city } = await params
  const cityInfo = getCityInfoFromSlugs('maharashtra', city)
  // render with cityInfo data
}
3. SEO Handling
A. Metadata
State pages — static export:


export const metadata: Metadata = generatePageMetadata({
  title: `Bulk Tea Supplier in Maharashtra | BulkChai`,
  description: `...`,
  canonical: '/maharashtra',
})
City pages — dynamic generation:


export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { city } = await params
  const cityInfo = getCityInfoFromSlugs('maharashtra', city)
  return generatePageMetadata({
    title: `Bulk Tea & Chai Supply in ${cityInfo.city} | BulkChai`,
    description: `Wholesale bulk tea for businesses in ${cityInfo.city}, ${cityInfo.state}...`,
    canonical: `/maharashtra/${city}`,
  })
}
generatePageMetadata() in lib/seo-utils.ts attaches OpenGraph, Twitter card, and robots directives to every metadata object.

B. Structured Data (JSON-LD)
Four schema types, all injected as <script type="application/ld+json"> tags:

Schema	Where	Purpose
Organization	Root layout	Site-wide brand identity
BreadcrumbList	Every page	Home → State → City hierarchy
WholesaleStore (LocalBusiness)	City pages	Local SEO with geo coordinates
FAQPage	LocationFAQ component	Rich results from city-specific Q&A
C. Sitemap (app/sitemap.ts)

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const cityPages = getAllCityPages()
  const cityRoutes = cityPages.map(({ state, city }) => ({
    url: `${siteUrl}/${state}/${city}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'monthly',
    priority: 0.7,
  }))
  // also includes static routes + blog posts
  return [...routes, ...blogRoutes, ...cityRoutes]
}
All ~150+ city pages are included programmatically.

D. robots.txt (app/robots.ts)

export const dynamic = 'force-static'

export async function GET() {
  return new Response(`
User-agent: *
Allow: /
Sitemap: ${siteUrl}/sitemap.xml
LLMs-txt: ${siteUrl}/llms.txt
  `, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
E. Global Robots Directives (layout metadata)

robots: {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    'max-video-preview': -1,
    'max-image-preview': 'large',
    'max-snippet': -1,
  },
}
F. Site Config (data/siteMetadata.js)
Single source of truth for: siteUrl, title, language, locale, companyName, contactPoint, defaultKeywords, Twitter/X handle.

4. Blog Routing (Bonus)
Uses a catch-all route app/(states)/blog/[...slug]/page.tsx powered by Contentlayer. generateStaticParams reads from frontmatter. Metadata includes article OG type with publishedTime and authors.

Replication Checklist
 cities.json — flat data file with all city/state content
 lib/cityData.ts — slug utilities + data accessors
 lib/seo-utils.ts — generatePageMetadata, all JSON-LD generators
 data/siteMetadata.js — global config
 app/(states)/[state]/[city]/page.tsx — template with generateStaticParams + generateMetadata
 app/sitemap.ts — programmatic sitemap
 app/robots.ts — static robots.txt
 Root layout with metadataBase, OG defaults, Organization schema
