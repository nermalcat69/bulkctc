import { notFound } from "next/navigation";
import Link from "next/link";
import { getCitiesForState, getStateNameFromSlug, slugify } from "@/lib/cityData";
import { WhatsAppQuoteBtn } from "@/components/whatsapp-quote-btn";

const stateContextMap: Record<string, string> = {
  Maharashtra: "India's largest commercial economy with dense HORECA and manufacturing sectors.",
  "Tamil Nadu": "South India's industrial powerhouse with strong manufacturing and corporate demand.",
  "Uttar Pradesh": "India's most populous state and highest tea-consuming market outside Bengal.",
  Karnataka: "Technology hub of India with large corporate campuses and a vibrant hospitality sector.",
  Gujarat: "Textiles, pharmaceuticals, and FMCG economy driving consistent institutional bulk demand.",
  "West Bengal": "Closest to Assam gardens — India's deepest chai culture with maximum volume.",
  Rajasthan: "Tourism and government sectors drive bulk CTC demand across desert cities.",
  Telangana: "Fast-growing pharma and IT economy creating new-age institutional bulk tea buyers.",
  "Andhra Pradesh": "Coastal industrial economy with ports, steel, and agriculture driving bulk demand.",
  "Madhya Pradesh": "Central India's distribution hub for bulk CTC tea to heartland industries.",
  Kerala: "Ports, IT, and a strong tea culture create unique bulk demand in God's Own Country.",
  "Delhi (NCT)": "India's capital — highest concentration of government and corporate bulk buyers.",
  Haryana: "NCR industrial corridor with auto, pharma, and Fortune 500 corporate campuses.",
  Bihar: "One of India's highest per-capita chai-consuming states with growing institutional demand.",
  Punjab: "Agricultural prosperity, pilgrimage tourism, and manufacturing drive bulk CTC demand.",
  Odisha: "Steel, mining, and coastal industrial economy with strong institutional canteen demand.",
  Assam: "Source of India's finest CTC tea — buy direct from the garden state.",
  Jharkhand: "Mining and steel economy with massive daily institutional canteen consumption.",
  Chhattisgarh: "Steel cities and coal economy creating high-volume bulk CTC requirements.",
  Uttarakhand: "Tourism, pharma, and elite academic institutions driving quality bulk CTC demand.",
  "Himachal Pradesh": "Asia's pharma hub and hill tourism create distinct bulk CTC buying patterns.",
  Goa: "Premium hospitality and tourism driving seasonal bulk CTC procurement.",
  "Jammu & Kashmir": "Military, government, and tourism sectors driving bulk demand in the Himalayan state.",
  Tripura: "NE tea growing state with garden-fresh local CTC and growing institutional demand.",
  Meghalaya: "Institutional buyers in India's wettest state sourcing quality Assam CTC tea.",
};

