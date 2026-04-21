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
  Truck,
} from "lucide-react";
import { Layout } from "@/components/layout";
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

function splitItems(items: StaticMenuItem[]) {
  if (items.length <= 6) return [items];

  const midpoint = Math.ceil(items.length / 2);
  return [items.slice(0, midpoint), items.slice(midpoint)];
}

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
        className="rounded-full border-[rgba(45,30,24,0.12)] bg-white px-3 text-[#2d1e18]"
        onClick={() => onAdd(liveItem)}
      >
        <ShoppingBag className="h-3.5 w-3.5" />
        Add
      </Button>
    );
  }

  return (
    <div className="inline-flex items-center rounded-full border border-[rgba(139,79,57,0.16)] bg-[#f8ece5]">
      <button
        className="flex h-8 w-8 items-center justify-center rounded-l-full text-[#8b4f39] hover:bg-[#8b4f39] hover:text-white"
        onClick={() => onDecrement(liveItem)}
        aria-label={`Decrease quantity for ${liveItem.name}`}
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="w-8 text-center text-sm font-semibold text-[#8b4f39]">
        {quantity}
      </span>
      <button
        className="flex h-8 w-8 items-center justify-center rounded-r-full text-[#8b4f39] hover:bg-[#8b4f39] hover:text-white"
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
  return (
    <div
      className={
        compact
          ? "grid gap-3 px-4 py-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
          : "grid gap-4 px-5 py-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-start"
      }
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3
            className={
              compact
                ? "text-base font-semibold text-[#2d1e18]"
                : "text-lg font-semibold leading-tight text-[#2d1e18]"
            }
          >
            {item.name}
          </h3>
          {item.featured && (
            <span className="rounded-full border border-[rgba(139,79,57,0.16)] bg-[#f8ece5] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8b4f39]">
              Popular
            </span>
          )}
        </div>
        {showDescription && (
          <p
            className={
              compact
                ? "mt-1 text-xs leading-5 text-[#7a6658]"
                : "mt-2 max-w-2xl text-sm leading-6 text-[#6d5748]"
            }
          >
            {item.description}
          </p>
        )}
      </div>

      <div
        className={
          compact
            ? "flex items-center justify-between gap-4 md:justify-end"
            : "flex items-center justify-between gap-4 md:flex-col md:items-end"
        }
      >
        <div className="whitespace-nowrap text-base font-semibold text-[#2d1e18]">
          {formatPrice(item.price, liveItem)}
        </div>
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
    <div className="rounded-[1.8rem] border border-[rgba(79,50,34,0.08)] bg-[#f8f2ea] p-5">
      <div className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#8b5f48]">
        {title}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {items.map((entry) => (
          <div
            key={entry.name}
            className="flex items-start justify-between gap-4 border-b border-[rgba(79,50,34,0.08)] pb-3 last:border-b-0 last:pb-0"
          >
            <div>
              <div className="text-sm font-semibold text-[#2d1e18]">
                {entry.name}
              </div>
              <p className="mt-1 text-xs leading-5 text-[#6d5748]">
                {entry.description}
              </p>
            </div>
            <div className="whitespace-nowrap text-sm font-semibold text-[#2d1e18]">
              {entry.price}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getSection(id: string) {
  return MAIN_MENU_SECTIONS.find((section) => section.id === id);
}

export default function Menu() {
  const { data: menuItems } = useListMenuItems(
    { available: true },
    { query: { queryKey: ["menu-page-live-items", { available: true }] } },
  );
  const { addItem, items, updateQuantity, removeItem } = useCart();

  useSeo({
    title:
      "Skymark Eatery by Caffe E Pranzo Menu | Italian Takeout & Lunch in Mississauga",
    description:
      "Browse the Skymark Eatery by Caffe E Pranzo menu in Mississauga, with breakfast, sandwiches, salads, pasta, pizza, rice balls, and weekday lunch favourites.",
    path: "/menu",
    image: SITE_IMAGES.og,
    imageAlt: SITE_IMAGES.ogImageAlt,
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

  if (!breakfast || !sandwiches || !salads || !sides || !pizza || !pasta) {
    return null;
  }

  return (
    <Layout>
      <section className="relative overflow-hidden border-b border-black/5 bg-[#2d1e18] text-white">
        <div className="absolute inset-0">
          <img
            src={SITE_IMAGES.menuHero}
            alt="Chicken pasta lunch special from Skymark Eatery"
            className="h-full w-full object-cover opacity-22"
          />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(24,15,11,0.94),rgba(45,30,24,0.88)_52%,rgba(120,70,47,0.68))]" />
        </div>

        <div className="relative container mx-auto px-4 py-14 sm:py-18 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-end">
            <div className="max-w-3xl">
              <div className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#dfc2b1]">
                Main Menu
              </div>
              <h1 className="mt-4 text-5xl leading-[0.96] text-white sm:text-6xl">
                Breakfast, lunch, and takeout in one clean menu.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/76 sm:text-lg">
                Browse the everyday menu with breakfast staples, hot sandwiches,
                salads, rice balls, pizza, pasta, and weekday lunch favourites
                laid out for faster scanning.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button
                  size="lg"
                  className="rounded-full bg-[#8b4f39] px-7 text-white hover:bg-[#75412f]"
                  asChild
                >
                  <a href={BUSINESS_INFO.phoneHref}>Call to Order</a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-white/14 bg-white/7 px-7 text-white hover:bg-white/10"
                  asChild
                >
                  <Link href="/catering">Need Catering Instead?</Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_170px]">
              <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/8 shadow-[0_24px_54px_rgba(0,0,0,0.2)] backdrop-blur-sm">
                <img
                  src={SITE_IMAGES.menuHero}
                  alt="Daily special from Skymark Eatery"
                  className="h-full min-h-[320px] w-full object-cover"
                />
              </div>
              <div className="grid gap-4">
                <div className="rounded-[1.6rem] border border-white/10 bg-white/8 p-5 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-sm font-medium text-white/68">
                    <Truck className="h-4 w-4 text-[#f1caa9]" />
                    Pickup
                  </div>
                  <p className="mt-3 text-sm leading-6 text-white/78">
                    {onlineOrderingReady
                      ? "Use the add buttons on supported items or call the restaurant for quick pickup help."
                      : "Browse the menu here, then call the restaurant for same-day ordering and availability."}
                  </p>
                </div>
                <div className="rounded-[1.6rem] border border-white/10 bg-white/8 p-5 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-sm font-medium text-white/68">
                    <Clock className="h-4 w-4 text-[#f1caa9]" />
                    Hours
                  </div>
                  <p className="mt-3 text-base font-semibold text-white">
                    Monday to Friday
                  </p>
                  <p className="mt-1 text-sm text-white/72">
                    7:30 AM to 4:30 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <StickySectionNav
        label="Jump to"
        items={MAIN_MENU_SECTIONS.map((section) => ({
          id: section.id,
          label: section.shortLabel,
        }))}
        cta={
          <Button
            size="sm"
            className="rounded-full bg-[#8b4f39] text-white hover:bg-[#75412f]"
            asChild
          >
            <a href={BUSINESS_INFO.phoneHref}>Call {BUSINESS_INFO.phone}</a>
          </Button>
        }
      />

      <section className="border-b border-[rgba(79,50,34,0.08)] bg-background py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-3 rounded-[1.7rem] border border-[rgba(79,50,34,0.08)] bg-[#fbf6ef] px-5 py-4 text-sm leading-7 text-[#6d5748] sm:flex-row sm:items-center sm:justify-between">
            <p>
              Use the jump bar to move between sections quickly. Large trays,
              platters, and buffet packages live on the catering page so the
              takeout menu stays cleaner.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-[rgba(45,30,24,0.12)] bg-white"
              asChild
            >
              <Link href="/catering">
                Explore Catering
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-background py-12 sm:py-14">
        <div className="container mx-auto space-y-14 px-4">
          <section id={breakfast.id} className="anchor-section">
            <div className="mb-6 max-w-2xl">
              <div className="section-kicker">{breakfast.eyebrow}</div>
              <h2 className="mt-3 text-4xl text-[#2d1e18] sm:text-5xl">
                {breakfast.title}
              </h2>
              <p className="mt-3 text-base leading-8 text-[#6d5748]">
                {breakfast.description}
              </p>
              {breakfast.note && (
                <p className="mt-3 text-sm leading-7 text-[#8b5f48]">
                  {breakfast.note}
                </p>
              )}
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              {splitItems(breakfast.items ?? []).map((column, columnIndex) => (
                <div
                  key={`${breakfast.id}-${columnIndex}`}
                  className="overflow-hidden rounded-[1.8rem] border border-[rgba(79,50,34,0.08)] bg-white shadow-sm"
                >
                  <div className="divide-y divide-[rgba(79,50,34,0.08)]">
                    {column.map((entry) => {
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
                </div>
              ))}
            </div>
          </section>

          <section id={sandwiches.id} className="anchor-section">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
              <div>
                <div className="section-kicker">{sandwiches.eyebrow}</div>
                <h2 className="mt-3 text-4xl text-[#2d1e18] sm:text-5xl">
                  {sandwiches.title}
                </h2>
                <p className="mt-3 max-w-2xl text-base leading-8 text-[#6d5748]">
                  {sandwiches.description}
                </p>

                <div className="mt-6 overflow-hidden rounded-[2rem] border border-[rgba(79,50,34,0.08)] bg-white shadow-sm">
                  <div className="divide-y divide-[rgba(79,50,34,0.08)]">
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
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                {sandwiches.addOns && sandwiches.addOnsTitle && (
                  <AddOnGrid
                    title={sandwiches.addOnsTitle}
                    items={sandwiches.addOns}
                  />
                )}
                <div className="overflow-hidden rounded-[1.8rem] border border-[rgba(79,50,34,0.08)] bg-white shadow-sm">
                  <img
                    src={SITE_IMAGES.caesar}
                    alt="Lunch salad from Skymark Eatery"
                    className="h-56 w-full object-cover"
                  />
                  <div className="p-5">
                    <div className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#8b5f48]">
                      Weekday lunch
                    </div>
                    <p className="mt-3 text-sm leading-7 text-[#6d5748]">
                      Sandwiches are paired with fast pickup, simple add-ons,
                      and the kinds of office-lunch favourites that guests come
                      back for.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id={salads.id} className="anchor-section">
            <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
              <div className="overflow-hidden rounded-[2rem] border border-[rgba(79,50,34,0.08)] bg-white shadow-sm">
                <img
                  src={SITE_IMAGES.caesar}
                  alt="Grilled Caesar salad from Skymark Eatery"
                  className="h-72 w-full object-cover"
                />
                <div className="p-6">
                  <div className="section-kicker">{salads.eyebrow}</div>
                  <h2 className="mt-3 text-4xl text-[#2d1e18] sm:text-5xl">
                    {salads.title}
                  </h2>
                  <p className="mt-3 text-base leading-8 text-[#6d5748]">
                    {salads.description}
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="overflow-hidden rounded-[2rem] border border-[rgba(79,50,34,0.08)] bg-white shadow-sm">
                  <div className="divide-y divide-[rgba(79,50,34,0.08)]">
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
                </div>
                {salads.addOns && salads.addOnsTitle && (
                  <AddOnGrid title={salads.addOnsTitle} items={salads.addOns} />
                )}
              </div>
            </div>
          </section>

          <section id={sides.id} className="anchor-section">
            <div className="max-w-2xl">
              <div className="section-kicker">{sides.eyebrow}</div>
              <h2 className="mt-3 text-4xl text-[#2d1e18] sm:text-5xl">
                {sides.title}
              </h2>
              <p className="mt-3 text-base leading-8 text-[#6d5748]">
                {sides.description}
              </p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {sides.items?.map((entry) => {
                const liveItem = getLiveItem(entry.name);
                return (
                  <div
                    key={entry.name}
                    className="rounded-[1.7rem] border border-[rgba(79,50,34,0.08)] bg-white shadow-sm"
                  >
                    <MenuRow
                      item={entry}
                      liveItem={liveItem}
                      quantity={getCartQuantity(liveItem?.id)}
                      onAdd={handleAdd}
                      onIncrement={handleIncrement}
                      onDecrement={handleDecrement}
                      compact
                      showDescription={false}
                    />
                  </div>
                );
              })}
            </div>
          </section>

          <section id={pizza.id} className="anchor-section">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_320px] lg:items-start">
              <div>
                <div className="section-kicker">{pizza.eyebrow}</div>
                <h2 className="mt-3 text-4xl text-[#2d1e18] sm:text-5xl">
                  {pizza.title}
                </h2>
                <p className="mt-3 max-w-2xl text-base leading-8 text-[#6d5748]">
                  {pizza.description}
                </p>

                <div className="mt-6 overflow-hidden rounded-[2rem] border border-[rgba(79,50,34,0.08)] bg-white shadow-sm">
                  <div className="divide-y divide-[rgba(79,50,34,0.08)]">
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
                </div>
              </div>

              <div className="space-y-5">
                {pizza.addOns && pizza.addOnsTitle && (
                  <AddOnGrid title={pizza.addOnsTitle} items={pizza.addOns} />
                )}
                <div className="rounded-[1.8rem] border border-[rgba(79,50,34,0.08)] bg-[#f8f2ea] p-5">
                  <div className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#8b5f48]">
                    Good for sharing
                  </div>
                  <p className="mt-3 text-sm leading-7 text-[#6d5748]">
                    Personal pies work for quick solo lunches, while large and
                    party-size pizzas keep office orders simple.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section id={pasta.id} className="anchor-section">
            <div className="rounded-[2.2rem] border border-[rgba(79,50,34,0.08)] bg-[#f3eadf] p-6 shadow-sm sm:p-8">
              <div className="max-w-3xl">
                <div className="section-kicker">{pasta.eyebrow}</div>
                <h2 className="mt-3 text-4xl text-[#2d1e18] sm:text-5xl">
                  {pasta.title}
                </h2>
                <p className="mt-3 text-base leading-8 text-[#6d5748]">
                  {pasta.description}
                </p>
                {pasta.note && (
                  <p className="mt-3 text-sm leading-7 text-[#8b5f48]">
                    {pasta.note}
                  </p>
                )}
              </div>

              <div className="mt-8 grid gap-5 lg:grid-cols-2 2xl:grid-cols-4">
                {pasta.pastaGroups?.map((group) => (
                  <article
                    key={group.title}
                    className="overflow-hidden rounded-[1.8rem] border border-[rgba(79,50,34,0.08)] bg-white shadow-sm"
                  >
                    <div className="border-b border-[rgba(79,50,34,0.08)] px-5 py-4">
                      <h3 className="text-2xl text-[#2d1e18]">{group.title}</h3>
                    </div>
                    <div className="divide-y divide-[rgba(79,50,34,0.08)]">
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
                  </article>
                ))}
              </div>

              {pasta.signatureItems && (
                <div className="mt-8 rounded-[1.9rem] border border-[rgba(79,50,34,0.08)] bg-white shadow-sm">
                  <div className="border-b border-[rgba(79,50,34,0.08)] px-6 py-5">
                    <div className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#8b5f48]">
                      Signature plates
                    </div>
                    <p className="mt-2 text-sm leading-7 text-[#6d5748]">
                      For guests who want a fuller lunch plate without building
                      their own pasta combination.
                    </p>
                  </div>
                  <div className="divide-y divide-[rgba(79,50,34,0.08)]">
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
              )}
            </div>
          </section>
        </div>
      </section>

      <section className="border-t border-[rgba(79,50,34,0.08)] bg-[#f3eadf] py-16">
        <div className="container mx-auto px-4">
          <div className="section-shell px-7 py-8 sm:px-10 sm:py-10">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div>
                <div className="section-kicker">Ordering for a group?</div>
                <h2 className="mt-3 text-4xl text-[#2d1e18] sm:text-5xl">
                  Keep trays, platters, and buffet packages on the catering
                  side.
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-8 text-[#6d5748]">
                  The catering page brings appetizers, sandwich platters, hot
                  trays, desserts, beverages, and package pricing into one
                  easier planning flow.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Button
                  size="lg"
                  className="rounded-full bg-[#8b4f39] px-7 text-white hover:bg-[#75412f]"
                  asChild
                >
                  <Link href="/catering">
                    Explore Catering
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-[rgba(45,30,24,0.12)] bg-white px-7"
                  asChild
                >
                  <a href={BUSINESS_INFO.phoneHref}>
                    <Phone className="h-4 w-4" />
                    {BUSINESS_INFO.phone}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
