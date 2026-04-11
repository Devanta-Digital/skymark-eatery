import { Layout } from "@/components/layout";
import { useListCategories, useListMenuItems, MenuItem } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, Trash2, UtensilsCrossed, Filter, Gift } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Link } from "wouter";
import { SafeImage } from "@/components/safe-image";

export default function Menu() {
  const { data: categories, isLoading: isCategoriesLoading } = useListCategories({
    query: { queryKey: ["categories"] },
  });

  const { data: menuItems, isLoading: isMenuLoading } = useListMenuItems(
    { available: true },
    { query: { queryKey: ["menu-items", { available: true }] } }
  );

  const { addItem, items, updateQuantity, removeItem } = useCart();
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  const getCartItem = (itemId: number) => items.find(i => i.menuItem.id === itemId);

  const handleAddToCart = (item: MenuItem) => {
    addItem(item);
    toast.success(`Added ${item.name} to cart`);
  };

  const handleIncrement = (item: MenuItem) => {
    const cartItem = getCartItem(item.id);
    if (cartItem) updateQuantity(item.id, cartItem.quantity + 1);
    else addItem(item);
  };

  const handleDecrement = (item: MenuItem) => {
    const cartItem = getCartItem(item.id);
    if (!cartItem) return;
    if (cartItem.quantity <= 1) removeItem(item.id);
    else updateQuantity(item.id, cartItem.quantity - 1);
  };

  const filteredCategories = activeCategory 
    ? categories?.filter(c => c.id === activeCategory) 
    : categories;

  return (
    <Layout>
      {/* Guest rewards promo bar */}
      {!user && (
        <div className="bg-gradient-to-r from-primary/90 to-primary border-b border-primary-foreground/10 py-2.5 px-4">
          <div className="container mx-auto flex items-center justify-center gap-2 text-sm text-primary-foreground/90">
            <Gift className="w-3.5 h-3.5 text-yellow-300 shrink-0" />
            <span>
              New customers get <strong className="text-yellow-300">15% off</strong> for their first 30 days — 
              <Link href="/signup" className="underline ml-1 hover:text-primary-foreground transition-colors">Create a free account</Link>
            </span>
          </div>
        </div>
      )}

      <div className="bg-muted py-12 border-b border-border/40">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">Our Menu</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our curated selection of classic Italian dishes, made fresh daily with love.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-24">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-primary" />
              <h2 className="font-serif font-bold text-lg">Categories</h2>
            </div>
            
            {isCategoriesLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-10 w-full" />)}
              </div>
            ) : (
              <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 hide-scrollbar">
                <Button 
                  variant={activeCategory === null ? "default" : "ghost"} 
                  className={cn(
                    "justify-start whitespace-nowrap", 
                    activeCategory === null ? "" : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => setActiveCategory(null)}
                >
                  All Items
                </Button>
                {categories?.map(category => (
                  <Button 
                    key={category.id}
                    variant={activeCategory === category.id ? "default" : "ghost"} 
                    className={cn(
                      "justify-start whitespace-nowrap", 
                      activeCategory === category.id ? "" : "text-muted-foreground hover:text-foreground"
                    )}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Menu Items */}
        <div className="flex-1 min-w-0">
          {isCategoriesLoading || isMenuLoading ? (
            <div className="space-y-12">
              {[1, 2].map(i => (
                <div key={i} className="space-y-6">
                  <Skeleton className="h-8 w-48" />
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map(j => (
                      <div key={j} className="flex gap-4">
                        <Skeleton className="w-24 h-24 rounded-md" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-6 w-full" />
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-5 w-1/4" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-16">
              {filteredCategories?.map(category => {
                const categoryItems = menuItems?.filter(item => item.categoryId === category.id) || [];
                if (categoryItems.length === 0) return null;

                return (
                  <div key={category.id} className="scroll-mt-24" id={`category-${category.id}`}>
                    <div className="flex items-center gap-4 mb-8">
                      <h3 className="font-serif text-2xl font-bold text-foreground">{category.name}</h3>
                      <div className="flex-1 h-px bg-border"></div>
                    </div>
                    
                    {category.description && (
                      <p className="text-muted-foreground mb-6 -mt-4 italic">{category.description}</p>
                    )}

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-12 gap-y-10">
                      {categoryItems.map(item => (
                        <div key={item.id} className="flex gap-4 group">
                          <SafeImage
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-24 h-24 object-cover rounded-md shadow-sm border border-border flex-shrink-0"
                          />
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start gap-4">
                                <h4 className="font-serif font-semibold text-lg text-primary leading-tight">{item.name}</h4>
                                <span className="font-medium whitespace-nowrap">${item.price.toFixed(2)}</span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
                              {item.allergens && (
                                <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-wide">
                                  Contains: {item.allergens}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex gap-2">
                                {item.isPopular && (
                                  <Badge variant="secondary" className="text-[10px] uppercase tracking-wider py-0 px-2 bg-accent/20 text-accent hover:bg-accent/20 border-none">Popular</Badge>
                                )}
                              </div>
                              {(() => {
                                const cartItem = getCartItem(item.id);
                                if (!cartItem) {
                                  return (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 px-3 ml-auto text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                                      onClick={() => handleAddToCart(item)}
                                    >
                                      <Plus className="w-4 h-4 mr-1.5" /> Add
                                    </Button>
                                  );
                                }
                                return (
                                  <div className="flex items-center gap-1 ml-auto">
                                    {cartItem.quantity >= 2 && (
                                      <button
                                        className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                        onClick={() => removeItem(item.id)}
                                        title="Remove all"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                    <div className="flex items-center border border-primary/30 rounded-md overflow-hidden bg-primary/5">
                                      <button
                                        className="w-8 h-8 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                                        onClick={() => handleDecrement(item)}
                                      >
                                        <Minus className="w-3.5 h-3.5" />
                                      </button>
                                      <span className="w-7 text-center text-sm font-semibold text-primary">{cartItem.quantity}</span>
                                      <button
                                        className="w-8 h-8 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                                        onClick={() => handleIncrement(item)}
                                      >
                                        <Plus className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {filteredCategories?.length === 0 && (
                <div className="text-center py-24 text-muted-foreground">
                  <UtensilsCrossed className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>No menu items found in this category.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
