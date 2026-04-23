import { useMemo } from "react";
import { Link } from "wouter";
import { MenuItem, useListMenuItems } from "@workspace/api-client-react";
import {
  ArrowRight,
  Clock,
  Minus,
  Phone,
  Plus,
  ShoppingBag,
} from "lucide-react";
import { Layout } from "@/components/layout";
import { Hero } from "@/components/sections/hero";
import { Section } from "@/components/sections/section";
import { StickySectionNav } from "@/components/sticky-section-nav";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { MAIN_MENU_SECTIONS, StaticMenuItem } from "@/content/menu";
import { BUSINESS_INFO, SITE_IMAGES } from "@/content/site";
import {
  breadcrumbStructuredData,
  restaurantStructuredData,
  useSeo,
} from "@/lib/seo";
import { cn } from "@/lib/utils";

function formatPrice(staticPrice: string, liveItem?: MenuItem) {
  if (!liveItem) return staticPrice;
  return `$${Number(liveItem.price).toFixed(2)}`;
}

type OrderControlsProps = {
  liveItem?: MenuItem;
  quantity: number;
  onAdd: (item: MenuItem) => void;
  onIncrement: (item: MenuItem) => void;
  onDecrement: (item: MenuItem) => void;
};

function OrderControls({
  liveItem,
  quantity,
  onAdd,
  onIncrement,
  onDecrement,
}: OrderControlsProps) {
  if (!liveItem) return null;

  if (!quantity) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="h-8 rounded border border-[rgba(36,24,18,0.12)] bg-white px-2.5 font-sans text-xs font-semibold text-[#2a1f19] hover:bg-[#f4ebe3]"
        onClick={() => onAdd(liveItem)}
      >
        <ShoppingBag className="mr-1 h-3 w-3" />
        Add
      </Button>
    );
  }

  return (
    <div className="inline-flex items-center rounded border border-[rgba(36,24,18,0.12)] bg-[#f4ebe3]">
      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center text-[#6b4434] hover:bg-[#e8d9cf]"
        onClick={() => onDecrement(liveItem)}
        aria-label={`Decrease quantity for ${liveItem.name}`}
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="min-w-[2rem] text-center font-sans text-xs font-semibold text-[#2a1f19]">
        {quantity}
      </span>
      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center text-[#6b4434] hover:bg-[#e8d9cf]"
        onClick={() => onIncrement(liveItem)}
        aria-label={`Increase quantity for ${liveItem.name}`}
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

type MenuRowProps = {
  item: StaticMenuItem;
  liveItem?: MenuItem;
  quantity: number;
  onAdd: (item: MenuItem) => void;
  onIncrement: (item: MenuItem) => void;
  onDecrement: (item: MenuItem) => void;
  compact?: boolean;
  showDescription?: boolean;
};

function MenuRow({
  item,
  liveItem,
  quantity,
  onAdd,
  onIncrement,
  onDecrement,
  compact = false,
  showDescription = true,
}: MenuRowProps) {
  const price = formatPrice(item.price, liveItem);
  return (
    <div
      className={cn(
        "group flex gap-3 border-b border-[rgba(36,24,18,0.07)] last:border-b-0 sm:gap-4",
        compact
          ? "flex-col gap-1.5 px-4 py-2.5 sm:flex-row sm:items-end sm:justify-between sm:gap-4 sm:px-5 sm:py-3"
          : "px-5 py-3.5 sm:px-6 sm:py-4",
      )}
    >
      <div className="min-w-0 flex-1">
        <div
          className={cn(
            "flex min-w-0 gap-2",
            compact
              ? "flex-col sm:flex-row sm:items-baseline sm:justify-between sm:gap-3"
              : "items-end",
          )}
        >
          <h3
            className={cn(
              "min-w-0 font-sans font-semibold tracking-tight text-[hsl(var(--foreground))]",
              compact
                ? "text-[1.02rem] sm:max-w-[min(32rem,72%)]"
                : "text-[1.07rem] sm:text-[1.11rem]",
            )}
          >
            {item.name}
          </h3>
          {compact ? null : (
            <span
              className="mb-[0.32rem] min-h-px min-w-[0.5rem] flex-1 border-b border-dotted border-[rgba(36,24,18,0.22)]"
              aria-hidden
            />
          )}
          <span
            className={cn(
              "shrink-0 font-sans text-base font-semibold tabular-nums text-[hsl(var(--foreground))] sm:text-[1.05rem]",
              compact && "text-left sm:text-right",
            )}
          >
            {price}
          </span>
        </div>
        {item.featured ? (
          <span className="mt-1 inline-block font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-[hsl(var(--primary))]">
            House favourite
          </span>
        ) : null}
        {showDescription && item.description ? (
          <p
            className={cn(
              "mt-1 font-sans leading-snug text-[hsl(var(--muted-foreground))]",
              compact ? "text-[12px]" : "text-sm",
            )}
          >
            {item.description}
          </p>
        ) : null}
      </div>
      <div className="flex shrink-0 flex-col justify-end pb-0.5">
        <OrderControls
          liveItem={liveItem}
          quantity={quantity}
          onAdd={onAdd}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
        />
      </div>
    </div>
  );
}

function AddOnGrid({
  title,
  items,
}: {
  title: string;
  items: StaticMenuItem[];
}) {
  return (
    <div>
      <p className="section-kicker mb-4">{title}</p>
      <div className="menu-list-rail max-w-xl">
        {items.map((entry) => (
          <div
            key={entry.name}
            className="group flex items-start justify-between gap-4 py-3.5 first:pt-0"
          >
            <div className="min-w-0">
              <p className="font-sans text-sm font-semibold text-[hsl(var(--foreground))]">{entry.name}</p>
              <p className="mt-0.5 font-sans text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">
                {entry.description}
              </p>
            </div>
            <p className="shrink-0 font-sans text-sm font-semibold tabular-nums text-[hsl(var(--foreground))]">
              {entry.price}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function getSection(id: string) {
  return MAIN_MENU_SECTIONS.find((section) => section.id === id);
}

function SectionIntro({
  eyebrow,
  title,
  description,
  note,
  accent,
  tightBelow,
  relaxed,
  lead,
}: {
  eyebrow: string;
  title: string;
  description: string;
  note?: string;
  /** Alternate rail colour for visual pacing between long sections */
  accent?: boolean;
  /** Tighter gap from intro to first list row */
  tightBelow?: boolean;
  /** Extra breathing room before the list (long sections) */
  relaxed?: boolean;
  /** First section on page — slightly stronger hierarchy without new chrome */
  lead?: boolean;
}) {
  return (
    <header
      className={cn(
        "max-w-2xl pl-4 sm:pl-5",
        lead ? "border-l-4" : "border-l-[3px]",
        tightBelow ? "mb-5 sm:mb-6" : relaxed ? "mb-9 sm:mb-11" : "mb-7 sm:mb-9",
        accent
          ? "border-[hsl(152_48%_30%)]"
          : "border-[hsl(var(--primary))]",
      )}
    >
      <p className="section-kicker">{eyebrow}</p>
      <h2
        className={cn(
          "mt-2 font-sans font-semibold tracking-tight text-[hsl(var(--foreground))]",
          lead
            ? "text-[clamp(1.28rem,2.85vw,1.92rem)] leading-[1.14]"
            : "text-2xl sm:text-[1.85rem]",
        )}
      >
        {title}
      </h2>
      <p className="mt-2.5 max-w-[min(38rem,100%)] font-sans text-sm leading-relaxed text-[hsl(var(--muted-foreground))] sm:text-[0.97rem]">
        {description}
      </p>
      {note ? (
        <p className="mt-2 font-sans text-xs text-[hsl(152_28%_30%)] sm:text-sm">
          {note}
        </p>
      ) : null}
    </header>
  );
}

export default function Menu() {
  const { data: menuItems } = useListMenuItems(
    { available: true },
    { query: { queryKey: ["menu-page-live-items", { available: true }] } },
  );
  const { addItem, items, updateQuantity, removeItem } = useCart();

  useSeo({
    title:
      "Menu — Skymark Eatery by Caffe E Pranzo | Italian Lunch & Takeout, Mississauga",
    description:
      "Weekday Italian takeout menu on Skymark Ave, Mississauga (near Pearson): breakfast, sandwiches, salads, pizza, pasta, and sides. Order pickup online when available or call the kitchen. For trays and buffets, use the catering page.",
    path: "/menu",
    image: SITE_IMAGES.shareMenu,
    imageAlt: SITE_IMAGES.shareMenuAlt,
    structuredData: [
      restaurantStructuredData(),
      breadcrumbStructuredData([
        { name: "Home", path: "/" },
        { name: "Menu", path: "/menu" },
      ]),
    ],
  });

  const safeItems = Array.isArray(menuItems) ? menuItems : [];

  const liveItemMap = useMemo(
    () => new Map(safeItems.map((entry) => [entry.name.toLowerCase(), entry])),
    [safeItems],
  );

  const menuSectionNavItems = useMemo(
    () =>
      MAIN_MENU_SECTIONS.map((section) => ({
        id: section.id,
        label: section.shortLabel,
      })),
    [],
  );

  const getLiveItem = (name: string) => liveItemMap.get(name.toLowerCase());
  const getCartQuantity = (itemId?: number) =>
    items.find((entry) => entry.menuItem.id === itemId)?.quantity ?? 0;

  const handleAdd = (item: MenuItem) => addItem(item);
  const handleIncrement = (item: MenuItem) =>
    updateQuantity(item.id, getCartQuantity(item.id) + 1);
  const handleDecrement = (item: MenuItem) => {
    const quantity = getCartQuantity(item.id);
    if (quantity <= 1) {
      removeItem(item.id);
      return;
    }
    updateQuantity(item.id, quantity - 1);
  };

  const onlineOrderingReady = safeItems.length > 0;

  const breakfast = getSection("breakfast");
  const sandwiches = getSection("sandwiches");
  const salads = getSection("salads");
  const sides = getSection("sides");
  const pizza = getSection("pizza");
  const pasta = getSection("pasta");

  const mostOrdered = useMemo(() => {
    const picks: { section: string; item: StaticMenuItem }[] = [];
    for (const section of MAIN_MENU_SECTIONS) {
      for (const entry of section.items ?? []) {
        if (entry.featured) picks.push({ section: section.shortLabel, item: entry });
      }
      for (const group of section.pastaGroups ?? []) {
        for (const entry of group.items) {
          if (entry.featured) picks.push({ section: section.shortLabel, item: entry });
        }
      }
      for (const entry of section.signatureItems ?? []) {
        if (entry.featured) picks.push({ section: section.shortLabel, item: entry });
      }
    }
    return picks.slice(0, 5);
  }, []);

  if (!breakfast || !sandwiches || !salads || !sides || !pizza || !pasta) {
    return (
      <Layout>
        <Section tone="light" className="py-20">
          <p className="text-[hsl(var(--muted-foreground))]">
            The menu is temporarily unavailable. Please call{" "}
            <a className="font-semibold text-[hsl(var(--primary))]" href={BUSINESS_INFO.phoneHref}>
              {BUSINESS_INFO.phone}
            </a>{" "}
            to order.
          </p>
        </Section>
      </Layout>
    );
  }

  return (
    <Layout>
      <Hero
        className="menu-page-hero"
        density="interior"
        contentClassName="lg:max-w-[min(30rem,92vw)]"
        eyebrow="Skymark Ave takeout · weekday only"
        title="Italian lunch you can actually order before the meeting starts."
        subtitle={`Breakfast through pasta from the Skymark Ave line. ${
          onlineOrderingReady
            ? "Add items where offered, or call for same-day help."
            : "Browse here, then call the kitchen to order."
        }`}
        imageSrc={SITE_IMAGES.menuHero}
        imageAlt={SITE_IMAGES.menuHeroAlt}
        imageClassName="media-crop-menu-hero"
        primaryCta={{ label: "Call to order", href: BUSINESS_INFO.phoneHref }}
        secondaryCta={{ label: "Catering", href: "/catering" }}
        infoLine={
          <span className="inline-flex flex-wrap items-center gap-2">
            <Clock className="h-4 w-4 shrink-0 text-[hsl(152_30%_32%)]" />
            <span>
              Mon–Fri · 7:30a–4:30p · {BUSINESS_INFO.addressLine1}
            </span>
          </span>
        }
      />

      <StickySectionNav
        label="Menu sections"
        items={menuSectionNavItems}
        cta={
          <a
            href={BUSINESS_INFO.phoneHref}
            className="whitespace-nowrap font-sans text-[11px] font-semibold text-[hsl(var(--primary))] underline decoration-[hsl(var(--primary))]/25 underline-offset-2 transition hover:decoration-[hsl(var(--primary))]"
          >
            {BUSINESS_INFO.phone}
          </a>
        }
      />

      <div className="border-b border-[hsla(32,14%,12%,0.07)] bg-gradient-to-b from-[hsl(40_34%_97%)] to-[hsl(43_30%_98%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
        <div className="container mx-auto flex max-w-6xl flex-col gap-3.5 px-4 py-[0.95rem] sm:flex-row sm:items-center sm:justify-between sm:py-4">
          <p className="font-sans text-xs leading-relaxed text-[hsl(var(--muted-foreground))] sm:text-sm">
            <span className="font-semibold text-[hsl(var(--foreground))]">Takeout below</span>
            {" · "}
            Trays and buffets on{" "}
            <Link
              href="/catering"
              className="font-semibold text-[hsl(var(--primary))] underline decoration-[hsl(var(--primary))]/30 underline-offset-2 transition hover:decoration-[hsl(var(--primary))]"
            >
              catering
            </Link>
            .
          </p>
          <Link
            href="/catering"
            className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-[hsla(32,16%,12%,0.11)] bg-white px-3.5 py-2 font-sans text-xs font-semibold text-[hsl(var(--foreground))] shadow-sm transition hover:border-[hsl(var(--primary))]/45 hover:shadow-md hover:text-[hsl(var(--primary))] active:scale-[0.99]"
          >
            Open catering
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      </div>

      <section className="border-t border-[hsla(220,14%,12%,0.05)] bg-[hsl(var(--background))] py-11 sm:py-14">
        <div className="container mx-auto max-w-6xl space-y-11 px-4 sm:space-y-[3.15rem] lg:space-y-[4.5rem]">
          {mostOrdered.length > 0 ? (
            <div className="anchor-section -mt-4 sm:-mt-6">
              <div className="flex items-baseline justify-between gap-3">
                <div>
                  <p className="font-sans text-[0.62rem] font-semibold uppercase tracking-[0.26em] text-[hsl(var(--primary))]">
                    Most ordered this week
                  </p>
                  <p className="mt-1 font-sans text-xs text-[hsl(var(--muted-foreground))]">
                    The five plates the Skymark counter runs most on a weekday.
                  </p>
                </div>
              </div>
              <ul className="mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-3 sm:overflow-visible sm:pb-0 lg:grid-cols-5">
                {mostOrdered.map(({ section, item: entry }) => (
                  <li
                    key={entry.name}
                    className="flex min-w-[14rem] snap-start flex-col rounded-lg border border-[hsla(32,14%,12%,0.1)] bg-white p-3.5 sm:min-w-0"
                  >
                    <p className="font-sans text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">
                      {section}
                    </p>
                    <p className="mt-1.5 font-sans text-sm font-semibold leading-snug text-[hsl(var(--foreground))]">
                      {entry.name}
                    </p>
                    <p className="mt-auto pt-2 font-sans text-sm font-semibold tabular-nums text-[hsl(var(--primary))]">
                      {entry.price}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <section id={breakfast.id} className="anchor-section">
            <SectionIntro
              eyebrow={breakfast.eyebrow}
              title={breakfast.title}
              description={breakfast.description}
              note={breakfast.note}
              accent={false}
              tightBelow
              lead
            />
            <div className="menu-list-rail overflow-hidden transition-[box-shadow] duration-300">
              {(breakfast.items ?? []).map((entry) => {
                const liveItem = getLiveItem(entry.name);
                return (
                  <MenuRow
                    key={entry.name}
                    item={entry}
                    liveItem={liveItem}
                    quantity={getCartQuantity(liveItem?.id)}
                    onAdd={handleAdd}
                    onIncrement={handleIncrement}
                    onDecrement={handleDecrement}
                    compact
                    showDescription={entry.featured}
                  />
                );
              })}
            </div>
          </section>

          <section
            id={sandwiches.id}
            className="anchor-section border-t border-[hsla(220,14%,12%,0.09)] pt-11 sm:pt-14 lg:pt-[3.55rem]"
          >
            <SectionIntro
              eyebrow={sandwiches.eyebrow}
              title={sandwiches.title}
              description={sandwiches.description}
              accent
              tightBelow
              relaxed
            />
            <div className="menu-list-shelf overflow-hidden pl-2 transition-[box-shadow] duration-300 sm:pl-4">
              {sandwiches.items?.map((entry) => {
                const liveItem = getLiveItem(entry.name);
                return (
                  <MenuRow
                    key={entry.name}
                    item={entry}
                    liveItem={liveItem}
                    quantity={getCartQuantity(liveItem?.id)}
                    onAdd={handleAdd}
                    onIncrement={handleIncrement}
                    onDecrement={handleDecrement}
                    showDescription={entry.featured}
                  />
                );
              })}
            </div>
            {sandwiches.addOns && sandwiches.addOnsTitle ? (
              <div className="mt-8 max-w-3xl">
                <AddOnGrid
                  title={sandwiches.addOnsTitle}
                  items={sandwiches.addOns}
                />
              </div>
            ) : null}
          </section>

          <section
            id={salads.id}
            className="anchor-section border-t border-[hsla(220,14%,12%,0.09)] pt-11 sm:pt-14 lg:pt-[3.25rem]"
          >
            <SectionIntro
              eyebrow={salads.eyebrow}
              title={salads.title}
              description={salads.description}
              accent={false}
              tightBelow
            />
            <div className="menu-list-shelf max-w-3xl overflow-hidden pl-2 transition-[box-shadow] duration-300 sm:pl-4">
              {salads.items?.map((entry) => {
                const liveItem = getLiveItem(entry.name);
                return (
                  <MenuRow
                    key={entry.name}
                    item={entry}
                    liveItem={liveItem}
                    quantity={getCartQuantity(liveItem?.id)}
                    onAdd={handleAdd}
                    onIncrement={handleIncrement}
                    onDecrement={handleDecrement}
                    compact
                    showDescription={false}
                  />
                );
              })}
            </div>
            {salads.addOns && salads.addOnsTitle ? (
              <div className="mt-6 max-w-xl">
                <AddOnGrid title={salads.addOnsTitle} items={salads.addOns} />
              </div>
            ) : null}
          </section>

          <section
            id={sides.id}
            className="anchor-section border-t border-[hsla(220,14%,12%,0.09)] pt-11 sm:pt-14 lg:pt-[3.25rem]"
          >
            <SectionIntro
              eyebrow={sides.eyebrow}
              title={sides.title}
              description={sides.description}
              accent
              tightBelow
            />
            <div className="menu-list-shelf max-w-3xl overflow-hidden pl-2 transition-[box-shadow] duration-300 sm:pl-4">
              {sides.items?.map((entry) => {
                const liveItem = getLiveItem(entry.name);
                return (
                  <MenuRow
                    key={entry.name}
                    item={entry}
                    liveItem={liveItem}
                    quantity={getCartQuantity(liveItem?.id)}
                    onAdd={handleAdd}
                    onIncrement={handleIncrement}
                    onDecrement={handleDecrement}
                    compact
                    showDescription={false}
                  />
                );
              })}
            </div>
          </section>

          <section
            id={pizza.id}
            className="anchor-section border-t border-[hsla(220,14%,12%,0.09)] pt-11 sm:pt-14 lg:pt-[3.45rem]"
          >
            <SectionIntro
              eyebrow={pizza.eyebrow}
              title={pizza.title}
              description={pizza.description}
              accent={false}
              tightBelow
            />
            <div className="menu-list-rail max-w-3xl pl-0 transition-[box-shadow] duration-300 sm:pl-1">
              {pizza.items?.map((entry) => {
                const liveItem = getLiveItem(entry.name);
                return (
                  <MenuRow
                    key={entry.name}
                    item={entry}
                    liveItem={liveItem}
                    quantity={getCartQuantity(liveItem?.id)}
                    onAdd={handleAdd}
                    onIncrement={handleIncrement}
                    onDecrement={handleDecrement}
                    compact
                    showDescription={entry.featured}
                  />
                );
              })}
            </div>
            {pizza.addOns && pizza.addOnsTitle ? (
              <div className="mt-8 max-w-3xl space-y-3">
                <AddOnGrid title={pizza.addOnsTitle} items={pizza.addOns} />
                <p className="font-sans text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">
                  Party-size pies stay easy for office drops — ask when you call
                  if you need timing help.
                </p>
              </div>
            ) : null}
          </section>

          <section
            id={pasta.id}
            className="anchor-section border-t border-[hsla(220,14%,12%,0.09)] pt-11 sm:pt-14 lg:pt-[3.28rem]"
          >
            <div className="max-w-3xl border-l-2 border-[hsl(var(--primary))]/16 pl-3 sm:pl-5">
              <SectionIntro
                eyebrow={pasta.eyebrow}
                title={pasta.title}
                description={pasta.description}
                note={pasta.note}
                accent
                tightBelow
              />
              <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-2">
                {pasta.pastaGroups?.map((group) => (
                  <div
                    key={group.title}
                    className="overflow-hidden rounded-xl bg-[hsl(43_42%_98%)] shadow-[0_22px_52px_-42px_rgba(15,23,42,0.14)] ring-1 ring-[hsla(220,14%,12%,0.06)]"
                  >
                    <div className="border-b border-[hsla(220,14%,12%,0.1)] bg-[hsl(220_32%_12%)] px-4 py-2.5 sm:px-5 sm:py-3">
                      <p className="font-sans text-[0.55rem] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--primary))]">
                        Build your bowl
                      </p>
                      <h3 className="mt-0.5 font-sans text-base font-semibold tracking-tight text-white sm:text-[1.05rem]">
                        {group.title}
                      </h3>
                    </div>
                    <div className="divide-y divide-[hsla(220,14%,12%,0.08)]">
                      {group.items.map((entry) => {
                        const liveItem = getLiveItem(entry.name);
                        return (
                          <MenuRow
                            key={entry.name}
                            item={entry}
                            liveItem={liveItem}
                            quantity={getCartQuantity(liveItem?.id)}
                            onAdd={handleAdd}
                            onIncrement={handleIncrement}
                            onDecrement={handleDecrement}
                            compact
                            showDescription={false}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {pasta.signatureItems ? (
                <div className="mt-10 border-t border-[rgba(36,24,18,0.08)] pt-8">
                  <p className="section-kicker">Signature plates</p>
                  <p className="mt-2 max-w-xl font-sans text-sm text-[hsl(var(--muted-foreground))]">
                    Fuller plates when you do not want to build a custom pasta
                    bowl.
                  </p>
                  <div className="menu-list-shelf mt-5 max-w-2xl">
                    {pasta.signatureItems.map((entry) => {
                      const liveItem = getLiveItem(entry.name);
                      return (
                        <MenuRow
                          key={entry.name}
                          item={entry}
                          liveItem={liveItem}
                          quantity={getCartQuantity(liveItem?.id)}
                          onAdd={handleAdd}
                          onIncrement={handleIncrement}
                          onDecrement={handleDecrement}
                        />
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </section>

      <Section tone="muted" density="snug" className="border-t border-[rgba(26,18,14,0.08)]">
        <div>
          <div className="flex flex-col gap-6 rounded-2xl bg-[hsl(var(--muted))]/50 p-8 ring-1 ring-[hsla(220,14%,12%,0.06)] sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="section-kicker">Larger orders</p>
              <h2 className="mt-2 font-sans text-2xl font-semibold text-[hsl(var(--foreground))] sm:text-3xl">
                Trays, platters, and buffets stay on catering.
              </h2>
              <p className="mt-2 max-w-xl font-sans text-sm text-[hsl(var(--muted-foreground))]">
                One place for appetizers through dessert, with per-person
                packages when that fits your event.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:items-end">
              <Button className="rounded-md font-sans" asChild>
                <Link href="/catering">
                  Catering menu
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                className="rounded-md border-[rgba(36,24,18,0.12)] bg-white font-sans"
                asChild
              >
                <a href={BUSINESS_INFO.phoneHref}>
                  <Phone className="mr-2 h-4 w-4" />
                  {BUSINESS_INFO.phone}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </Layout>
  );
}
