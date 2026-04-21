import { Link } from "wouter";
import { ArrowUpRight, Clock3, MapPin, Star } from "lucide-react";
import { Layout } from "@/components/layout";
import { Hero } from "@/components/sections/hero";
import { Section } from "@/components/sections/section";
import { Button } from "@/components/ui/button";
import { BUFFET_PACKAGES } from "@/content/catering";
import {
  BUSINESS_INFO,
  CATERING_HELPER_TEXT,
  SITE_IMAGES,
} from "@/content/site";
import { restaurantStructuredData, useSeo } from "@/lib/seo";
import { cn } from "@/lib/utils";

const featuredPackages = BUFFET_PACKAGES.slice(0, 3);

const categoryShowcase = [
  {
    key: "catering",
    title: "Office catering",
    description:
      "Buffets, trays, and platters for Mississauga teams — especially Skymark Ave and Pearson-adjacent offices that need portions and timing nailed.",
    href: "/catering",
    image: SITE_IMAGES.greekSaladTray,
    imageAlt:
      "Catering salad and tray spread prepared at Skymark Eatery by Caffe E Pranzo",
    featured: true,
  },
  {
    key: "breakfast",
    title: "Breakfast & pastry",
    description: "Early counter rhythm — croissants, bagels, and hot breakfast sandwiches for the first meetings of the day.",
    href: "/menu#breakfast",
    image: SITE_IMAGES.focaccia,
    imageAlt: "Focaccia and baked goods from the Skymark Eatery counter",
    featured: false,
  },
  {
    key: "lunch",
    title: "Sandwiches & salads",
    description: "Hot sandwiches, salads, and dependable weekday staples built for quick pickup.",
    href: "/menu#sandwiches",
    image: SITE_IMAGES.vealSandwich,
    imageAlt: "Hot sandwich from the lunch line at Skymark Eatery",
    featured: false,
  },
  {
    key: "pasta",
    title: "Pasta & pizza",
    description: "Comfort pasta plates and shareable pizzas for solo lunches or team orders.",
    href: "/menu#pasta",
    image: SITE_IMAGES.hotTable,
    imageAlt: "Hot table and lunch service at Skymark Eatery",
    featured: false,
  },
] as const;

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
      <Hero
        eyebrow="Italian eatery · Mississauga"
        title={`${BUSINESS_INFO.secondaryName} by Caffe E Pranzo`}
        subtitle="Weekday Italian breakfast and lunch on Skymark Ave — takeout built for speed, catering built for offices and events across west Mississauga and teams near Pearson."
        imageSrc={SITE_IMAGES.hero}
        imageAlt="Pasta and Italian lunch favourites from Skymark Eatery by Caffe E Pranzo"
        primaryCta={{ label: "Order pickup", href: "/menu" }}
        secondaryCta={{ label: "Browse catering", href: "/catering" }}
        infoLine={
          <p>
            <a href={BUSINESS_INFO.phoneHref} className="font-semibold text-white">
              {BUSINESS_INFO.phone}
            </a>
            <span className="mx-2 text-white/35">·</span>
            {BUSINESS_INFO.hoursLabel}
          </p>
        }
      />

      <Section
        tone="light"
        density="airy"
        withMotion
        className="border-b border-[rgba(26,18,14,0.08)]"
      >
        <div>
          <p className="section-kicker">Category showcase</p>
          <h2 className="brand-rail mt-4 max-w-2xl text-[#1f1410]">
            The weekday line — with catering as the grown-up lane.
          </h2>
          <p className="mt-4 max-w-2xl text-sm text-[#5c4d42] md:text-base">
            Pickup stays fast. When the guest list is real, the same kitchen runs trays and buffets
            with clear portions for Skymark Ave offices and Pearson-area meetings.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-12 md:grid-rows-2 md:auto-rows-fr">
            {categoryShowcase.map((block) => (
              <article
                key={block.key}
                className={cn(
                  "group section-shell overflow-hidden rounded-sm transition-transform duration-300 hover:-translate-y-0.5",
                  block.featured
                    ? "md:col-span-6 md:row-span-2"
                    : "md:col-span-3 md:row-span-1",
                )}
              >
                <div
                  className={cn(
                    "image-wrapper image-vignette",
                    block.featured ? "min-h-[220px] md:min-h-[320px]" : "ratio-card",
                  )}
                >
                  <img src={block.image} alt={block.imageAlt} />
                </div>
                <div className={cn("p-5", block.featured && "md:p-6")}>
                  <h3
                    className={cn(
                      "text-[#1f1410]",
                      block.featured ? "font-serif text-2xl md:text-3xl" : "text-xl",
                    )}
                  >
                    {block.title}
                  </h3>
                  <p className="mt-2 text-sm text-[#5c4d42] md:text-[0.95rem]">
                    {block.description}
                  </p>
                  <a
                    href={block.href}
                    className="mt-4 inline-flex items-center text-sm font-semibold text-[hsl(var(--primary))]"
                  >
                    {block.featured ? "Plan catering" : "Explore"}
                    <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Section>

      <Section
        tone="muted"
        density="airy"
        withMotion
        className="border-b border-[rgba(26,18,14,0.08)]"
      >
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="brand-rail lg:order-2 lg:col-span-5">
            <p className="section-kicker">Story</p>
            <h2 className="mt-4 text-[#1f1410]">A weekday Italian counter built for pickup rhythm.</h2>
            <p className="mt-4 text-[#5c4d42]">
              Pastries and breakfast early, sandwiches and pasta through the afternoon — organized so
              pickup stays quick for Skymark offices and Airport Corporate Centre teams.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/menu">View menu</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/catering">Catering packages</Link>
              </Button>
            </div>
          </div>
          <div className="image-wrapper image-vignette relative min-h-[280px] overflow-hidden rounded-sm border border-[rgba(26,18,14,0.09)] shadow-sm lg:order-1 lg:col-span-7 lg:min-h-[380px] lg:-translate-y-6">
            <img
              src={SITE_IMAGES.dining}
              alt="Interior dining and counter at Skymark Eatery by Caffe E Pranzo, Mississauga"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </Section>

      <Section
        tone="dark"
        density="airy"
        withMotion
        className="border-b border-black/35"
      >
        <div className="grid gap-9 lg:grid-cols-[1fr_1.05fr] lg:items-start">
          <div className="border-l-4 border-[hsla(14,56%,48%,0.85)] pl-5">
            <p className="section-kicker text-[#d4a990]">Catering highlight</p>
            <h2 className="mt-3 text-white">Buffets and trays when guest counts are real.</h2>
            <p className="mt-4 text-[#d0c0b4]">{CATERING_HELPER_TEXT}</p>
            <ul className="mt-8 space-y-4 border-l border-white/20 pl-4">
              {featuredPackages.map((pkg) => (
                <li key={pkg.publicName} className="text-sm text-[#e8ddd4]">
                  <span className="font-serif text-lg text-white">{pkg.publicName}</span>
                  <span className="mx-2 text-white/35">·</span>
                  {pkg.pricePerPerson}
                  <span className="mx-2 text-white/35">·</span>
                  {pkg.minimumOrder}
                </li>
              ))}
            </ul>
          </div>
          <div className="image-wrapper ratio-card rounded-sm border border-white/12">
            <img
              src={SITE_IMAGES.greekSaladTray}
              alt="Catering salad and tray spread prepared at Skymark Eatery by Caffe E Pranzo"
            />
          </div>
        </div>
      </Section>

      <Section tone="light" withMotion className="border-b border-[rgba(26,18,14,0.08)]">
        <div className="grid gap-4 md:grid-cols-3">
          <article className="section-shell rounded-sm p-5">
            <MapPin className="h-4 w-4 text-[#8b3d2c]" />
            <h3 className="mt-3 text-[1.25rem] text-[#1f1410]">{BUSINESS_INFO.addressLine1}</h3>
            <p className="mt-2 text-sm text-[#5c4d42]">{BUSINESS_INFO.addressLine2}</p>
          </article>
          <article className="section-shell rounded-sm p-5">
            <Clock3 className="h-4 w-4 text-[#8b3d2c]" />
            <h3 className="mt-3 text-[1.25rem] text-[#1f1410]">Weekday hours</h3>
            <p className="mt-2 text-sm text-[#5c4d42]">Monday to Friday, 7:30 AM to 4:30 PM.</p>
          </article>
          <article className="section-shell rounded-sm p-5">
            <Star className="h-4 w-4 text-[#8b3d2c]" />
            <h3 className="mt-3 text-[1.25rem] text-[#1f1410]">Trusted by nearby offices</h3>
            <p className="mt-2 text-sm text-[#5c4d42]">Fast pickup, reliable tray portions, and easy catering support.</p>
          </article>
        </div>
      </Section>

      <Section tone="dark" withMotion className="text-center">
        <p className="section-kicker text-[#c49a7e]">Ready when you are</p>
        <h2 className="mt-3 mx-auto text-white">Pickup today, or a catering plan for the room.</h2>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/menu">Order pickup</Link>
          </Button>
          <Button variant="outline" className="border-white/22 bg-transparent text-[#f2e8dc] hover:bg-white/10" asChild>
            <Link href="/catering#inquire">Catering inquiry</Link>
          </Button>
        </div>
      </Section>
    </Layout>
  );
}
