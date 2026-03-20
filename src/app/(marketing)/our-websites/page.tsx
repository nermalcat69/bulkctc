import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Our Websites – Wholesale & Bulk Chai, CTC Tea | Gray Cup",
  description:
    "Explore all Gray Cup websites for wholesale chai, bulk CTC tea, B2B chai supply, and pure tea. Find us at graycup.org, graycup.in, b2b.graycup.in, bulkchai.com, and purecha.in.",
};

const sites = [
  {
    domain: "graycup.org",
    href: "https://graycup.org/",
    label: "Gray Cup – Official Brand",
    description:
      "The official home of Gray Cup Enterprises. Learn about our mission to make quality chai accessible across India — from garden to cup. Everything about who we are and what we stand for.",
    keywords: [
      { text: "Gray Cup Enterprises", href: "https://graycup.org/" },
      { text: "chai brand India", href: "https://graycup.org/" },
    ],
    tags: ["Brand", "Company"],
  },
  {
    domain: "graycup.in",
    href: "https://graycup.in/",
    label: "graycup.in – Online Chai Store for Consumers",
    description:
      "Buy chai online for home delivery across India. Our consumer storefront stocks premium Assam CTC tea, Dooars blends, and curated chai packs for everyday drinkers.",
    keywords: [
      { text: "buy chai online", href: "https://graycup.in/" },
      { text: "premium CTC tea India", href: "https://graycup.in/" },
      { text: "order tea online India", href: "https://graycup.in/" },
    ],
    tags: ["Retail", "India Only"],
  },
  {
    domain: "b2b.graycup.in",
    href: "https://b2b.graycup.in/",
    label: "b2b.graycup.in – Wholesale Chai for Businesses",
    description:
      "Our dedicated B2B platform for bulk wholesale chai orders. Hotels, factories, offices, and FMCG companies use this portal to source wholesale CTC tea and place recurring bulk orders directly.",
    keywords: [
      { text: "wholesale chai supplier", href: "https://b2b.graycup.in/" },
      { text: "bulk chai for businesses", href: "https://b2b.graycup.in/" },
      { text: "B2B tea ordering India", href: "https://b2b.graycup.in/" },
      { text: "institutional bulk CTC tea", href: "https://b2b.graycup.in/" },
    ],
    tags: ["B2B", "Worldwide"],
  },
  {
    domain: "bulkchai.com",
    href: "https://bulkchai.com/",
    label: "bulkchai.com – Bulk Chai in Large Quantities",
    description:
      "Looking to order chai in bulk? bulkchai.com is built for buyers who need large-volume tea supply — minimum orders starting at 50 kg. Fast delivery of bulk chai to 75+ cities across India.",
    keywords: [
      { text: "bulk chai", href: "https://bulkchai.com/" },
      { text: "order chai in bulk", href: "https://bulkchai.com/" },
      { text: "large quantity tea supply", href: "https://bulkchai.com/" },
      { text: "bulk tea delivery India", href: "https://bulkchai.com/" },
    ],
    tags: ["Bulk Orders", "50 kg+"],
  },
  {
    domain: "purecha.in",
    href: "https://purecha.in/",
    label: "purecha.in – Pure CTC Tea, No Additives",
    description:
      "Pure CTC tea sourced directly from Assam and Dooars gardens with no blending, no fillers, and no artificial colour. purecha.in is for buyers who want unadulterated, natural CTC tea at wholesale prices.",
    keywords: [
      { text: "pure CTC tea", href: "https://purecha.in/" },
      { text: "natural CTC tea India", href: "https://purecha.in/" },
      { text: "unadulterated chai wholesale", href: "https://purecha.in/" },
      { text: "pure chai India", href: "https://purecha.in/" },
    ],
    tags: ["Pure", "No Additives"],
  },
];

export default function OurWebsitesPage() {
  return (
    <div className="min-h-screen py-20 px-4 lg:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-14">
          <h1 className="text-3xl md:text-4xl font-semibold text-black mb-3">
            Our Websites
          </h1>
          <p className="text-md md:text-lg text-muted-foreground max-w-2xl">
            Gray Cup Enterprises operates multiple websites to serve different
            buyers — from consumers buying chai at home to factories sourcing{" "}
            <a
              href="https://bulkchai.com/"
              target="_blank"
              rel="noopener"
              className="link"
            >
              bulk chai
            </a>{" "}
            at scale. Find the right destination below.
          </p>
        </div>

        {/* Sites list */}
        <div className="flex flex-col gap-8">
          {sites.map((site) => (
            <div
              key={site.domain}
              className="border border-neutral-200 rounded-2xl p-6 hover:border-neutral-400 transition-colors"
            >
              {/* Top row */}
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <a
                  href={site.href}
                  target="_blank"
                  rel="noopener"
                  className="text-lg font-semibold text-neutral-900 hover:underline"
                >
                  {site.domain}
                </a>
                <div className="flex gap-1.5">
                  {site.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Label */}
              <p className="text-sm font-medium text-neutral-500 mb-3">
                {site.label}
              </p>

              {/* Description */}
              <p className="text-sm text-neutral-700 leading-relaxed mb-4">
                {site.description}
              </p>

              {/* Keyword links */}
              <div className="flex flex-wrap gap-2">
                {site.keywords.map((kw) => (
                  <a
                    key={kw.text}
                    href={kw.href}
                    target="_blank"
                    rel="noopener"
                    className="text-xs border border-neutral-200 text-neutral-600 px-3 py-1 rounded-full hover:border-neutral-400 hover:text-neutral-900 transition-colors"
                  >
                    {kw.text} ↗
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="mt-14 pt-8 border-t border-neutral-200">
          <p className="text-sm text-neutral-500">
            All websites are operated by{" "}
            <a
              href="https://graycup.org/"
              target="_blank"
              rel="noopener"
              className="link"
            >
              Gray Cup Enterprises Private Limited
            </a>
            . For{" "}
            <a
              href="https://b2b.graycup.in/"
              target="_blank"
              rel="noopener"
              className="link"
            >
              wholesale chai inquiries
            </a>{" "}
            or{" "}
            <a
              href="https://bulkchai.com/"
              target="_blank"
              rel="noopener"
              className="link"
            >
              bulk CTC tea orders
            </a>
            , you can also reach us directly via our{" "}
            <Link href="/contact" className="link">
              contact page
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
