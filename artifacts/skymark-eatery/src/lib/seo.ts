import { useEffect } from "react";
import { BUSINESS_INFO, SITE_IMAGES } from "@/content/site";

type SeoProps = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  /** Describes the Open Graph / Twitter preview image (accessibility + richer sharing). */
  imageAlt?: string;
  robots?: string;
  type?: "website" | "article";
  structuredData?: Record<string, unknown> | Array<Record<string, unknown>>;
};

function upsertMeta(
  selector: string,
  attributes: Record<string, string>,
  content: string,
) {
  let tag = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement("meta");
    Object.entries(attributes).forEach(([key, value]) =>
      tag?.setAttribute(key, value),
    );
    document.head.appendChild(tag);
  }
  tag.content = content;
}

function upsertLink(selector: string, rel: string, href: string) {
  let tag = document.head.querySelector(selector) as HTMLLinkElement | null;
  if (!tag) {
    tag = document.createElement("link");
    tag.rel = rel;
    document.head.appendChild(tag);
  }
  tag.href = href;
}

function absoluteUrl(path: string) {
  const origin = BUSINESS_INFO.siteUrl.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${normalizedPath}`;
}

export function restaurantStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": absoluteUrl("/#restaurant"),
    name: BUSINESS_INFO.primaryName,
    alternateName: BUSINESS_INFO.secondaryName,
    description: BUSINESS_INFO.tagline,
    image: absoluteUrl(SITE_IMAGES.og),
    telephone: "+1-905-206-5550",
    email: BUSINESS_INFO.email,
    url: absoluteUrl("/"),
    menu: absoluteUrl("/menu"),
    hasMap: BUSINESS_INFO.mapsHref,
    servesCuisine: "Italian",
    priceRange: "$$",
    areaServed: BUSINESS_INFO.city,
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS_INFO.addressLine1,
      addressLocality: BUSINESS_INFO.city,
      addressRegion: BUSINESS_INFO.region,
      postalCode: BUSINESS_INFO.postalCode,
      addressCountry: BUSINESS_INFO.country,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "07:30",
        closes: "16:30",
      },
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-905-206-5550",
      email: BUSINESS_INFO.email,
      contactType: "customer service",
      areaServed: "CA",
    },
    sameAs: [BUSINESS_INFO.instagramHref],
  };
}

export function breadcrumbStructuredData(
  crumbs: Array<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      item: absoluteUrl(entry.path),
    })),
  };
}

export function useSeo({
  title,
  description,
  path = "/",
  image = SITE_IMAGES.og,
  imageAlt,
  robots = "index, follow",
  type = "website",
  structuredData,
}: SeoProps) {
  useEffect(() => {
    const canonicalUrl = absoluteUrl(path);
    const imageUrl = absoluteUrl(image);

    document.title = title;

    upsertMeta(
      'meta[name="description"]',
      { name: "description" },
      description,
    );
    upsertMeta('meta[name="robots"]', { name: "robots" }, robots);
    upsertMeta('meta[name="theme-color"]', { name: "theme-color" }, "#2d1e18");
    upsertMeta('meta[property="og:title"]', { property: "og:title" }, title);
    upsertMeta(
      'meta[property="og:description"]',
      { property: "og:description" },
      description,
    );
    upsertMeta('meta[property="og:type"]', { property: "og:type" }, type);
    upsertMeta('meta[property="og:url"]', { property: "og:url" }, canonicalUrl);
    upsertMeta('meta[property="og:image"]', { property: "og:image" }, imageUrl);
    upsertMeta(
      'meta[property="og:locale"]',
      { property: "og:locale" },
      "en_CA",
    );
    upsertMeta(
      'meta[property="og:site_name"]',
      { property: "og:site_name" },
      BUSINESS_INFO.primaryName,
    );
    upsertMeta(
      'meta[name="twitter:card"]',
      { name: "twitter:card" },
      "summary_large_image",
    );
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title" }, title);
    upsertMeta(
      'meta[name="twitter:description"]',
      { name: "twitter:description" },
      description,
    );
    upsertMeta(
      'meta[name="twitter:image"]',
      { name: "twitter:image" },
      imageUrl,
    );
    if (imageAlt) {
      upsertMeta(
        'meta[property="og:image:alt"]',
        { property: "og:image:alt" },
        imageAlt,
      );
      upsertMeta(
        'meta[name="twitter:image:alt"]',
        { name: "twitter:image:alt" },
        imageAlt,
      );
    } else {
      document.head
        .querySelectorAll(
          'meta[property="og:image:alt"], meta[name="twitter:image:alt"]',
        )
        .forEach((node) => node.remove());
    }
    upsertLink('link[rel="canonical"]', "canonical", canonicalUrl);

    document.head
      .querySelectorAll('script[data-seo-structured-data="true"]')
      .forEach((script) => script.remove());

    const entries = structuredData
      ? Array.isArray(structuredData)
        ? structuredData
        : [structuredData]
      : [];

    entries.forEach((entry) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.seoStructuredData = "true";
      script.text = JSON.stringify(entry);
      document.head.appendChild(script);
    });

    return () => {
      document.head
        .querySelectorAll('script[data-seo-structured-data="true"]')
        .forEach((script) => script.remove());
    };
  }, [description, image, imageAlt, path, robots, structuredData, title, type]);
}
