import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Link } from "wouter";
import { CheckCircle2, Mail, Phone, Sparkles } from "lucide-react";
import { Layout } from "@/components/layout";
import { Hero } from "@/components/sections/hero";
import { Section } from "@/components/sections/section";
import { StickySectionNav } from "@/components/sticky-section-nav";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BUSINESS_INFO,
  CATERING_HELPER_TEXT,
  SITE_IMAGES,
} from "@/content/site";
import {
  BUFFET_PACKAGES,
  CATERING_INTRO,
  CATERING_NOTES,
  CATERING_OVERVIEW,
  CATERING_SECTIONS,
  DIETARY_BADGES,
} from "@/content/catering";
import {
  breadcrumbStructuredData,
  restaurantStructuredData,
  useSeo,
} from "@/lib/seo";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const cateringSchema = z.object({
  companyName: z.string().min(2, "Company or contact name is required"),
  contactName: z.string().min(2, "Contact name is required"),
  email: z.string().email("A valid email is required"),
  phone: z.string().min(10, "Phone number is required"),
  eventDate: z.string().min(1, "Event date is required"),
  guestCount: z.string().min(1, "Guest count is required"),
  eventType: z.string().min(1, "Select an event type"),
  deliveryType: z.string().min(1, "Select pickup or delivery"),
  notes: z.string().optional(),
});

type CateringValues = z.infer<typeof cateringSchema>;

const anchorLinks = [
  { id: "occasion", label: "Plan" },
  { id: "packages", label: "Packages" },
  { id: "appetizers", label: "Appetizers" },
  { id: "platters", label: "Platters" },
  { id: "presentation", label: "Trays" },
  { id: "hot-catering", label: "Hot trays" },
  { id: "pizza", label: "Pizza" },
  { id: "desserts", label: "Desserts" },
  { id: "dietary", label: "Dietary" },
  { id: "inquire", label: "Inquire" },
];