export function StatePageContent({ stateSlug }: { stateSlug: string }) {
  const stateName = getStateNameFromSlug(stateSlug);
  if (!stateName) notFound();

  const cities = getCitiesForState(stateSlug);
  if (!cities.length) notFound();

  const stateContext = stateContextMap[stateName] ?? "";
  const allIndustries = [...new Set(cities.flatMap((c) => c.industries))];
  const transitRange = cities[0]?.transitDays ?? "2-5 days";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://bulkctc.com" },
      { "@type": "ListItem", position: 2, name: stateName, item: `https://bulkctc.com/${stateSlug}` },
    ],
  };

  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-6xl mx-auto px-6 pt-8">
        <nav className="flex items-center gap-2 text-xs text-neutral-400">
          <Link href="/" className="hover:text-neutral-900 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/available-locations" className="hover:text-neutral-900 transition-colors">Locations</Link>
          <span>/</span>
          <span className="text-neutral-600">{stateName}</span>
        </nav>
      </div>

      <section className="max-w-6xl mx-auto px-6 pt-12 pb-16">
        <div className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-widest text-neutral-400 mb-4">
            Bulk CTC Tea Supply
          </p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-neutral-900 leading-none mb-6">
            {stateName}
          </h1>
          <p className="text-lg text-neutral-600 leading-relaxed max-w-2xl mb-8">
            {stateContext} Wholesale bulk CTC tea for hotels, factories, corporate offices, and institutions across {stateName}.
          </p>
          <div className="flex flex-wrap gap-3">
            <WhatsAppQuoteBtn
              message={`Hi, I found your number on BulkCTC. I am from ${stateName} and I would like to enquire about bulk CTC tea supply.`}
              className="px-6 py-2.5"
            />
            <Link
              href="/available-locations"
              className="inline-block border border-neutral-300 px-6 py-2.5 text-sm font-medium text-neutral-600 hover:border-neutral-600 transition-colors"
            >
              All Locations
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-blue-600 text-white p-5">
            <div className="text-2xl font-bold">{transitRange}</div>
            <div className="text-xs text-blue-200 mt-1 uppercase tracking-wide">Delivery Time</div>
          </div>
          <div className="bg-amber-600 text-white p-5">
            <div className="text-2xl font-bold">{cities.length} Cities</div>
            <div className="text-xs text-amber-200 mt-1 uppercase tracking-wide">Coverage</div>
          </div>
          <div className="bg-neutral-600 text-white p-5">
            <div className="text-2xl font-bold">{cities[0]?.supplyChain.moq}</div>
            <div className="text-xs text-neutral-300 mt-1 uppercase tracking-wide">Min. Order Qty</div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
            Bulk CTC Tea in {stateName}
          </h2>
          <p className="text-neutral-600 leading-relaxed mb-4">
            BulkCTC serves {cities.length} cities across {stateName}, supplying wholesale CTC tea to hotels, factories, corporate offices, government canteens, and educational institutions. All orders ship directly from certified Assam and Dooars gardens — no middlemen, no grade inconsistency batch to batch.
          </p>
          <p className="text-neutral-600 leading-relaxed mb-4">
            CTC grades available across {stateName} include BP1 (Broken Pekoe), PF1 (Pekoe Fannings), PD (Pekoe Dust), BOPSM, and fannings varieties. Each grade is suited to a different brewing style and output volume — BP1 and PF1 for hotels and corporate kitchens, PD and dust grades for high-volume factory canteens. All grades are packed in {cities[0]?.supplyChain.packagingSizes.join(" kg, ")} kg bags.
          </p>
          <p className="text-neutral-600 leading-relaxed">
            Delivery across {stateName} takes {transitRange} depending on your city. The minimum order is {cities[0]?.supplyChain.moq}. Repeat buyers can set up scheduled dispatches — same grade, same price, recurring supply without placing fresh orders each time.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-16">
        <p className="text-xs font-medium uppercase tracking-widest text-neutral-400 mb-6">
          Cities We Serve in {stateName}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cities.map((cityData) => (
            <Link
              key={cityData.city}
              href={`/${stateSlug}/${slugify(cityData.city)}`}
              className="group block bg-neutral-50 p-6 hover:bg-neutral-900 transition-colors"
            >
              <div className="text-xl font-semibold text-neutral-900 group-hover:text-white mb-2">
                {cityData.city}
              </div>
              <div className="text-sm text-neutral-500 group-hover:text-neutral-300 mb-4 leading-relaxed">
                {cityData.cityContext.slice(0, 80)}…
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400 group-hover:text-neutral-400">
                  {cityData.transitDays}
                </span>
                <span className="text-xs font-medium text-neutral-900 group-hover:text-white">
                  View →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-16">
        <p className="text-xs font-medium uppercase tracking-widest text-neutral-400 mb-4">
          Industries Served in {stateName}
        </p>
        <p className="text-neutral-600 leading-relaxed mb-5 max-w-2xl">
          Across {stateName}, BulkCTC supplies the {allIndustries.slice(0, 4).join(", ")}{allIndustries.length > 4 ? ", and more" : ""} sectors. Each industry has different volume requirements and grade preferences — we supply all of them from the same direct-garden source.
        </p>
        <div className="flex flex-wrap gap-2">
          {allIndustries.map((industry) => (
            <span key={industry} className="bg-neutral-100 px-3 py-1.5 text-sm text-neutral-700">
              {industry}
            </span>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="bg-neutral-50 p-8 md:grid md:grid-cols-2 gap-12">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-neutral-400 mb-3">
              Supply Chain
            </p>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-3">
              Direct from Assam & Dooars Gardens
            </h2>
            <p className="text-neutral-600 leading-relaxed">
              All CTC tea is sourced directly from certified gardens in Assam and Dooars. We supply BP1, PF1, PD, BOPSM, and fannings grades, packed in 25 kg and 50 kg bags.
            </p>
          </div>
          <div className="mt-8 md:mt-0">
            <p className="text-xs font-medium uppercase tracking-widest text-neutral-400 mb-3">
              Packaging Options
            </p>
            <div className="flex flex-wrap gap-2">
              {cities[0]?.supplyChain.packagingSizes.map((size) => (
                <span key={size} className="bg-white px-4 py-2 text-sm font-medium text-neutral-900">
                  {size} bags
                </span>
              ))}
            </div>
            <p className="mt-4 text-xs font-medium uppercase tracking-widest text-neutral-400 mb-3">
              Tea Garden Source
            </p>
            <p className="text-neutral-600 text-sm">{cities[0]?.supplyChain.source}</p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="bg-neutral-900 text-white p-8 md:p-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">
              Start Bulk CTC Supply in {stateName}
            </h2>
            <p className="text-neutral-400 text-sm">
              Get pricing, grades, and delivery schedule for your location.
            </p>
          </div>
          <WhatsAppQuoteBtn
            message={`Hi, I found your number on BulkCTC. I am from ${stateName} and I would like to enquire about bulk CTC tea supply.`}
            label="Request Quote"
            className="px-8 py-3 whitespace-nowrap"
          />
        </div>
      </section>
    </div>
  );
}
