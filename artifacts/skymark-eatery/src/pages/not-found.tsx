import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/lib/seo";
import { UtensilsCrossed, Home, Menu } from "lucide-react";

export default function NotFound() {
  useSeo({
    title: "Page Not Found | Skymark Eatery by Caffe E Pranzo",
    description: "The page you are looking for could not be found.",
    path: window.location.pathname,
    robots: "noindex, nofollow",
  });

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-muted/30 px-4">
      <div className="text-center max-w-md space-y-6">
        <div className="relative">
          <div className="text-[120px] font-serif font-black text-primary/10 leading-none select-none">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <UtensilsCrossed className="w-9 h-9 text-primary/60" />
            </div>
          </div>
        </div>

        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground mb-2">Page Not Found</h1>
          <p className="text-muted-foreground leading-relaxed">
            Looks like this dish isn't on the menu. The page you're looking for doesn't exist or has moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/menu">
              <Menu className="w-4 h-4 mr-2" />
              View Menu
            </Link>
          </Button>
        </div>

        <div className="pt-4 border-t border-border/40">
          <p className="text-xs text-muted-foreground">
            Skymark Eatery by Caffe E Pranzo · 2630 Skymark Ave., Unit 102, Mississauga
          </p>
        </div>
      </div>
    </div>
  );
}
