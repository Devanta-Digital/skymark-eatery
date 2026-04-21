import { Link } from "wouter";
import { ArrowUpRight, Clock, MapPin, Phone } from "lucide-react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { BUFFET_PACKAGES } from "@/content/catering";
import { HOME_SIGNATURE_GROUPS } from "@/content/menu";
import {
  BUSINESS_INFO,
  CATERING_HELPER_TEXT,
  HOME_TRUST_MARKERS,
  SITE_IMAGES,
} from "@/content/site";
import { restaurantStructuredData, useSeo } from "@/lib/seo";

const featuredPackages = BUFFET_PACKAGES.slice(0, 3);

const signatureBlocks = HOME_SIGNATURE_GROUPS.slice(0, 3).map((g, i) => ({
  ...g,
  image: [SITE_IMAGES.focaccia, SITE_IMAGES.caesar, SITE_IMAGES.menuHero][i],
}));

export default function Home() {
  useSeo({
    title:
      "Skymark Eatery by Caffe E Pranzo | Italian Takeout & Catering — Mississauga (Skymark Ave)",
    description:
      "Skymark Eatery by Caffe E Pranzo: weekday Italian breakfast & lunch, takeout, and office catering on Skymark Avenue, Mississauga. Order pickup, browse the menu, or plan trays and buffets.",
    path: "/",
    image: SITE_IMAGES.og,
    imageAlt: SITE_IMAGES.ogImageAlt,
    structuredData: restaurantStructuredData(),
  });

  return (
    <Layout>
      <section className="relative overflow-hidden border-b border-[rgba(36,24,18,0.12)] bg-[#16100d] text-[#f6efe6]">
        <div className="absolute inset-0">
          <img
            src={SITE_IMAGES.hero}
            alt="House-made pasta and lunch plates at Skymark Eatery"
            className="h-full w-full object-cover opacity-[0.42]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(18,12,9,0.97)_0%,rgba(28,18,14,0.82)_42%,rgba(28,18,14,0.35)_100%)]" />
        </div>

        <div className="relative container mx-auto px-4 py-16 sm:py-20 lg:grid lg:min-h-[min(88vh,760px)] lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch lg:py-0">
          <div className="flex max-w-xl flex-col justify-center py-4 lg:py-20">
            <p className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.38em] text-[#e8c4a8]">
              Mississauga · Italian kitchen
            </p>
            <h1 className="mt-5 font-serif text-[2.35rem] leading-[1.02] tracking-tight sm:text-5xl lg:text-[3.15rem]">
              {BUSINESS_INFO.secondaryName}
              <span className="mt-2 block font-sans text-lg font-normal tracking-normal text-[#d7c4b6] sm:text-xl">
                by Caffe E Pranzo
              </span>
            </h1>
            <p className="mt-6 max-w-md font-sans text-base leading-relaxed text-[#c9b5a6] sm:text-[1.05rem]">
              Breakfast, hot lunch, and catering for offices on Skymark Avenue
              and across west Mississauga — pickup that respects a real workday
              clock.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Button
                size="lg"
                className="rounded-md bg-[#b55a3c] px-8 font-sans text-[0.95rem] font-semibold tracking-wide text-white shadow-[0_14px_36px_rgba(0,0,0,0.35)] hover:bg-[#9c4f38]"
                asChild
              >
                <Link href="/menu">Order pickup</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-md border-[rgba(244,230,216,0.22)] bg-transparent px-7 font-sans text-[#f6efe6] hover:bg-white/8"
                asChild
              >
                <Link href="/catering">Catering &amp; buffets</Link>
              </Button>
            </div>
            <div className="mt-10 grid gap-4 border-t border-white/10 pt-8 font-sans text-sm sm:grid-cols-3">
              {HOME_TRUST_MARKERS.map((m) => (
                <div key={m.label}>
                  <div className="text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-[#c49a7e]">
                    {m.label}
                  </div>
                  <p className="mt-1.5 leading-snug text-[#e8ddd4]">{m.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mt-10 hidden min-h-[280px] lg:mt-0 lg:block">
            <div className="absolute bottom-8 left-8 right-8 top-[18%] overflow-hidden rounded-md border border-white/10 shadow-2xl">
              <img
                src={SITE_IMAGES.greekSaladTray}
                alt="Catering salad tray prepared at Skymark Eatery"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-6 py-5">
                <p className="font-serif text-xl text-white">Catering trays</p>
                <p className="mt-1 font-sans text-xs leading-relaxed text-white/75">
                  Buffets and trays for meetings — same kitchen as the lunch
                  counter.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[rgba(36,24,18,0.08)] bg-[#ede4d9] py-4">
        <div className="container mx-auto flex flex-col gap-3 px-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <p className="font-sans text-sm text-[#4a3d35]">
            <span className="font-semibold text-[#2a1f19]">Call to order</span>
            <span className="mx-2 text-[#a09084]">·</span>
            {BUSINESS_INFO.phone}
            <span className="mx-2 text-[#a09084]">·</span>
            {BUSINESS_INFO.hoursLabel}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              className="rounded-md border-[rgba(36,24,18,0.14)] bg-[#fcf9f4] font-sans text-[#2a1f19] hover:bg-white"
              asChild
            >
              <Link href="/contact">
                Visit &amp; directions
                <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
            <Button
              size="sm"
              className="rounded-md bg-[#2a1f19] font-sans text-white hover:bg-black"
              asChild
            >
              <Link href="/menu">Full menu</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-b border-[rgba(36,24,18,0.06)] py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <p className="section-kicker">On the menu</p>
            <h2 className="mt-3 font-serif text-3xl tracking-tight text-[#1c120e] sm:text-4xl">
              Three reasons guests come back midweek.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-12">
            <article className="menu-paper relative overflow-hidden lg:col-span-7">
              <div className="grid md:grid-cols-[1.15fr_0.85fr]">
                <div className="p-7 sm:p-9">
                  <h3 className="font-serif text-2xl text-[#1c120e]">
                    {signatureBlocks[0].title}
                  </h3>
                  <p className="mt-3 font-sans text-sm leading-relaxed text-[#5c4d42]">
                    {signatureBlocks[0].description}
                  </p>
                  <ul className="mt-6 space-y-2 border-t border-[rgba(36,24,18,0.08)] pt-6 font-sans text-sm text-[#3d3028]">
                    {signatureBlocks[0].samples.slice(0, 4).map((s) => (
                      <li key={s} className="flex items-center gap-2">
                        <span className="h-1 w-1 shrink-0 rounded-full bg-[#9c4f38]" />
                        {s}
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant="link"
                    className="mt-6 h-auto p-0 font-sans text-sm font-semibold text-[#9c4f38]"
                    asChild
                  >
                    <a href={`/menu#${signatureBlocks[0].sectionId}`}>
                      Open breakfast
                      <ArrowUpRight className="ml-1 inline h-3.5 w-3.5" />
                    </a>
                  </Button>
                </div>
                <div className="relative min-h-[220px] md:min-h-0">
                  <img
                    src={signatureBlocks[0].image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              </div>
            </article>

            <div className="flex flex-col gap-6 lg:col-span-5">
              {signatureBlocks.slice(1).map((block) => (
                <article
                  key={block.title}
                  className="menu-paper flex flex-1 flex-col overflow-hidden sm:flex-row"
                >
                  <div className="relative h-44 shrink-0 sm:h-auto sm:w-[42%]">
                    <img
                      src={block.image}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6 sm:p-7">
                    <h3 className="font-serif text-xl text-[#1c120e]">
                      {block.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 font-sans text-sm leading-relaxed text-[#5c4d42]">
                      {block.description}
                    </p>
                    <a
                      href={`/menu#${block.sectionId}`}
                      className="mt-auto pt-4 font-sans text-sm font-semibold text-[#9c4f38] hover:text-[#7a3c2a]"
                    >
                      View section →
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-dark border-b border-black/20 py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-[1fr_360px] lg:items-center">
            <div>
              <p className="section-kicker !text-[#d4a990]">Catering</p>
              <h2 className="mt-4 font-serif text-3xl leading-tight sm:text-4xl">
                Buffets and trays when the headcount is not a guess.
              </h2>
              <p className="mt-5 max-w-xl font-sans text-sm leading-relaxed text-[#c9b8ab] sm:text-base">
                {CATERING_HELPER_TEXT}
              </p>
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {featuredPackages.map((pkg) => (
                  <div
                    key={pkg.publicName}
                    className="rounded-md border border-white/10 bg-white/5 px-4 py-4"
                  >
                    <p className="font-serif text-lg leading-snug text-[#f4ebe3]">
                      {pkg.publicName}
                    </p>
                    <p className="mt-2 font-sans text-xs font-medium text-[#e0c9bc]">
                      {pkg.pricePerPerson}
                    </p>
                    <p className="mt-1 font-sans text-[11px] uppercase tracking-[0.14em] text-[#a8897a]">
                      {pkg.minimumOrder}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-10 flex flex-wrap gap-3">
                <Button
                  className="rounded-md bg-[#b55a3c] px-8 font-sans text-white hover:bg-[#9c4f38]"
                  asChild
                >
                  <Link href="/catering">Catering menu</Link>
                </Button>
                <Button
                  variant="outline"
                  className="rounded-md border-white/20 bg-transparent font-sans text-[#f4ebe3] hover:bg-white/10"
                  asChild
                >
                  <Link href="/catering#inquire">Request a quote</Link>
                </Button>
              </div>
            </div>
            <div className="overflow-hidden rounded-md border border-white/10">
              <img
                src={SITE_IMAGES.veggieTray}
                alt="Vegetable platter for office catering"
                className="aspect-[4/5] w-full object-cover sm:aspect-auto sm:h-full sm:min-h-[340px]"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[rgba(36,24,18,0.08)] py-14 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="menu-paper grid gap-8 p-8 sm:grid-cols-[1fr_auto] sm:items-center sm:p-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="section-kicker">Visit</p>
              <h2 className="mt-3 font-serif text-2xl text-[#1c120e] sm:text-3xl">
                {BUSINESS_INFO.addressLine1}
              </h2>
              <p className="mt-2 font-sans text-sm text-[#5c4d42]">
                {BUSINESS_INFO.addressLine2} — convenient for Skymark offices and
                west Mississauga lunch runs.
              </p>
              <div className="mt-6 flex flex-wrap gap-6 font-sans text-sm text-[#3d3028]">
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#9c4f38]" />
                  <a
                    href={BUSINESS_INFO.mapsHref}
                    className="font-semibold underline decoration-[#c9a08c] decoration-1 underline-offset-4 hover:text-[#9c4f38]"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open in Maps
                  </a>
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#9c4f38]" />
                  {BUSINESS_INFO.hoursLabel}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[#9c4f38]" />
                  <a
                    href={BUSINESS_INFO.phoneHref}
                    className="font-semibold hover:text-[#9c4f38]"
                  >
                    {BUSINESS_INFO.phone}
                  </a>
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:items-end">
              <Button
                className="w-full rounded-md bg-[#2a1f19] font-sans sm:w-auto"
                asChild
              >
                <Link href="/contact">Contact &amp; hours</Link>
              </Button>
              <Button
                variant="outline"
                className="w-full rounded-md border-[rgba(36,24,18,0.14)] bg-white font-sans sm:w-auto"
                asChild
              >
                <Link href="/menu">Back to menu</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#1c120e] py-14 text-center text-[#f4ebe3] sm:py-16">
        <div className="container mx-auto max-w-2xl px-4">
          <p className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-[#c49a7e]">
            Ready when you are
          </p>
          <h2 className="mt-4 font-serif text-3xl tracking-tight sm:text-4xl">
            Pickup today, or a catering plan for later.
          </h2>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              className="rounded-md bg-[#b55a3c] px-10 font-sans text-white hover:bg-[#9c4f38]"
              asChild
            >
              <Link href="/menu">Order pickup</Link>
            </Button>
            <Button
              variant="outline"
              className="rounded-md border-white/25 bg-transparent font-sans text-[#f4ebe3] hover:bg-white/10"
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
