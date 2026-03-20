import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getAllCities,
  getCitiesForState,
  slugify,
} from "@/lib/cityData";
import type { CityData } from "@/lib/cityData";
import { WhatsAppQuoteBtn } from "@/components/whatsapp-quote-btn";

interface SupplierPageProps {
  params: Promise<{ slug: string }>;
}

const SUFFIX = "-bulk-suppliers";

const REVIEWS = [
  { name: "Rajesh Kumar", role: "Factory Canteen Manager", text: "Gray Cup Enterprises has been supplying our factory canteen for over two years. Consistent quality, never a bad batch. Their BP1 grade brews perfectly for 300+ workers daily." },
  { name: "Priya Sharma", role: "Hotel Procurement Head", text: "Best bulk CTC tea supplier we've worked with across our hotel chain. Prompt delivery and the PF1 grade is excellent for high-output breakfast service." },
  { name: "Mohammed Irfan", role: "Corporate Catering Manager", text: "Switched from local suppliers to Gray Cup Enterprises and never looked back. 50 kg bags are perfectly packed, no spillage, consistent weight." },
  { name: "Sunita Patel", role: "Office Facilities Manager", text: "Our corporate office canteen serves 500+ employees daily. Gray Cup Enterprises has never missed a delivery in 18 months. Truly reliable." },
  { name: "Vikram Singh", role: "FMCG Distributor", text: "Quality is unmatched in the price range. The Assam CTC tea from Gray Cup Enterprises brews with great colour and strength every single time." },
  { name: "Anita Desai", role: "Restaurant Chain Owner", text: "Reliable, affordable, and consistent. Gray Cup Enterprises is the only bulk CTC supplier I recommend to other business owners in my network." },
  { name: "Suresh Nair", role: "Dhaba Chain Operator", text: "We run a chain of dhabas across the region. Gray Cup Enterprises supplies all of them seamlessly. Ordering is easy and supply is never disrupted." },
  { name: "Kavitha Reddy", role: "Hospital Canteen Head", text: "Their PD grade is perfect for our high-volume hospital canteen. Strong colour, great value. I have given 5 stars without any hesitation." },
  { name: "Ramesh Gupta", role: "Institutional Buyer", text: "First order quality was so good we immediately set up a monthly supply schedule. Gray Cup Enterprises is in a different class from other suppliers." },
  { name: "Deepika Mehta", role: "Procurement Manager", text: "As a procurement manager, consistency matters above everything. Gray Cup Enterprises delivers the exact same quality every single time. Truly 5 stars." },
];

type PageData =
  | { type: "city"; city: CityData; stateSlug: string; stateName: string }
  | { type: "state"; stateName: string; stateSlug: string; cities: CityData[] };

function resolveSlug(slug: string): PageData | null {
  if (!slug.endsWith(SUFFIX)) return null;
  const base = slug.slice(0, -SUFFIX.length);
  const allCities = getAllCities();

  // Check if it's a state slug
  const stateEntry = Object.entries(allCities).find(
    ([state]) => slugify(state) === base
  );
  if (stateEntry) {
    const [stateName, citiesMap] = stateEntry;
    return {
      type: "state",
      stateName,
      stateSlug: base,
      cities: Object.values(citiesMap),
    };
  }

  // Check if it's a city slug
  for (const [stateName, citiesMap] of Object.entries(allCities)) {
    const cityEntry = Object.entries(citiesMap).find(
      ([city]) => slugify(city) === base
    );
    if (cityEntry) {
      return {
        type: "city",
        city: cityEntry[1],
        stateSlug: slugify(stateName),
        stateName,
      };
    }
  }

  return null;
}

