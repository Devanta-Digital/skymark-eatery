import { AdminLayout } from "@/components/admin-layout";
import { useGetRevenueReport, useListExpenses, useCreateExpense, useDeleteExpense, Expense } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { DollarSign, TrendingUp, TrendingDown, Plus, Trash2, CalendarIcon } from "lucide-react";
import { format, subDays } from "date-fns";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const expenseSchema = z.object({
  description: z.string().min(2, "Description is required"),
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
  category: z.string().min(2, "Category is required"),
  vendor: z.string().optional(),
  expenseDate: z.string(),
  isPaid: z.boolean().default(true),
});

type ExpenseValues = z.infer<typeof expenseSchema>;

export default function AdminFinance() {
  const queryClient = useQueryClient();
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    to: format(new Date(), 'yyyy-MM-dd')
  });

  const { data: report, isLoading: isReportLoading } = useGetRevenueReport(
    { from: dateRange.from, to: dateRange.to },
    { query: { queryKey: ["revenue-report", dateRange.from, dateRange.to] } }
  );

  const { data: expenses, isLoading: isExpensesLoading } = useListExpenses({
    query: { queryKey: ["expenses"] },
  });

  const createExpense = useCreateExpense();
  const deleteExpense = useDeleteExpense();

  const form = useForm<ExpenseValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      description: "",
      amount: 0,
      category: "Ingredients",
      vendor: "",
      expenseDate: format(new Date(), "yyyy-MM-dd"),
      isPaid: true,
    },
  });

  const onExpenseSubmit = async (data: ExpenseValues) => {
    try {
      await createExpense.mutateAsync({
        data: {
          ...data,
          vendor: data.vendor || null,
        }
      });
      toast.success("Expense recorded");
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      setIsExpenseDialogOpen(false);
      form.reset();
    } catch (e) {
      toast.error("Failed to record expense");
    }
  };

  const handleDeleteExpense = async (id: number) => {
    if (confirm("Are you sure you want to delete this expense record?")) {
      try {
        await deleteExpense.mutateAsync({ id });
        toast.success("Expense deleted");
        queryClient.invalidateQueries({ queryKey: ["expenses"] });
      } catch (e) {
        toast.error("Failed to delete expense");
      }
    }
  };

  const totalExpenses = expenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0;
  const netProfit = (report?.totalRevenue || 0) - totalExpenses;

  // Format data for chart
  const chartData = report?.byDay.map(d => ({
    date: format(new Date(d.date), "MMM dd"),
    revenue: d.revenue,
    orders: d.orders
  })) || [];

  return (
    <AdminLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">Financial Overview</h1>
            <p className="text-muted-foreground mt-1">Track revenue, expenses, and overall profitability.</p>
          </div>
          
          <div className="flex items-center gap-2 bg-card border border-border rounded-md p-1 shadow-sm">
            <Input 
              type="date" 
              value={dateRange.from} 
              onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
              className="border-0 h-8 w-[140px] text-sm"
            />
            <span className="text-muted-foreground">to</span>
            <Input 
              type="date" 
              value={dateRange.to} 
              onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
              className="border-0 h-8 w-[140px] text-sm"
            />
          </div>
        </div>

        {/* P&L Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              {isReportLoading ? <Skeleton className="h-8 w-32" /> : (
                <>
                  <div className="text-3xl font-bold text-green-700">${report?.totalRevenue.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground mt-1">From {report?.totalOrders} orders</p>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              {isExpensesLoading ? <Skeleton className="h-8 w-32" /> : (
                <div className="text-3xl font-bold text-red-700">${totalExpenses.toFixed(2)}</div>
              )}
            </CardContent>
          </Card>
          
          <Card className={netProfit >= 0 ? "bg-green-50/50 border-green-200" : "bg-red-50/50 border-red-200"}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estimated Net Profit</CardTitle>
              <DollarSign className={`h-4 w-4 ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </CardHeader>
            <CardContent>
              {isReportLoading || isExpensesLoading ? <Skeleton className="h-8 w-32" /> : (
                <div className={`text-3xl font-bold ${netProfit >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                  ${netProfit.toFixed(2)}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Revenue Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-serif">Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              {isReportLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : chartData.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground border border-dashed rounded-md">
                  No revenue data for selected period
                </div>
              ) : (
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" tick={{fontSize: 12}} stroke="hsl(var(--muted-foreground))" />
                      <YAxis tick={{fontSize: 12}} stroke="hsl(var(--muted-foreground))" tickFormatter={(value) => `$${value}`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                        formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']}
                      />
                      <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Expenses List */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="font-serif">Recent Expenses</CardTitle>
              <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="h-8">
                    <Plus className="w-3 h-3 mr-1" /> Add
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Record Expense</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onExpenseSubmit)} className="space-y-4">
                      <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl><Input placeholder="e.g. Weekly Produce Order" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="amount" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount ($)</FormLabel>
                            <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="expenseDate" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date</FormLabel>
                            <FormControl><Input type="date" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="category" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Ingredients">Ingredients</SelectItem>
                                <SelectItem value="Packaging">Packaging</SelectItem>
                                <SelectItem value="Equipment">Equipment</SelectItem>
                                <SelectItem value="Utilities">Utilities</SelectItem>
                                <SelectItem value="Labor">Labor</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="vendor" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Vendor (Optional)</FormLabel>
                            <FormControl><Input placeholder="e.g. Sysco" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>

                      <FormField control={form.control} name="isPaid" render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel className="text-sm font-medium">Mark as Paid</FormLabel>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )} />

                      <div className="flex justify-end gap-2 pt-2">
                        <DialogClose asChild><Button variant="outline" type="button">Cancel</Button></DialogClose>
                        <Button type="submit" disabled={createExpense.isPending}>Save Expense</Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {isExpensesLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-14 w-full" />)}
                </div>
              ) : expenses?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm border border-dashed rounded-md">
                  No expenses recorded.
                </div>
              ) : (
                <div className="space-y-3">
                  {expenses?.map(expense => (
                    <div key={expense.id} className="flex items-center justify-between p-3 border border-border rounded-md hover:bg-muted/50 group transition-colors">
                      <div className="min-w-0 flex-1 pr-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm truncate">{expense.description}</span>
                          <span className="font-medium text-sm whitespace-nowrap ml-2 text-red-600">-${expense.amount.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                          <span className="bg-muted px-1.5 py-0.5 rounded">{expense.category}</span>
                          <span>{format(new Date(expense.expenseDate), "MMM d, yyyy")}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity pl-2 border-l border-border"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
