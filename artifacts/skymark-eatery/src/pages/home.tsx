import { Link } from "wouter";
import { ArrowUpRight, MapPin } from "lucide-react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { BUFFET_PACKAGES } from "@/content/catering";
import { HOME_SIGNATURE_GROUPS } from "@/content/menu";
import {
  BUSINESS_INFO,
  CATERING_HELPER_TEXT,
  SITE_IMAGES,
} from "@/content/site";
import { restaurantStructuredData, useSeo } from "@/lib/seo";

const featuredPackages = BUFFET_PACKAGES.slice(0, 3);

const signatureBlocks = HOME_SIGNATURE_GROUPS.slice(0, 3).map((g, i) => ({
  ...g,
  image: [SITE_IMAGES.focaccia, SITE_IMAGES.vealSandwich, SITE_IMAGES.hotTable][
    i
  ],
  imageAlt: [
    "Focaccia and baked goods from the Skymark Eatery counter",
    "Hot sandwich from the lunch line at Skymark Eatery",
    "Hot table and lunch service at Skymark Eatery",
  ][i],
}));

export default function Home() {
  useSeo({
    title:
      "Skymark Eatery by Caffe E Pranzo | Italian Takeout & Catering — Mississauga (Skymark Ave)",
    description:
      "Skymark Eatery by Caffe E Pranzo: weekday Italian breakfast and lunch, takeout, and office catering on Skymark Ave, Mississauga — near Pearson Airport. Order pickup, browse the menu, or plan trays and buffets.",
    path: "/",
    image: SITE_IMAGES.og,
    imageAlt: SITE_IMAGES.ogImageAlt,
    structuredData: restaurantStructuredData(),
  });

  return (
    <Layout>
      <section className="grain-hero relative overflow-hidden border-b border-[rgba(26,18,14,0.12)] bg-[#0f0c0a] text-[#f4ebe3]">
        <div className="absolute inset-0">
          <img
            src={SITE_IMAGES.hero}
            alt="Pasta and Italian lunch favourites from Skymark Eatery by Caffe E Pranzo"
            className="h-full min-h-[420px] w-full scale-[1.03] object-cover opacity-[0.42] sm:min-h-[480px]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(8,6,5,0.96)_0%,rgba(18,12,10,0.82)_42%,rgba(18,12,10,0.35)_100%)]" />
        </div>

        <div className="relative container mx-auto max-w-6xl px-4 pb-16 pt-14 sm:pb-20 sm:pt-16 lg:grid lg:min-h-[min(78vh,680px)] lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pb-24 lg:pt-20">
          <div className="max-w-xl lg:py-6">
            <p className="font-sans text-[0.58rem] font-semibold uppercase tracking-[0.34em] text-[#e2b69a]">
              Italian eatery · Mississauga
            </p>
            <h1 className="mt-5 font-serif text-[2.35rem] leading-[0.98] tracking-tight sm:text-5xl lg:text-[3.15rem]">
              <span className="block">{BUSINESS_INFO.secondaryName}</span>
              <span className="mt-2 block font-sans text-[0.95rem] font-medium uppercase tracking-[0.28em] text-[#d4c0b2] sm:text-base">
                by Caffe E Pranzo
              </span>
            </h1>
            <p className="mt-6 max-w-md font-sans text-[0.98rem] leading-relaxed text-[#d2c2b6] sm:text-[1.05rem]">
              Weekday breakfast through lunch: takeout from our kitchen on
              Skymark Ave, with trays and buffets for offices and gatherings
              across west Mississauga — including teams near Pearson who need
              pickup that lands on time.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                className="h-11 rounded-md bg-[#b85c40] px-7 font-sans text-[0.9rem] font-semibold text-white shadow-none hover:bg-[#9e4e36]"
                asChild
              >
                <Link href="/menu">Order pickup</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-11 rounded-md border-white/25 bg-transparent px-6 font-sans text-[#f4ebe3] hover:bg-white/10"
                asChild
              >
                <Link href="/catering">Catering</Link>
              </Button>
              <Link
                href="/contact"
                className="px-2 font-sans text-sm font-semibold text-[#e8d5c8] underline decoration-white/25 underline-offset-4 hover:text-white"
              >
                Visit &amp; hours
              </Link>
            </div>

            <p className="mt-10 max-w-lg border-t border-white/15 pt-6 font-sans text-[12px] leading-relaxed text-[#cbb6a8] sm:text-[13px]">
              <a
                href={BUSINESS_INFO.phoneHref}
                className="font-semibold text-white hover:text-[#f1cdb8]"
              >
                {BUSINESS_INFO.phone}
              </a>
              <span className="mx-2 text-white/35">·</span>
              <span>{BUSINESS_INFO.hoursLabel}</span>
              <span className="mx-2 text-white/35">·</span>
              <span>{BUSINESS_INFO.addressLine1}</span>
            </p>
          </div>

          <div className="relative mt-14 lg:mt-0">
            <figure className="relative overflow-hidden border border-white/12 shadow-[0_24px_70px_rgba(0,0,0,0.45)]">
              <img
                src={SITE_IMAGES.greekSaladTray}
                alt="Catering salad and tray spread prepared at Skymark Eatery by Caffe E Pranzo"
                className="aspect-[4/3] w-full object-cover sm:aspect-[5/4] lg:aspect-auto lg:min-h-[min(400px,50vh)]"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/92 via-black/45 to-transparent px-5 py-5 sm:px-6 sm:py-6">
                <p className="font-serif text-lg text-white sm:text-xl">
                  One kitchen for lunch and catering
                </p>
                <p className="mt-1 max-w-sm font-sans text-xs leading-relaxed text-white/78">
                  Trays and buffets are planned with the same crew that runs the
                  weekday line — so portions, timing, and pickup stay honest.
                </p>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="border-b border-[rgba(26,18,14,0.07)] py-16 sm:py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center">
            <div>
              <p className="section-kicker">From the line</p>
              <h2 className="mt-3 max-w-md font-serif text-[2.1rem] leading-[1.05] tracking-tight text-[#1f1410] sm:text-4xl">
                Built for Mississauga lunch rhythms.
              </h2>
              <p className="mt-5 max-w-md font-sans text-sm leading-relaxed text-[#5c4d42] sm:text-base">
                Pastries and breakfast early, sandwiches and pasta through the
                afternoon — organized so pickup stays quick for Skymark offices
                and nearby Airport Corporate Centre teams.
              </p>
            </div>
            <div className="overflow-hidden border border-[rgba(26,18,14,0.1)]">
              <img
                src={SITE_IMAGES.vealSandwich}
                alt="Hot sandwich from the lunch line at Skymark Eatery"
                className="aspect-[16/10] w-full object-cover sm:aspect-[2/1]"
              />
            </div>
          </div>

          <div className="mt-14 divide-y divide-[rgba(26,18,14,0.1)] border-t border-[rgba(26,18,14,0.1)]">
            {signatureBlocks.map((block) => (
              <article
                key={block.title}
                className="grid gap-6 py-8 sm:grid-cols-[140px_minmax(0,1fr)] sm:items-center sm:gap-8 sm:py-10"
              >
                <div className="aspect-[4/3] overflow-hidden border border-[rgba(26,18,14,0.08)] sm:aspect-square">
                  <img
                    src={block.image}
                    alt={block.imageAlt}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-serif text-2xl text-[#1f1410]">
                    {block.title}
                  </h3>
                  <p className="mt-2 max-w-xl font-sans text-sm leading-relaxed text-[#5c4d42] sm:text-[0.95rem]">
                    {block.description}
                  </p>
                  <a
                    href={`/menu#${block.sectionId}`}
                    className="mt-4 inline-flex items-center font-sans text-sm font-semibold text-[#8b3d2c] hover:text-[#6b2e20]"
                  >
                    On the menu
                    <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="editorial-dark border-b border-black/30 py-16 sm:py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="max-w-2xl">
            <p className="font-sans text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-[#d4a990]">
              Catering
            </p>
            <h2 className="mt-3 font-serif text-[2rem] leading-tight tracking-tight sm:text-[2.35rem]">
              Buffets and trays when the guest list is real.
            </h2>
            <p className="mt-4 font-sans text-sm leading-relaxed text-[#d0c0b4] sm:text-[0.98rem]">
              {CATERING_HELPER_TEXT}
            </p>
            <p className="mt-4 max-w-xl font-sans text-xs leading-relaxed text-[#b5a090] sm:text-sm">
              Perfect for office lunches, meetings near Pearson, and family
              gatherings in Mississauga. Not sure which package fits? Tell us
              the headcount — we&apos;ll help you land the right spread.
            </p>
          </div>

          <ul className="mt-12 max-w-3xl space-y-5 border-l border-white/15 pl-5 sm:pl-6">
            {featuredPackages.map((pkg) => (
              <li
                key={pkg.publicName}
                className="font-sans text-sm leading-relaxed text-[#e8ddd4]"
              >
                <span className="font-serif text-lg text-white">
                  {pkg.publicName}
                </span>
                <span className="mx-2 text-white/35">—</span>
                <span className="text-[#f0d8cc]">{pkg.pricePerPerson}</span>
                <span className="mx-2 text-white/35">·</span>
                <span className="text-[#c9b8ab]">{pkg.minimumOrder}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button
              className="h-10 rounded-md bg-[#b85c40] px-6 font-sans text-sm text-white hover:bg-[#9e4e36]"
              asChild
            >
              <Link href="/catering">Browse catering</Link>
            </Button>
            <Button
              variant="outline"
              className="h-10 rounded-md border-white/22 bg-transparent font-sans text-sm text-[#f4ebe3] hover:bg-white/10"
              asChild
            >
              <Link href="/catering#inquire">Request a quote</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-b border-[rgba(26,18,14,0.07)] py-14 sm:py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="section-kicker">Visit</p>
              <h2 className="mt-2 font-serif text-3xl tracking-tight text-[#1f1410] sm:text-4xl">
                {BUSINESS_INFO.addressLine1}
              </h2>
              <p className="mt-3 max-w-lg font-sans text-sm leading-relaxed text-[#5c4d42]">
                {BUSINESS_INFO.addressLine2}. Pickup for Skymark Ave tenants,
                nearby offices, and events across west Mississauga — convenient
                when you are coming from Pearson or hosting in the Airport
                Corporate Centre area.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 font-sans text-sm text-[#3d3028]">
                <a
                  href={BUSINESS_INFO.mapsHref}
                  className="inline-flex items-center gap-2 font-semibold text-[#8b3d2c] hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  <MapPin className="h-4 w-4" />
                  Open in Maps
                </a>
                <span className="text-[#c4b5a8]">|</span>
                <a
                  href={BUSINESS_INFO.phoneHref}
                  className="font-semibold text-[#1f1410] hover:text-[#8b3d2c]"
                >
                  {BUSINESS_INFO.phone}
                </a>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row lg:flex-col lg:items-end">
              <Button
                className="h-10 rounded-md bg-[#1f1410] font-sans text-sm text-white hover:bg-black"
                asChild
              >
                <Link href="/contact">Contact</Link>
              </Button>
              <Button
                variant="outline"
                className="h-10 rounded-md border-[rgba(26,18,14,0.14)] bg-transparent font-sans text-sm"
                asChild
              >
                <Link href="/menu">View menu</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#1a120e] py-12 text-center text-[#f2e8dc] sm:py-14">
        <div className="container mx-auto max-w-2xl px-4">
          <p className="font-sans text-[0.58rem] font-semibold uppercase tracking-[0.3em] text-[#c49a7e]">
            Ready when you are
          </p>
          <h2 className="mt-3 font-serif text-3xl tracking-tight sm:text-4xl">
            Pickup today, or a catering plan for the room.
          </h2>
          <div className="mt-8 flex flex-col justify-center gap-2.5 sm:flex-row sm:gap-3">
            <Button
              className="h-10 rounded-md bg-[#b85c40] px-8 font-sans text-sm text-white hover:bg-[#9e4e36]"
              asChild
            >
              <Link href="/menu">Order pickup</Link>
            </Button>
            <Button
              variant="outline"
              className="h-10 rounded-md border-white/22 bg-transparent font-sans text-sm text-[#f2e8dc] hover:bg-white/10"
              asChild
            >
              <Link href="/catering#inquire">Catering inquiry</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