function BuffetCompareTable() {
  return (
    <div className="mt-8 overflow-x-auto rounded-xl bg-[hsl(220_40%_99%/0.92)] shadow-[0_20px_50px_-42px_rgba(15,23,42,0.12)] ring-1 ring-[hsla(220,14%,12%,0.06)]">
      <table className="w-full min-w-[600px] border-collapse text-left text-sm">
        <thead className="border-b border-[hsla(220,14%,12%,0.08)] bg-[hsl(var(--muted))]/80 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">
          <tr>
            <th className="px-4 py-3 sm:px-5">Package</th>
            <th className="px-4 py-3 sm:px-5">Per person</th>
            <th className="px-4 py-3 sm:px-5">Minimum</th>
            <th className="px-4 py-3 sm:px-5">Feeds</th>
          </tr>
        </thead>
        <tbody>
          {BUFFET_PACKAGES.map((pkg) => (
            <tr
              key={pkg.publicName}
              className="border-b border-[rgba(36,24,18,0.06)] last:border-b-0"
            >
              <td className="px-4 py-3.5 font-sans font-semibold text-[hsl(var(--foreground))] sm:px-5">
                {pkg.publicName}
              </td>
              <td className="px-4 py-3.5 tabular-nums text-[hsl(var(--foreground))] sm:px-5">
                {pkg.pricePerPerson}
              </td>
              <td className="px-4 py-3.5 text-[hsl(var(--muted-foreground))] sm:px-5">
                {pkg.minimumOrder}
              </td>
              <td className="px-4 py-3.5 text-[hsl(var(--muted-foreground))] sm:px-5">{pkg.feeds}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function metaLine(serving?: string, dietary?: string[]) {
  return [serving, ...(dietary ?? [])].filter(Boolean).join(" • ");
}

function CateringRows({
  sectionId,
  tone = "tray",
}: {
  sectionId: string;
  tone?: "tray" | "menu" | "flush";
}) {
  const section = CATERING_SECTIONS.find((entry) => entry.id === sectionId);
  if (!section) return null;

  const tray = tone === "tray";
  const flush = tone === "flush";

  return (
    <article
      id={section.id}
      className={cn(
        "anchor-section overflow-hidden transition-[box-shadow,transform] duration-300 ease-out",
        tray &&
          "rounded-xl border-0 bg-white ring-1 ring-[hsla(220,14%,12%,0.06)] hover:-translate-y-px hover:shadow-[0_22px_52px_-42px_rgba(15,23,42,0.12)]",
        flush && "rounded-none border-0 bg-transparent shadow-none ring-0",
        !tray && !flush && "menu-paper",
      )}
    >
      <div
        className={cn(
          "border-b border-[rgba(36,24,18,0.08)] px-5 py-3.5 sm:px-6 sm:py-4",
          tray && "bg-[hsl(var(--muted))]/90",
          flush && "border-[hsla(220,14%,12%,0.1)] bg-transparent px-0 sm:px-0",
        )}
      >
        <h3
          className={cn(
            "font-sans tracking-tight text-[#1c120e]",
            tray ? "text-xl sm:text-2xl" : "text-2xl sm:text-[1.65rem]",
            flush && "text-xl sm:text-[1.65rem]",
          )}
        >
          {section.title}
        </h3>
        <p className="mt-2 max-w-3xl font-sans text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
          {section.description}
        </p>
      </div>

      <div className="divide-y divide-[rgba(36,24,18,0.07)]">
        {section.items.map((item) => (
          <div
            key={`${section.id}-${item.name}`}
            className={cn(
              "flex flex-col gap-1.5 py-3.5 sm:flex-row sm:items-start sm:justify-between sm:py-3.5",
              flush ? "px-0 sm:px-0" : "px-5 sm:px-6",
            )}
          >
            <div className="min-w-0 flex-1">
              <div className="flex min-w-0 items-end gap-2">
                <h4 className="min-w-0 font-sans text-[0.98rem] text-[#1c120e] sm:text-lg">
                  {item.name}
                </h4>
                <span
                  className="mb-[0.28rem] min-h-px min-w-[0.5rem] flex-1 border-b border-dotted border-[rgba(36,24,18,0.2)] sm:mb-[0.32rem]"
                  aria-hidden
                />
                <p className="shrink-0 font-sans text-[0.98rem] tabular-nums text-[#1c120e] sm:text-base">
                  {item.price}
                </p>
              </div>
              <p className="mt-1 font-sans text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                {item.description}
              </p>
              {metaLine(item.serving, item.dietary) ? (
                <p className="mt-1.5 font-sans text-[10px] font-medium uppercase tracking-[0.14em] text-[hsl(152_36%_28%)]">
                  {metaLine(item.serving, item.dietary)}
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

export default function Catering() {
  const [submitted, setSubmitted] = useState(false);
  const [occasion, setOccasion] = useState("office-lunch");

  useSeo({
    title:
      "Catering & Buffets — Skymark Eatery by Caffe E Pranzo | Mississauga Office & Event Italian",
    description:
      "Office and event Italian catering on Skymark Ave, Mississauga (Pearson-adjacent): buffet packages with per-person pricing, hot trays, sandwich platters, appetizers, desserts, and inquiry support from Skymark Eatery by Caffe E Pranzo.",
    path: "/catering",
    image: SITE_IMAGES.og,
    imageAlt: SITE_IMAGES.ogImageAlt,
    structuredData: [
      restaurantStructuredData(),
      breadcrumbStructuredData([
        { name: "Home", path: "/" },
        { name: "Catering", path: "/catering" },
      ]),
    ],
  });

  const form = useForm<CateringValues>({
    resolver: zodResolver(cateringSchema),
    defaultValues: {
      deliveryType: "pickup",
      eventType: "office-lunch",
    },
  });

  const onSubmit = (values: CateringValues) => {
    const subject = encodeURIComponent(
      `Catering Inquiry - ${values.companyName} - ${values.eventDate}`,
    );
    const body = encodeURIComponent(
      [
        `Company / Organization: ${values.companyName}`,
        `Contact Name: ${values.contactName}`,
        `Email: ${values.email}`,
        `Phone: ${values.phone}`,
        `Event Date: ${values.eventDate}`,
        `Guest Count: ${values.guestCount}`,
        `Event Type: ${values.eventType}`,
        `Pickup or Delivery: ${values.deliveryType}`,
        "",
        "Event Notes:",
        values.notes?.trim() || "None provided",
      ].join("\n"),
    );

    window.location.href = `${BUSINESS_INFO.emailHref}?subject=${subject}&body=${body}`;
    setSubmitted(true);
    toast.success("Your catering email draft is ready to send.");
  };

  return (
    <Layout>
      <Hero
        eyebrow="Office catering · Mississauga · Pearson-west"
        title="Trays and buffets your finance lead can forward."
        subtitle={CATERING_INTRO}
        imageSrc={SITE_IMAGES.cateringHero}
        imageAlt="Catering salad and tray spread from Skymark Eatery, Mississauga"
        imageClassName="media-crop-catering-hero"
        imageEmphasis="subdued"
        primaryCta={{ label: "Buffet packages", href: "/catering#packages" }}
        secondaryCta={{ label: "Request catering", href: "/catering#inquire" }}
      />

      <Section id="occasion" tone="muted" withMotion className="py-6 md:py-9">
        <div>
          <p className="section-kicker">Occasion selector</p>
          <Tabs value={occasion} onValueChange={setOccasion} className="mt-4">
            <TabsList className="h-auto w-full flex-wrap justify-start gap-1 rounded-md border border-[hsla(220,14%,12%,0.1)] bg-white p-1 shadow-sm">
              <TabsTrigger value="office-lunch">Team lunch</TabsTrigger>
              <TabsTrigger value="meeting">Office meeting</TabsTrigger>
              <TabsTrigger value="corporate-event">Hosted event</TabsTrigger>
              <TabsTrigger value="family-event">Family gathering</TabsTrigger>
            </TabsList>
            <TabsContent value="office-lunch">
              <p className="mt-3 text-sm text-[hsl(var(--muted-foreground))]">
                Fast setup, easy portions, and dependable timing for teams near Pearson and Skymark offices.
              </p>
            </TabsContent>
            <TabsContent value="meeting">
              <p className="mt-3 text-sm text-[hsl(var(--muted-foreground))]">
                Balanced trays and buffet combinations that stay practical for meeting schedules and room turnovers.
              </p>
            </TabsContent>
            <TabsContent value="family-event">
              <p className="mt-3 text-sm text-[hsl(var(--muted-foreground))]">
                Comfort-first combinations with generous servings and flexible trays for mixed preferences.
              </p>
            </TabsContent>
            <TabsContent value="corporate-event">
              <p className="mt-3 text-sm text-[hsl(var(--muted-foreground))]">
                Presentation-forward package planning with appetizers, mains, and add-ons for hosted events.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </Section>

      <StickySectionNav
        label="Catering sections"
        items={anchorLinks}
        cta={
          <a
            href="#inquire"
            className="whitespace-nowrap pb-1 font-sans text-[11px] font-semibold text-[hsl(var(--primary))] hover:text-white"
          >
            Get a quote
          </a>
        }
      />

      <section className="border-b border-[hsla(220,14%,12%,0.06)] section-muted py-10">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid gap-10 sm:grid-cols-3 sm:gap-12 lg:gap-16">
            {CATERING_OVERVIEW.map((item, index) => (
              <div key={item.title} className="relative sm:pl-2">
                <span
                  className="pointer-events-none absolute -left-1 -top-3 font-sans text-[2.75rem] font-semibold leading-none text-[hsl(var(--foreground))]/[0.05] sm:text-[3.25rem]"
                  aria-hidden
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="relative font-sans text-[0.6rem] font-semibold uppercase tracking-[0.24em] text-[hsl(var(--primary))]">
                  {item.title}
                </p>
                <p className="relative mt-2 font-sans text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-b border-[hsla(220,14%,12%,0.07)] bg-[hsl(220_26%_9%)] py-14 text-white sm:py-16">
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-[min(55%,420px)] bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.14),transparent_68%)]"
          aria-hidden
        />
        <div className="container relative mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-sans text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-white/50">
            How Skymark treats office catering
          </h2>
          <blockquote className="mt-6 font-sans text-[1.35rem] font-medium leading-snug tracking-tight text-white/95 sm:text-[1.6rem] sm:leading-tight">
            It is not a longer menu — it is portion math, pickup timing, and trays that still read well when someone forwards the photo to finance.
          </blockquote>
        </div>
      </section>

      <section
        id="packages"
        className="anchor-section border-y border-[hsla(220,14%,12%,0.06)] bg-[hsl(var(--muted))] py-14 sm:py-16"
      >
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="section-kicker">Buffet Catering Packages</div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[hsl(var(--foreground))] sm:text-4xl">
                Ready-made buffet options with clear per-person pricing and
                minimums.
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-[hsl(var(--muted-foreground))] sm:text-base">
              Start here if you want the easiest path for office lunches,
              meetings, and family-style events. Each package keeps the menu,
              guest minimum, and price per person easy to compare.
            </p>
          </div>

          <BuffetCompareTable />

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {BUFFET_PACKAGES.map((pkg) => (
              <article
                key={pkg.publicName}
                className="overflow-hidden rounded-xl border border-[hsla(220,14%,12%,0.08)] bg-white shadow-md transition-[box-shadow,transform] duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_28px_64px_-40px_rgba(15,23,42,0.18)]"
              >
                <div className="relative border-b border-white/10 bg-[hsl(220_28%_9%)] px-5 py-4 text-white sm:px-6 sm:py-5">
                  <div className="absolute inset-x-0 top-0 h-0.5 bg-[linear-gradient(90deg,transparent,hsla(4,86%,55%,0.55),transparent)] opacity-90" />
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="font-sans text-[1.45rem] leading-tight sm:text-[1.85rem]">
                        {pkg.publicName}
                      </h3>
                      <p className="mt-2.5 max-w-xl font-sans text-sm leading-relaxed text-white/75">
                        {pkg.summary}
                      </p>
                    </div>
                    <div className="shrink-0 rounded-sm border border-white/18 bg-black/25 px-4 py-3 text-left backdrop-blur-sm">
                      <p className="font-sans text-[0.55rem] uppercase tracking-[0.22em] text-white/55">
                        Per person
                      </p>
                      <p className="mt-1 font-sans text-xl text-white sm:text-2xl">
                        {pkg.pricePerPerson.replace(" per person", "")}
                        <span className="ml-1 font-sans text-xs font-normal text-white/65">
                          / guest
                        </span>
                      </p>
                      <p className="mt-2 border-t border-white/10 pt-2 font-sans text-[11px] leading-snug text-white/75">{pkg.minimumOrder}</p>
                      <p className="mt-1 font-sans text-[11px] leading-snug text-white/75">Serves: {pkg.feeds}</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1fr_minmax(0,200px)]">
                  <div>
                    <p className="font-sans text-[0.58rem] font-semibold uppercase tracking-[0.26em] text-[hsl(152_40%_28%)]">
                      Included
                    </p>
                    <ul className="mt-3 space-y-1.5 border-l-2 border-[hsl(var(--primary))]/70 pl-3.5 font-sans text-[13px] leading-snug text-[hsl(var(--foreground))] sm:text-sm">
                      {pkg.includedDishes.map((dish) => (
                        <li key={dish}>{dish}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col justify-between border-t border-[rgba(36,24,18,0.08)] pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                    <div>
                      <p className="font-sans text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--primary))]">
                        At a glance
                      </p>
                      <p className="mt-2 font-sans text-sm leading-relaxed text-[hsl(var(--foreground))] sm:text-[0.95rem]">
                        {pkg.atAGlance}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-14 sm:py-16">
        <div className="container mx-auto grid max-w-6xl gap-12 px-4">
          <section className="grid gap-8 lg:grid-cols-[340px_minmax(0,1fr)] lg:items-start">
            <div className="max-w-sm">
              <div className="section-kicker">Reception bites</div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[hsl(var(--foreground))] sm:text-4xl">
                Appetizers and platters that work for mingling and lighter
                setups.
              </h2>
              <p className="mt-4 text-base leading-8 text-[#6d5748]">
                Start with hors d&apos;oeuvres, bruschetta, meatballs, sandwich
                platters, and grazing-style trays for hosted lunches and casual
                event service.
              </p>
            </div>

            <div className="grid gap-8">
              <CateringRows sectionId="appetizers" />
              <CateringRows sectionId="platters" tone="flush" />
            </div>
          </section>

          <section
            id="presentation"
            className="anchor-section section-dark grain-hero relative overflow-hidden py-16 sm:py-20"
          >
            <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[min(52%,520px)] bg-[linear-gradient(115deg,rgba(255,255,255,0.04)_0%,transparent_55%)] lg:block" aria-hidden />
            <div className="container relative mx-auto max-w-6xl px-4">
              <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-12">
                <div className="lg:pr-4">
                  <p className="section-kicker text-[hsl(152_40%_72%)]">
                    Tray &amp; buffet presentation
                  </p>
                  <h2 className="mt-4 max-w-lg font-sans text-3xl tracking-tight text-white sm:text-[2.35rem] sm:leading-[1.08]">
                    See the spread before you sign the PO.
                  </h2>
                  <p className="mt-5 max-w-md font-sans text-sm leading-relaxed text-white/72 sm:text-base">
                    Trays are built for Skymark Ave and Pearson-west meetings — same kitchen as the line, different portion math than single pickup plates.
                  </p>
                  <Button
                    asChild
                    className="mt-8 bg-[hsl(var(--primary))] text-white shadow-[0_14px_36px_-16px_rgba(0,0,0,0.45)] transition duration-300 hover:bg-[hsl(var(--primary))]/92 hover:shadow-[0_18px_44px_-14px_rgba(0,0,0,0.5)]"
                  >
                    <Link href="/catering#inquire">Build an inquiry</Link>
                  </Button>
                </div>
                <div className="relative lg:-mr-4 lg:min-h-[min(340px,42vh)]">
                  <div className="depth-tilt relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/12 shadow-[0_28px_70px_rgba(0,0,0,0.45)] sm:aspect-[5/4] lg:aspect-auto lg:h-full lg:min-h-[300px]">
                    <img
                      src={SITE_IMAGES.caesar}
                      alt="Caesar salad tray — catering presentation from Skymark Eatery"
                      className="media-crop-showcase-tray h-full w-full object-cover image-vignette"
                      width={1200}
                      height={800}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            id="hot-catering"
            className="anchor-section grid gap-8 lg:grid-cols-[340px_minmax(0,1fr)] lg:items-start"
          >
            <div className="max-w-sm">
              <div className="section-kicker">Hot catering</div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[hsl(var(--foreground))] sm:text-4xl">
                Pasta trays, mains, salads, and sides that build out the meal.
              </h2>
              <p className="mt-4 text-base leading-8 text-[#6d5748]">
                Use these sections when you want to mix and match hot trays,
                seafood, salads, and dependable sides around a package or custom
                event menu.
              </p>
            </div>

            <div className="grid gap-8">
              <CateringRows sectionId="pasta-baked" />
              <div className="grid gap-8 xl:grid-cols-2">
                <CateringRows sectionId="seafood" tone="flush" />
                <div className="grid gap-8">
                  <CateringRows sectionId="salads" />
                  <CateringRows sectionId="sides" tone="flush" />
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-8 lg:grid-cols-[340px_minmax(0,1fr)] lg:items-start">
            <div className="max-w-sm">
              <div className="section-kicker">Finishing touches</div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[hsl(var(--foreground))] sm:text-4xl">
                Pizza trays, desserts, beverages, and extras for the full order.
              </h2>
              <p className="mt-4 text-base leading-8 text-[#6d5748]">
                Round out lunch spreads and event tables with party pizza,
                sweets, bread, bottled drinks, and service add-ons.
              </p>
            </div>

            <div className="grid gap-8">
              <CateringRows sectionId="pizza" />
              <div className="grid gap-8 xl:grid-cols-2">
                <CateringRows sectionId="desserts" tone="flush" />
                <CateringRows sectionId="extras" />
              </div>
            </div>
          </section>
        </div>
      </section>

      <section
        id="dietary"
        className="anchor-section border-y border-[hsla(220,14%,12%,0.06)] bg-[hsl(var(--background))] py-14 sm:py-16"
      >
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="max-w-xl">
              <div className="section-kicker">Dietary accommodations</div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[hsl(var(--foreground))] sm:text-4xl">
                Tell us what your group needs and we&apos;ll help shape the
                menu.
              </h2>
              <p className="mt-5 text-base leading-8 text-[#6d5748]">
                Dietary requests, tray combinations, and service questions are
                easiest to sort out before the event. Include them in your
                inquiry and we can guide you toward the right mix.
              </p>
            </div>

            <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
              <div className="lg:border-l lg:border-[hsl(var(--primary))]/30 lg:pl-10">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-[hsl(var(--primary))]" />
                  <h3 className="text-xl font-semibold tracking-tight text-[#2d1e18] sm:text-2xl">
                    Common accommodations
                  </h3>
                </div>
                <ul className="mt-6 columns-1 gap-x-8 font-sans text-sm leading-relaxed text-[#4a3d35] sm:columns-2">
                  {DIETARY_BADGES.map((badge) => (
                    <li key={badge} className="break-inside-avoid py-1">
                      <span className="mr-2 text-[hsl(var(--primary))]">·</span>
                      {badge}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:border-l lg:border-[hsla(220,14%,12%,0.12)] lg:pl-10">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[hsl(var(--primary))]" />
                  <h3 className="text-xl font-semibold tracking-tight text-[#2d1e18] sm:text-2xl">Good to know</h3>
                </div>
                <div className="mt-6 space-y-4">
                  {CATERING_NOTES.map((note) => (
                    <p key={note} className="text-sm leading-7 text-[#6d5748]">
                      {note}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="inquire"
        className="anchor-section bg-background py-16 sm:py-20"
      >
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr]">
            <div>
              <div className="section-kicker">Request Catering</div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[hsl(var(--foreground))] sm:text-4xl">
                Tell us what you&apos;re planning.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-[#6d5748]">
                Share the date, guest count, and event details. We&apos;ll help
                you narrow the right mix of buffet packages, trays, platters,
                desserts, beverages, and extras.
              </p>
              <p className="mt-3 max-w-xl text-sm leading-7 text-[#6d5748]">
                {CATERING_HELPER_TEXT}
              </p>

              <div className="mt-8 space-y-6 border-l-2 border-[hsl(var(--primary))]/35 pl-5">
                <a
                  href={BUSINESS_INFO.phoneHref}
                  className="group block transition-colors"
                >
                  <div className="flex items-start gap-3 text-[#2d1e18]">
                    <Phone className="mt-0.5 h-5 w-5 shrink-0 text-[hsl(var(--primary))] transition group-hover:opacity-90" />
                    <div>
                      <p className="font-sans text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-[#8b6f5c]">
                        Phone
                      </p>
                      <p className="mt-1 text-lg font-semibold transition group-hover:text-[hsl(var(--primary))]">
                        Call the restaurant
                      </p>
                      <p className="mt-0.5 text-sm text-[#6d5748]">{BUSINESS_INFO.phone}</p>
                    </div>
                  </div>
                </a>
                <a
                  href={BUSINESS_INFO.emailHref}
                  className="group block border-t border-[hsla(220,14%,12%,0.08)] pt-6 transition-colors"
                >
                  <div className="flex items-start gap-3 text-[#2d1e18]">
                    <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[hsl(var(--primary))] transition group-hover:opacity-90" />
                    <div>
                      <p className="font-sans text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-[#8b6f5c]">
                        Email
                      </p>
                      <p className="mt-1 text-lg font-semibold transition group-hover:text-[hsl(var(--primary))]">
                        Email the team
                      </p>
                      <p className="mt-0.5 text-sm text-[#6d5748]">{BUSINESS_INFO.email}</p>
                    </div>
                  </div>
                </a>
                <p className="border-t border-[hsla(220,14%,12%,0.08)] pt-6 text-sm italic leading-relaxed text-[#6d5748]">
                  Include the event date, guest count, pickup or delivery preference, and dietary notes so the first reply can be specific.
                </p>
              </div>
            </div>

            <div className="rounded-[1.5rem] bg-gradient-to-br from-[hsl(43_55%_99%)] via-[hsl(220_20%_98%)] to-[hsl(220_16%_96%)] p-6 shadow-[0_28px_70px_-48px_rgba(15,23,42,0.2)] ring-1 ring-[hsla(220,14%,12%,0.06)] md:p-9">
              {submitted ? (
                <div className="rounded-[1.7rem] border border-emerald-200 bg-emerald-50 p-8 text-center">
                  <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" />
                  <h3 className="mt-5 text-2xl text-[#2d1e18]">
                    Your inquiry draft is ready.
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[#6d5748]">
                    Your email app should now be open with the event details
                    filled in. If it did not open, you can call or email the
                    team directly.
                  </p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <Button variant="outline" className="rounded-full" asChild>
                      <a href={BUSINESS_INFO.phoneHref}>
                        Call {BUSINESS_INFO.phone}
                      </a>
                    </Button>
                    <Button
                      className="rounded-full bg-[hsl(var(--primary))] text-white hover:opacity-90"
                      asChild
                    >
                      <a href={BUSINESS_INFO.emailHref}>Email directly</a>
                    </Button>
                  </div>
                </div>
              ) : (
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <p className="font-sans text-xs leading-relaxed tracking-wide text-[#6d5748]">
                      <span className="font-semibold text-[hsl(var(--foreground))]">Inquiry flow:</span>{" "}
                      event basics → service preferences → notes, then send your draft.
                    </p>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company / organization</FormLabel>
                            <FormControl>
                              <Input
                                className="h-11 rounded-xl border-[rgba(79,50,34,0.12)] bg-[#fbf6ef] px-4 shadow-none"
                                placeholder="Company, team, or family name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="contactName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact name</FormLabel>
                            <FormControl>
                              <Input
                                className="h-11 rounded-xl border-[rgba(79,50,34,0.12)] bg-[#fbf6ef] px-4 shadow-none"
                                placeholder="Your full name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                className="h-11 rounded-xl border-[rgba(79,50,34,0.12)] bg-[#fbf6ef] px-4 shadow-none"
                                placeholder="you@company.ca"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input
                                type="tel"
                                className="h-11 rounded-xl border-[rgba(79,50,34,0.12)] bg-[#fbf6ef] px-4 shadow-none"
                                placeholder="(905) 555-5555"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="eventDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Event date</FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                className="h-11 rounded-xl border-[rgba(79,50,34,0.12)] bg-[#fbf6ef] px-4 shadow-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="guestCount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Guest count</FormLabel>
                            <FormControl>
                              <Input
                                className="h-11 rounded-xl border-[rgba(79,50,34,0.12)] bg-[#fbf6ef] px-4 shadow-none"
                                placeholder="Approximate number of guests"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="eventType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Event type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-11 rounded-xl border-[rgba(79,50,34,0.12)] bg-[#fbf6ef] px-4 shadow-none">
                                  <SelectValue placeholder="Select event type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="office-lunch">
                                  Office lunch
                                </SelectItem>
                                <SelectItem value="meeting">
                                  Meeting or training
                                </SelectItem>
                                <SelectItem value="family-event">
                                  Family event
                                </SelectItem>
                                <SelectItem value="corporate-event">
                                  Corporate event
                                </SelectItem>
                                <SelectItem value="celebration">
                                  Celebration
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="deliveryType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pickup or delivery</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-11 rounded-xl border-[rgba(79,50,34,0.12)] bg-[#fbf6ef] px-4 shadow-none">
                                  <SelectValue placeholder="Select pickup or delivery" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="pickup">Pickup</SelectItem>
                                <SelectItem value="delivery">
                                  Delivery
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Event notes</FormLabel>
                          <FormControl>
                            <Textarea
                              className="min-h-[150px] rounded-2xl border-[rgba(79,50,34,0.12)] bg-[#fbf6ef] px-4 py-3 shadow-none"
                              placeholder="Tell us about menu preferences, timing, dietary needs, setup details, or anything else that would help."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full rounded-full bg-[hsl(var(--primary))] text-white hover:opacity-90"
                    >
                      Start Catering Inquiry
                    </Button>
                  </form>
                </Form>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[rgba(26,18,14,0.08)] bg-[hsl(33,28%,90%)] py-12">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex flex-col gap-6 rounded-2xl bg-[hsl(var(--muted))]/55 p-8 ring-1 ring-[hsla(220,14%,12%,0.06)] sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="section-kicker">Weekday lunch</p>
              <h2 className="mt-2 font-sans text-2xl text-[#1c120e] sm:text-3xl">
                Takeout orders use the main menu.
              </h2>
              <p className="mt-2 max-w-xl font-sans text-sm text-[hsl(var(--muted-foreground))]">
                Catering stays here; sandwiches and pasta for one stay on the
                takeout menu.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:items-end">
              <Button
                className="rounded-md bg-[hsl(var(--secondary))] font-sans text-white hover:opacity-95"
                asChild
              >
                <Link href="/menu">Open takeout menu</Link>
              </Button>
              <Button
                variant="outline"
                className="rounded-md border-[rgba(36,24,18,0.12)] bg-white font-sans"
                asChild
              >
                <a href={BUSINESS_INFO.phoneHref}>Call the kitchen</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
