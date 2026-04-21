import { Link } from "wouter";
import { ArrowRight, Clock, MapPin, Phone } from "lucide-react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { BUFFET_PACKAGES } from "@/content/catering";
import { HOME_SIGNATURE_GROUPS } from "@/content/menu";
import {
  BUSINESS_INFO,
  CATERING_HELPER_TEXT,
  HOME_TRUST_MARKERS,
  SITE_IMAGES,
  WHY_SKYMARK,
} from "@/content/site";
import { restaurantStructuredData, useSeo } from "@/lib/seo";

const featuredPackages = BUFFET_PACKAGES.slice(0, 3);

const featuredSections = [
  {
    ...HOME_SIGNATURE_GROUPS[0],
    image: SITE_IMAGES.focaccia,
    eyebrow: "Breakfast counter",
  },
  {
    ...HOME_SIGNATURE_GROUPS[1],
    image: SITE_IMAGES.caesar,
    eyebrow: "Lunch favourites",
  },
  {
    ...HOME_SIGNATURE_GROUPS[2],
    image: SITE_IMAGES.menuHero,
    eyebrow: "Hot plates and pasta",
  },
];

export default function Home() {
  useSeo({
    title:
      "Skymark Eatery by Caffe E Pranzo | Italian Catering & Takeout in Mississauga",
    description:
      "Italian takeout, weekday lunch, breakfast, and catering from Skymark Eatery by Caffe E Pranzo in Mississauga. Browse the menu, plan catering, and order pickup.",
    path: "/",
    image: SITE_IMAGES.og,
    imageAlt: SITE_IMAGES.ogImageAlt,
    structuredData: restaurantStructuredData(),
  });

  return (
    <Layout>
      <section className="relative overflow-hidden border-b border-[rgba(79,50,34,0.08)] bg-[#f6efe4]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(174,104,65,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(88,103,57,0.08),transparent_28%)]" />

        <div className="relative container mx-auto px-4 py-14 sm:py-18 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(340px,520px)] lg:items-center">
            <div className="max-w-3xl">
              <div className="section-kicker">
                Italian eatery, takeout, and catering
              </div>
              <h1 className="mt-5 max-w-3xl text-5xl leading-[0.95] text-[#2d1e18] sm:text-6xl lg:text-7xl">
                {BUSINESS_INFO.primaryName}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#4b392f] sm:text-xl">
                Warm Italian lunch, easy weekday pickup, and catered trays for
                offices, meetings, and family gatherings in Mississauga.
              </p>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[#6d5748]">
                Breakfast pastries, hot sandwiches, pasta, salads, pizza, and
                catering packages prepared from Skymark Avenue for real lunch
                schedules and real group orders.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button
                  size="lg"
                  className="rounded-full bg-[#8b4f39] px-7 text-white hover:bg-[#75412f]"
                  asChild
                >
                  <Link href="/menu">View Menu</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-[rgba(45,30,24,0.12)] bg-white/88 px-7 text-[#2d1e18]"
                  asChild
                >
                  <Link href="/catering#inquire">Request Catering</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-[rgba(45,30,24,0.12)] bg-transparent px-7 text-[#2d1e18]"
                  asChild
                >
                  <a href={BUSINESS_INFO.phoneHref}>
                    Call {BUSINESS_INFO.phone}
                  </a>
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#6d5748]">
                {HOME_TRUST_MARKERS.map((marker) => (
                  <span key={marker} className="inline-flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#b06b4a]" />
                    {marker}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_180px]">
              <div className="relative overflow-hidden rounded-[2.25rem] border border-[rgba(79,50,34,0.12)] bg-white shadow-[0_34px_70px_rgba(65,42,29,0.16)]">
                <img
                  src={SITE_IMAGES.hero}
                  alt="Seafood pasta from Skymark Eatery"
                  className="h-full min-h-[440px] w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent,rgba(31,18,12,0.92))] p-6 text-white">
                  <div className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/68">
                    From the kitchen
                  </div>
                  <p className="mt-2 font-serif text-3xl leading-tight">
                    Pasta, lunch specials, salads, and sandwiches that feel
                    cooked, not templated.
                  </p>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="overflow-hidden rounded-[1.8rem] border border-[rgba(79,50,34,0.1)] bg-white shadow-sm">
                  <img
                    src={SITE_IMAGES.caesar}
                    alt="Grilled Caesar salad from Skymark Eatery"
                    className="h-44 w-full object-cover"
                  />
                  <div className="p-4">
                    <div className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#8b5f48]">
                      Weekday lunch
                    </div>
                    <p className="mt-2 text-sm font-medium leading-6 text-[#3f3027]">
                      Quick salads, hot lunches, and easy pickup for the
                      workday.
                    </p>
                  </div>
                </div>
                <div className="overflow-hidden rounded-[1.8rem] border border-[rgba(79,50,34,0.1)] bg-[#2d1e18] text-white shadow-sm">
                  <img
                    src={SITE_IMAGES.focaccia}
                    alt="Fresh focaccia from Skymark Eatery"
                    className="h-36 w-full object-cover"
                  />
                  <div className="p-4">
                    <div className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/58">
                      Fresh daily
                    </div>
                    <p className="mt-2 text-sm leading-6 text-white/78">
                      Pastries, bread, and hot table favourites built into the
                      weekday rhythm.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[rgba(79,50,34,0.08)] bg-background py-14 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="section-kicker">Start with what you need</div>
              <h2 className="mt-3 text-4xl text-[#2d1e18] sm:text-5xl">
                Everyday takeout, breakfast, and lunch without the clutter.
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-[#6d5748] sm:text-base">
              The homepage stays focused on the decisions guests actually need
              to make: what to order today, how to plan catering, and how to
              reach the restaurant quickly.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {featuredSections.map((section) => (
              <article
                key={section.title}
                className="overflow-hidden rounded-[2rem] border border-[rgba(79,50,34,0.1)] bg-white shadow-[0_18px_40px_rgba(66,43,30,0.06)]"
              >
                <img
                  src={section.image}
                  alt={section.title}
                  className="h-56 w-full object-cover"
                />
                <div className="p-6">
                  <div className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#8b5f48]">
                    {section.eyebrow}
                  </div>
                  <h3 className="mt-3 text-3xl text-[#2d1e18]">
                    {section.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[#6d5748]">
                    {section.description}
                  </p>
                  <div className="mt-6 space-y-3 border-t border-[rgba(79,50,34,0.08)] pt-5">
                    {section.samples.map((sample) => (
                      <div
                        key={sample}
                        className="flex items-center justify-between gap-3 text-sm text-[#3f3027]"
                      >
                        <span>{sample}</span>
                        <ArrowRight className="h-4 w-4 shrink-0 text-[#8b5f48]" />
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    className="mt-6 rounded-full border-[rgba(45,30,24,0.12)] bg-[#fbf6ef]"
                    asChild
                  >
                    <a href={`/menu#${section.sectionId}`}>See this section</a>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[rgba(79,50,34,0.08)] bg-[#f3eadf] py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.02fr)_minmax(320px,0.98fr)] lg:items-center">
            <div className="grid gap-4 sm:grid-cols-[1.05fr_0.95fr]">
              <div className="overflow-hidden rounded-[2.1rem] border border-[rgba(79,50,34,0.1)] shadow-[0_24px_54px_rgba(66,43,30,0.1)]">
                <img
                  src={SITE_IMAGES.greekSaladTray}
                  alt="Greek salad catering tray from Skymark Eatery"
                  className="h-full min-h-[440px] w-full object-cover"
                />
              </div>
              <div className="grid gap-4">
                <div className="overflow-hidden rounded-[1.8rem] border border-[rgba(79,50,34,0.1)] bg-white shadow-sm">
                  <img
                    src={SITE_IMAGES.veggieTray}
                    alt="Vegetable catering tray from Skymark Eatery"
                    className="h-48 w-full object-cover"
                  />
                </div>
                <div className="rounded-[1.8rem] border border-[rgba(79,50,34,0.1)] bg-[#2d1e18] p-5 text-white shadow-sm">
                  <div className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/58">
                    Catering made clear
                  </div>
                  <p className="mt-3 text-sm leading-7 text-white/78">
                    Buffet packages, platters, trays, desserts, and service
                    extras are separated cleanly so planning feels easier.
                  </p>
                </div>
              </div>
            </div>

            <div className="max-w-2xl">
              <div className="section-kicker">Catering highlight</div>
              <h2 className="mt-3 text-4xl text-[#2d1e18] sm:text-5xl">
                Buffet packages and trays for office lunches, family gatherings,
                and group events.
              </h2>
              <p className="mt-5 text-base leading-8 text-[#4b392f]">
                The catering page keeps group ordering separate from the regular
                takeout flow, with buffet packages, platters, hot trays,
                desserts, beverages, and dietary notes organized in one place.
              </p>
              <p className="mt-3 text-sm leading-7 text-[#6d5748]">
                {CATERING_HELPER_TEXT}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  size="lg"
                  className="rounded-full bg-[#8b4f39] px-7 text-white hover:bg-[#75412f]"
                  asChild
                >
                  <Link href="/catering">View Catering</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-[rgba(45,30,24,0.12)] bg-white/86 px-7 text-[#2d1e18]"
                  asChild
                >
                  <Link href="/catering#inquire">Request Catering</Link>
                </Button>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {featuredPackages.map((pkg) => (
                  <article
                    key={pkg.publicName}
                    className="rounded-[1.5rem] border border-[rgba(79,50,34,0.1)] bg-white/88 p-5 shadow-sm"
                  >
                    <div className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#8b5f48]">
                      Buffet package
                    </div>
                    <h3 className="mt-2 text-xl leading-tight text-[#2d1e18]">
                      {pkg.publicName}
                    </h3>
                    <p className="mt-3 text-sm font-medium text-[#3f3027]">
                      {pkg.pricePerPerson}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#8b5f48]">
                      {pkg.minimumOrder}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#2d1e18] py-16 text-white sm:py-18">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-[340px_minmax(0,1fr)] lg:items-center">
            <div className="overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_24px_54px_rgba(0,0,0,0.22)]">
              <img
                src={SITE_IMAGES.locationInterior}
                alt={SITE_IMAGES.locationInteriorAlt}
                className="h-full min-h-[340px] w-full object-cover"
              />
            </div>

            <div>
              <div className="section-kicker text-[#d9b69d]">
                Local and easy to reach
              </div>
              <h2 className="mt-3 text-4xl text-white sm:text-5xl">
                A dependable stop for office lunch, takeout, and planned group
                orders.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/74">
                {WHY_SKYMARK[0].text} {WHY_SKYMARK[1].text}
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <div className="rounded-[1.5rem] border border-white/10 bg-white/6 p-5">
                  <div className="flex items-center gap-2 text-sm font-medium text-[#f2d3bf]">
                    <MapPin className="h-4 w-4" />
                    Address
                  </div>
                  <p className="mt-3 text-base font-semibold text-white">
                    {BUSINESS_INFO.addressLine1}
                  </p>
                  <p className="mt-1 text-sm text-white/68">
                    {BUSINESS_INFO.addressLine2}
                  </p>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-white/6 p-5">
                  <div className="flex items-center gap-2 text-sm font-medium text-[#f2d3bf]">
                    <Clock className="h-4 w-4" />
                    Hours
                  </div>
                  <p className="mt-3 text-base font-semibold text-white">
                    Monday to Friday
                  </p>
                  <p className="mt-1 text-sm text-white/68">
                    7:30 AM to 4:30 PM
                  </p>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-white/6 p-5">
                  <div className="flex items-center gap-2 text-sm font-medium text-[#f2d3bf]">
                    <Phone className="h-4 w-4" />
                    Call or email
                  </div>
                  <a
                    href={BUSINESS_INFO.phoneHref}
                    className="mt-3 block text-base font-semibold text-white hover:text-[#f2d3bf]"
                  >
                    {BUSINESS_INFO.phone}
                  </a>
                  <a
                    href={BUSINESS_INFO.emailHref}
                    className="mt-1 block text-sm text-white/68 hover:text-white"
                  >
                    {BUSINESS_INFO.email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-16 sm:py-18">
        <div className="container mx-auto px-4">
          <div className="section-shell px-7 py-8 sm:px-10 sm:py-10">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div className="max-w-2xl">
                <div className="section-kicker">Ready to order?</div>
                <h2 className="mt-3 text-4xl text-[#2d1e18] sm:text-5xl">
                  Use the menu for weekday pickup, or head straight to catering
                  for larger orders.
                </h2>
                <p className="mt-4 text-base leading-8 text-[#6d5748]">
                  Clear menu browsing, clearer catering planning, and direct
                  contact when you need a hand.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Button
                  size="lg"
                  className="rounded-full bg-[#8b4f39] px-7 text-white hover:bg-[#75412f]"
                  asChild
                >
                  <Link href="/menu">View Menu</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-[rgba(45,30,24,0.12)] bg-white px-7"
                  asChild
                >
                  <Link href="/catering#inquire">Request Catering</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-[rgba(45,30,24,0.12)] bg-white px-7"
                  asChild
                >
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
