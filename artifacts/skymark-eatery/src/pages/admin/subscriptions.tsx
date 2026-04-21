import { AdminLayout } from "@/components/admin-layout";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Crown, Users, Calendar, DollarSign, Gift, Building2, ChevronRight, AlertCircle, Star } from "lucide-react";
import { format } from "date-fns";

interface Subscription {
  id: number;
  userId: number;
  planType: string;
  status: string;
  discountPercent: number;
  freeMealsTotal: number;
  freeMealsRemaining: number;
  cycleStartDate: string;
  nextBillingDate: string;
  monthsActive: number;
  corporateName?: string;
  notes?: string;
  createdAt: string;
}

const PLAN_INFO = {
  weekly: {
    label: "Weekly Plan",
    interval: "Every 7 days",
    freeMeals: 2,
    freeMealCondition: "After 1 month",
    discount: 20,
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: <Calendar className="w-5 h-5" />,
  },
  biweekly: {
    label: "Bi-Weekly Plan",
    interval: "Every 14 days",
    freeMeals: 4,
    freeMealCondition: "Per cycle",
    discount: 20,
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: <Star className="w-5 h-5" />,
  },
  monthly: {
    label: "Monthly Plan",
    interval: "Every 30 days",
    freeMeals: 6,
    freeMealCondition: "Per cycle",
    discount: 20,
    color: "bg-amber-100 text-amber-800 border-amber-200",
    icon: <Crown className="w-5 h-5" />,
  },
};

export default function AdminSubscriptions() {
  const { user, token } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch("/api/rewards/subscriptions", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setSubscriptions(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [token]);

  const planCounts = {
    weekly: subscriptions.filter((s) => s.planType === "weekly").length,
    biweekly: subscriptions.filter((s) => s.planType === "biweekly").length,
    monthly: subscriptions.filter((s) => s.planType === "monthly").length,
  };

  const active = subscriptions.filter((s) => s.status === "active").length;

  return (
    <AdminLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Subscription & Rewards</h1>
          <p className="text-muted-foreground mt-1">Manage customer loyalty plans and corporate accounts.</p>
        </div>

        {/* Admin notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-amber-800 text-sm">Admin-Only Section</p>
            <p className="text-amber-700 text-sm mt-0.5">This section is only visible to administrators. Subscription plans and corporate pricing are managed here before being offered to customers.</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{active}</div>
                <div className="text-xs text-muted-foreground">Active Members</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{planCounts.weekly}</div>
                <div className="text-xs text-muted-foreground">Weekly Plans</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                <Star className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{planCounts.biweekly}</div>
                <div className="text-xs text-muted-foreground">Bi-Weekly Plans</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                <Crown className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{planCounts.monthly}</div>
                <div className="text-xs text-muted-foreground">Monthly Plans</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Plan Overview */}
        <div>
          <h2 className="font-serif text-xl font-bold mb-4">Subscription Plan Details</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {Object.entries(PLAN_INFO).map(([key, plan]) => (
              <Card key={key} className="border-2 border-dashed border-border hover:border-primary/30 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      {plan.icon}
                    </div>
                    <div>
                      <CardTitle className="text-base">{plan.label}</CardTitle>
                      <p className="text-xs text-muted-foreground">{plan.interval}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Discount</span>
                    <Badge className="bg-accent/10 text-accent border-accent/20">{plan.discount}% off every order</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Free Meals</span>
                    <span className="font-medium flex items-center gap-1">
                      <Gift className="w-3.5 h-3.5 text-secondary" />
                      Up to {plan.freeMeals} free
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Earned when</span>
                    <span className="font-medium text-xs">{plan.freeMealCondition}</span>
                  </div>
                  <div className="text-xs text-muted-foreground pt-1 border-t border-border mt-2">
                    Customers pay ahead through the app and lock in their discount. Free meals unlock after sustained membership.
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Corporate Plans */}
        <Card className="border-secondary/20 bg-secondary/5">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <CardTitle>Corporate Catering Plans</CardTitle>
                <p className="text-sm text-muted-foreground">Special pricing for employee meal programs</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Corporate clients receive custom pricing based on volume, invoicing preferences, and meal frequency. 
              These plans require an initial consultation to understand the company's specific needs — including 
              whether employees will order individually on account, or whether the company will be invoiced weekly/monthly.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-background rounded-lg p-4 border border-border">
                <h4 className="font-medium text-sm mb-2">What's Included</h4>
                <ul className="text-sm text-muted-foreground space-y-1.5">
                  <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-accent" />Custom discount tiers based on volume</li>
                  <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-accent" />Monthly or weekly invoicing</li>
                  <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-accent" />Dedicated account manager</li>
                  <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-accent" />Employee digital ordering access</li>
                  <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-accent" />Catering for meetings & events</li>
                </ul>
              </div>
              <div className="bg-background rounded-lg p-4 border border-border">
                <h4 className="font-medium text-sm mb-2">Intake Process</h4>
                <ul className="text-sm text-muted-foreground space-y-1.5">
                  <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-secondary" />Initial discovery meeting</li>
                  <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-secondary" />Needs assessment & pricing proposal</li>
                  <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-secondary" />Contract & billing setup</li>
                  <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-secondary" />Account activation & onboarding</li>
                  <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-secondary" />Ongoing review & optimization</li>
                </ul>
              </div>
            </div>
            <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-3 text-sm text-secondary font-medium">
              📞 To set up a corporate account, contact us at (905) 206-5550 or email info@skymarkeatery.ca
            </div>
          </CardContent>
        </Card>

        {/* Active Subscriptions List */}
        <div>
          <h2 className="font-serif text-xl font-bold mb-4">Active Subscriptions</h2>
          {isLoading ? (
            <div className="text-center py-16 text-muted-foreground">Loading...</div>
          ) : subscriptions.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <Crown className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">No subscriptions yet. Plans will appear here once customers enroll.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {subscriptions.map((sub) => {
                const plan = PLAN_INFO[sub.planType as keyof typeof PLAN_INFO];
                return (
                  <Card key={sub.id}>
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        {plan?.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">User #{sub.userId}</span>
                          {sub.corporateName && <Badge variant="outline" className="text-xs">{sub.corporateName}</Badge>}
                          <Badge className={`text-xs border ${plan?.color || ''}`}>{plan?.label}</Badge>
                          <Badge variant={sub.status === "active" ? "default" : "secondary"} className="text-xs">{sub.status}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mt-0.5">
                          {sub.discountPercent}% discount · {sub.freeMealsRemaining}/{sub.freeMealsTotal} free meals remaining
                        </div>
                        {sub.notes && <div className="text-xs text-muted-foreground mt-1 italic">{sub.notes}</div>}
                      </div>
                      <div className="text-right text-xs text-muted-foreground shrink-0">
                        <div>Next billing</div>
                        <div className="font-medium">{format(new Date(sub.nextBillingDate), "MMM d, yyyy")}</div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
