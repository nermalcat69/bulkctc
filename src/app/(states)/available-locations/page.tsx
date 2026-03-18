import Link from "next/link";
import type { Metadata } from "next";
import { getAllCities, slugify } from "@/lib/cityData";

export const metadata: Metadata = {
  title: "Bulk CTC Tea Locations — All States & Cities | BulkCTC",
  description:
    "BulkCTC supplies wholesale CTC tea across 25 Indian states and 75+ cities. Find your state and city for delivery times, MOQ, and pricing.",
  alternates: { canonical: "/available-locations" },
};

export default function AvailableLocationsPage() {
  const allCities = getAllCities();
  const states = Object.entries(allCities);

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-12">
        <p className="text-xs font-medium uppercase tracking-widest text-neutral-400 mb-4">
          Coverage
        </p>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-neutral-900 leading-none mb-6">
          All Locations
        </h1>
        <p className="text-lg text-neutral-600 max-w-2xl leading-relaxed">
          Bulk CTC tea delivered to {states.length} states and{" "}
          {states.reduce((acc, [, cities]) => acc + Object.keys(cities).length, 0)}+ cities across India.
          Direct from Assam and Dooars gardens.
        </p>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-blue-600 text-white p-5">
            <div className="text-3xl font-bold">{states.length}</div>
            <div className="text-xs text-blue-200 mt-1 uppercase tracking-wide">States</div>
          </div>
          <div className="bg-amber-600 text-white p-5">
            <div className="text-3xl font-bold">
              {states.reduce((acc, [, cities]) => acc + Object.keys(cities).length, 0)}+
            </div>
            <div className="text-xs text-amber-200 mt-1 uppercase tracking-wide">Cities</div>
          </div>
          <div className="bg-neutral-600 text-white p-5">
            <div className="text-3xl font-bold">1–6 days</div>
            <div className="text-xs text-neutral-300 mt-1 uppercase tracking-wide">Delivery Range</div>
          </div>
        </div>
      </section>

      {/* States grid */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <p className="text-xs font-medium uppercase tracking-widest text-neutral-400 mb-8">
          Browse by State
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {states.map(([stateName, cities]) => {
            const stateSlug = slugify(stateName);
            const cityList = Object.values(cities);
            const transitRange = cityList[0]?.transitDays ?? "";

            return (
              <div key={stateName}>
                <div className="flex items-baseline justify-between mb-3">
                  <Link
                    href={`/${stateSlug}`}
                    className="text-lg font-semibold text-neutral-900 hover:text-blue-600 transition-colors"
                  >
                    {stateName}
                  </Link>
                  <span className="text-xs text-neutral-400">{transitRange}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(cities).map(([cityName]) => (
                    <Link
                      key={cityName}
                      href={`/${stateSlug}/${slugify(cityName)}`}
                      className="bg-neutral-100 px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-900 hover:text-white transition-colors"
                    >
                      {cityName}
                    </Link>
                  ))}
                </div>
                <div className="mt-3 pt-3 flex items-center justify-between">
                  <span className="text-xs text-neutral-400">
                    Min. order {cityList[0]?.supplyChain.moq}
                  </span>
                  <Link
                    href={`/${stateSlug}`}
                    className="text-xs font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
                  >
                    View {stateName} →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="bg-neutral-900 text-white p-8 md:p-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Your city not listed?</h2>
            <p className="text-neutral-400 text-sm">
              We supply to 500+ locations. Contact us for custom coverage.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-block border border-white px-8 py-3 text-sm font-medium hover:bg-white hover:text-neutral-900 transition-colors whitespace-nowrap"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