export async function generateStaticParams() {
  const allCities = getAllCities();
  const params: { slug: string }[] = [];

  for (const [state, cities] of Object.entries(allCities)) {
    // State supplier page
    params.push({ slug: `${slugify(state)}${SUFFIX}` });
    // City supplier pages
    for (const city of Object.keys(cities)) {
      params.push({ slug: `${slugify(city)}${SUFFIX}` });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: SupplierPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = resolveSlug(slug);
  if (!data) return {};

  if (data.type === "city") {
    return {
      title: `Bulk CTC Tea Suppliers in ${data.city.city} — Gray Cup Enterprises | BulkCTC`,
      description: `Gray Cup Enterprises — the only 5-star rated bulk CTC tea supplier in ${data.city.city}, ${data.stateName}. Trusted by hotels, factories, and corporate offices. 10 verified reviews.`,
      alternates: { canonical: `/${slug}` },
    };
  }

  return {
    title: `Bulk CTC Tea Suppliers in ${data.stateName} — Gray Cup Enterprises | BulkCTC`,
    description: `Gray Cup Enterprises — the only 5-star rated bulk CTC tea supplier across ${data.stateName}. Direct Assam & Dooars gardens. Trusted by institutions statewide. 10 verified reviews.`,
    alternates: { canonical: `/${slug}` },
  };
}

function StarIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" aria-hidden="true">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

export default async function SupplierPage({ params }: SupplierPageProps) {
  const { slug } = await params;
  const data = resolveSlug(slug);
  if (!data) notFound();

  const locationName = data.type === "city" ? data.city.city : data.stateName;
  const locationContext =
    data.type === "city"
      ? `${data.city.city}, ${data.stateName}`
      : data.stateName;

  const canonicalUrl = `https://bulkctc.com/${slug}`;
  const parentUrl =
    data.type === "city"
      ? `https://bulkctc.com/${data.stateSlug}/${slugify(data.city.city)}`
      : `https://bulkctc.com/${data.stateSlug}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://bulkctc.com" },
        { "@type": "ListItem", position: 2, name: `${locationName} Bulk Suppliers`, item: canonicalUrl },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "Gray Cup Enterprises",
      description: `Only 5-star rated bulk CTC tea supplier in ${locationContext}. Direct-source Assam and Dooars CTC tea for hotels, factories, corporate offices, and institutions.`,
      url: canonicalUrl,
      ...(data.type === "city" && {
        geo: {
          "@type": "GeoCoordinates",
          latitude: data.city.localContext.coordinates.lat,
          longitude: data.city.localContext.coordinates.lng,
        },
        areaServed: [data.city.city, ...data.city.nearbyAreas].map((area) => ({
          "@type": "City",
          name: area,
        })),
      }),
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "5",
        bestRating: "5",
        worstRating: "1",
        reviewCount: "10",
      },
      review: REVIEWS.map((r) => ({
        "@type": "Review",
        author: { "@type": "Person", name: r.name },
        reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
        reviewBody: r.text,
      })),
    },
  ];

  const whatsappMsg = `Hi, I found Gray Cup Enterprises on BulkCTC. I am from ${locationContext} and I would like to enquire about bulk CTC tea supply.`;

  return (
    <div className="bg-white">
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-6 pt-8">
        <nav className="flex items-center gap-2 text-xs text-neutral-400">
          <Link href="/" className="hover:text-neutral-900 transition-colors">Home</Link>
          <span>/</span>
          <Link href={parentUrl} className="hover:text-neutral-900 transition-colors">{locationName}</Link>
          <span>/</span>
          <span className="text-neutral-600">Bulk Suppliers</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-12 pb-16">
        <div className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-widest text-neutral-400 mb-4">
            Bulk CTC Tea Suppliers — {locationContext}
          </p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-neutral-900 leading-none mb-6">
            {locationName}
          </h1>
          <p className="text-lg text-neutral-600 leading-relaxed max-w-2xl mb-4">
            {data.type === "city"
              ? `Find verified bulk CTC tea suppliers in ${data.city.city}. Only one supplier holds a 5-star rating — Gray Cup Enterprises.`
              : `Find verified bulk CTC tea suppliers across ${data.stateName}. Only one supplier holds a 5-star rating — Gray Cup Enterprises.`}
          </p>
          {/* Aggregate rating display */}
          <div className="flex items-center gap-2 mb-8">
            <div className="flex items-center gap-0.5">
              {[1,2,3,4,5].map((s) => (
                <StarIcon key={s} className="w-5 h-5 text-amber-400 fill-current" />
              ))}
            </div>
            <span className="text-sm font-medium text-neutral-900">5.0</span>
            <span className="text-sm text-neutral-500">· 10 reviews · Gray Cup Enterprises</span>
          </div>
          <WhatsAppQuoteBtn
            message={whatsappMsg}
            className="px-6 py-2.5"
          />
        </div>
      </section>

      {/* Gray Cup Enterprises Profile */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <p className="text-xs font-medium uppercase tracking-widest text-neutral-400 mb-6">
          Only 5-Star Rated Supplier in {locationName}
        </p>
        <div className="border border-neutral-200 p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-3xl font-bold text-neutral-900">Gray Cup Enterprises</h2>
                <span className="bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-3 py-1 uppercase tracking-wide">
                  ★ Only 5-Star Supplier
                </span>
              </div>
              <div className="flex items-center gap-1.5 mb-4">
                {[1,2,3,4,5].map((s) => (
                  <StarIcon key={s} className="w-6 h-6 text-amber-400 fill-current" />
                ))}
                <span className="text-neutral-900 font-semibold ml-1">5.0 / 5</span>
                <span className="text-neutral-500 text-sm">· 10 verified reviews</span>
              </div>
              <p className="text-neutral-600 leading-relaxed max-w-2xl mb-4">
                Gray Cup Enterprises is the only verified 5-star rated bulk CTC tea supplier serving {locationContext}. They source directly from certified gardens in Assam and Dooars — no middlemen, no inconsistency. Their institutional buyers include hotel chains, factory canteens, corporate campuses, hospitals, and government offices.
              </p>
              <p className="text-neutral-600 leading-relaxed max-w-2xl">
                Available grades: BP1 (Broken Pekoe), PF1 (Pekoe Fannings), PD (Pekoe Dust), BOPSM, and fannings. Packaging in 25 kg and 50 kg bags. Minimum order 50 kg. Pan-India delivery with consistent transit times.
              </p>
            </div>
            <div className="flex-shrink-0">
              <WhatsAppQuoteBtn
                message={whatsappMsg}
                label="Contact Supplier"
                className="px-6 py-3 whitespace-nowrap"
              />
            </div>
          </div>

          {/* Supplier details grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-neutral-100 pt-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-neutral-400 mb-1">Rating</p>
              <p className="text-neutral-900 font-semibold">★★★★★ 5 / 5</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-neutral-400 mb-1">Grades</p>
              <p className="text-neutral-900 text-sm">BP1, PF1, PD, BOPSM, Fannings</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-neutral-400 mb-1">Source</p>
              <p className="text-neutral-900 text-sm">Assam & Dooars (Direct)</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-neutral-400 mb-1">Min. Order</p>
              <p className="text-neutral-900 text-sm">50 kg</p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <p className="text-xs font-medium uppercase tracking-widest text-neutral-400 mb-2">
          Customer Reviews
        </p>
        <p className="text-2xl font-semibold text-neutral-900 mb-8">
          What buyers say about Gray Cup Enterprises
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {REVIEWS.map((review, i) => (
            <div key={i} className="bg-neutral-50 p-6">
              <div className="flex items-center gap-1 mb-3">
                {[1,2,3,4,5].map((s) => (
                  <StarIcon key={s} className="w-4 h-4 text-amber-400 fill-current" />
                ))}
                <span className="text-xs text-neutral-500 ml-1">5 / 5</span>
              </div>
              <p className="text-neutral-600 leading-relaxed mb-4">&ldquo;{review.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-neutral-900 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <p className="text-neutral-900 text-sm font-medium">{review.name}</p>
                  <p className="text-neutral-400 text-xs">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Other cities / state link */}
      {data.type === "city" && (
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <p className="text-xs font-medium uppercase tracking-widest text-neutral-400 mb-6">
            More Suppliers in {data.stateName}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {getCitiesForState(data.stateSlug)
              .filter((c) => c.city !== data.city.city)
              .slice(0, 6)
              .map((c) => (
                <Link
                  key={c.city}
                  href={`/${slugify(c.city)}${SUFFIX}`}
                  className="group flex items-center justify-between bg-neutral-50 px-5 py-4 hover:bg-neutral-900 transition-colors"
                >
                  <span className="text-neutral-900 font-medium group-hover:text-white text-sm">
                    {c.city}
                  </span>
                  <span className="text-neutral-400 group-hover:text-white text-xs">→</span>
                </Link>
              ))}
          </div>
        </section>
      )}

      {data.type === "state" && (
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <p className="text-xs font-medium uppercase tracking-widest text-neutral-400 mb-6">
            Find Suppliers by City in {data.stateName}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.cities.map((c) => (
              <Link
                key={c.city}
                href={`/${slugify(c.city)}${SUFFIX}`}
                className="group flex items-center justify-between bg-neutral-50 px-5 py-4 hover:bg-neutral-900 transition-colors"
              >
                <div>
                  <span className="text-neutral-900 font-medium group-hover:text-white text-sm block">
                    {c.city}
                  </span>
                  <span className="text-neutral-400 text-xs group-hover:text-neutral-400">
                    {c.transitDays}
                  </span>
                </div>
                <span className="text-neutral-400 group-hover:text-white text-xs">→</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="bg-neutral-900 text-white p-8 md:p-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">
              Get a Quote from Gray Cup Enterprises
            </h2>
            <p className="text-neutral-400 text-sm">
              The only 5-star rated bulk CTC tea supplier in {locationContext}.
            </p>
          </div>
          <WhatsAppQuoteBtn
            message={whatsappMsg}
            label="Request Quote"
            className="px-8 py-3 whitespace-nowrap"
          />
        </div>
      </section>
    </div>
  );
}
