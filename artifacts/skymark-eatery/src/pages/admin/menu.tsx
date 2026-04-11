import { AdminLayout } from "@/components/admin-layout";
import { 
  useListCategories, 
  useListMenuItems, 
  useCreateMenuItem, 
  useUpdateMenuItem, 
  useDeleteMenuItem,
  useCreateCategory,
  useDeleteCategory,
  useAiMenuSuggest,
  Category,
  MenuItem
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Wand2, Loader2, GripVertical, UtensilsCrossed, Star, EyeOff, Eye } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SafeImage } from "@/components/safe-image";

const menuItemSchema = z.object({
  name: z.string().min(2, "Name is required"),
  categoryId: z.number().nullable(),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be positive"),
  imageUrl: z.string().optional().or(z.literal("")),
  available: z.boolean().default(true),
  isPopular: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  allergens: z.string().optional(),
});

type MenuItemValues = z.infer<typeof menuItemSchema>;

const categorySchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().optional(),
  displayOrder: z.coerce.number().default(0),
});

type CategoryValues = z.infer<typeof categorySchema>;

export default function AdminMenu() {
  const queryClient = useQueryClient();
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  
  const { data: categories, isLoading: isCategoriesLoading } = useListCategories({
    query: { queryKey: ["categories"] },
  });

  const { data: menuItems, isLoading: isMenuLoading } = useListMenuItems(
    {}, // all items, including unavailable
    { query: { queryKey: ["menu-items", "all"] } }
  );

  const createItem = useCreateMenuItem();
  const updateItem = useUpdateMenuItem();
  const deleteItem = useDeleteMenuItem();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();
  const aiSuggest = useAiMenuSuggest();

  const itemForm = useForm<MenuItemValues>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      name: "",
      categoryId: null,
      description: "",
      price: 0,
      imageUrl: "",
      available: true,
      isPopular: false,
      isFeatured: false,
      allergens: "",
    },
  });

  const categoryForm = useForm<CategoryValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      displayOrder: 0,
    },
  });

  // Handle Item Edit
  const openEditDialog = (item: MenuItem) => {
    setEditingItem(item);
    itemForm.reset({
      name: item.name,
      categoryId: item.categoryId || null,
      description: item.description || "",
      price: item.price,
      imageUrl: item.imageUrl || "",
      available: item.available,
      isPopular: item.isPopular,
      isFeatured: (item as any).isFeatured || false,
      allergens: item.allergens || "",
    });
    setIsItemDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingItem(null);
    itemForm.reset({
      name: "",
      categoryId: activeCategory || (categories && categories.length > 0 ? categories[0].id : null),
      description: "",
      price: 0,
      imageUrl: "",
      available: true,
      isPopular: false,
      isFeatured: false,
      allergens: "",
    });
    setIsItemDialogOpen(true);
  };

  const onItemSubmit = async (data: MenuItemValues) => {
    try {
      if (editingItem) {
        await updateItem.mutateAsync({
          id: editingItem.id,
          data: {
            ...data,
            imageUrl: data.imageUrl || null,
            description: data.description || null,
            allergens: data.allergens || null,
          }
        });
        toast.success("Menu item updated");
      } else {
        await createItem.mutateAsync({
          data: {
            ...data,
            imageUrl: data.imageUrl || null,
            description: data.description || null,
            allergens: data.allergens || null,
          }
        });
        toast.success("Menu item created");
      }
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
      setIsItemDialogOpen(false);
    } catch (e) {
      toast.error("Failed to save menu item");
    }
  };

  const handleAiEnhance = async () => {
    const currentName = itemForm.getValues("name");
    const currentDesc = itemForm.getValues("description");
    const currentPrice = itemForm.getValues("price");
    
    if (!currentName) {
      toast.error("Please enter a name first");
      return;
    }

    try {
      const suggestion = await aiSuggest.mutateAsync({
        data: {
          name: currentName,
          currentDescription: currentDesc || undefined,
          price: currentPrice,
        }
      });

      itemForm.setValue("description", suggestion.description, { shouldValidate: true, shouldDirty: true });
      itemForm.setValue("allergens", suggestion.allergenSuggestions, { shouldValidate: true, shouldDirty: true });
      toast.success("AI suggestion applied!");
    } catch (e) {
      toast.error("Failed to generate AI suggestion");
    }
  };

  const handleDeleteItem = async (id: number) => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteItem.mutateAsync({ id });
        toast.success("Item deleted");
        queryClient.invalidateQueries({ queryKey: ["menu-items"] });
      } catch (e) {
        toast.error("Failed to delete item");
      }
    }
  };

  const onCategorySubmit = async (data: CategoryValues) => {
    try {
      await createCategory.mutateAsync({
        data: {
          ...data,
          description: data.description || null,
        }
      });
      toast.success("Category created");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setIsCategoryDialogOpen(false);
    } catch (e) {
      toast.error("Failed to create category");
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (confirm("Delete category? This might orphan menu items.")) {
      try {
        await deleteCategory.mutateAsync({ id });
        toast.success("Category deleted");
        if (activeCategory === id) setActiveCategory(null);
        queryClient.invalidateQueries({ queryKey: ["categories"] });
      } catch (e) {
        toast.error("Failed to delete category");
      }
    }
  };

  const toggleAvailability = async (item: MenuItem) => {
    try {
      await updateItem.mutateAsync({
        id: item.id,
        data: { available: !item.available }
      });
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
    } catch (e) {
      toast.error("Failed to update availability");
    }
  };

  const filteredItems = activeCategory 
    ? menuItems?.filter(i => i.categoryId === activeCategory)
    : menuItems;

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">Menu Management</h1>
            <p className="text-muted-foreground mt-1">Add, edit, and organize your dishes.</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" onClick={() => categoryForm.reset()}>
                  <Plus className="w-4 h-4 mr-2" /> Add Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>New Category</DialogTitle>
                </DialogHeader>
                <Form {...categoryForm}>
                  <form onSubmit={categoryForm.handleSubmit(onCategorySubmit)} className="space-y-4">
                    <FormField control={categoryForm.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={categoryForm.control} name="description" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <Button type="submit" className="w-full" disabled={createCategory.isPending}>
                      Create Category
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>

            <Dialog open={isItemDialogOpen} onOpenChange={setIsItemDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openCreateDialog}>
                  <Plus className="w-4 h-4 mr-2" /> Add Item
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingItem ? 'Edit Menu Item' : 'New Menu Item'}</DialogTitle>
                </DialogHeader>
                <Form {...itemForm}>
                  <form onSubmit={itemForm.handleSubmit(onItemSubmit)} className="space-y-6 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={itemForm.control} name="name" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dish Name</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={itemForm.control} name="categoryId" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select 
                            value={field.value?.toString() || ""} 
                            onValueChange={(val) => field.onChange(parseInt(val))}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories?.map(c => (
                                <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={itemForm.control} name="price" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price ($)</FormLabel>
                          <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={itemForm.control} name="imageUrl" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL (Optional)</FormLabel>
                          <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-primary flex items-center gap-2">
                          <Wand2 className="w-4 h-4" /> AI Copywriter
                        </h4>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          onClick={handleAiEnhance}
                          disabled={aiSuggest.isPending}
                        >
                          {aiSuggest.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Enhance Description"}
                        </Button>
                      </div>
                      
                      <FormField control={itemForm.control} name="description" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl><Textarea className="resize-none h-24" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      
                      <FormField control={itemForm.control} name="allergens" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Allergens</FormLabel>
                          <FormControl><Input placeholder="e.g. Dairy, Nuts, Gluten" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-muted/50 rounded-lg border border-border">
                      <FormField control={itemForm.control} name="available" render={({ field }) => (
                        <FormItem className="flex flex-row items-center gap-3 space-y-0">
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer text-sm">Available</FormLabel>
                        </FormItem>
                      )} />
                      
                      <FormField control={itemForm.control} name="isPopular" render={({ field }) => (
                        <FormItem className="flex flex-row items-center gap-3 space-y-0">
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer text-sm">Popular</FormLabel>
                        </FormItem>
                      )} />

                      <FormField control={itemForm.control} name="isFeatured" render={({ field }) => (
                        <FormItem className="flex flex-row items-center gap-3 space-y-0">
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer text-sm">Featured</FormLabel>
                        </FormItem>
                      )} />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <DialogClose asChild>
                        <Button variant="outline" type="button">Cancel</Button>
                      </DialogClose>
                      <Button type="submit" disabled={createItem.isPending || updateItem.isPending}>
                        {editingItem ? 'Save Changes' : 'Create Item'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Categories Sidebar */}
          <Card className="w-full md:w-64 flex-shrink-0 h-fit">
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-lg font-serif">Categories</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isCategoriesLoading ? (
                <div className="p-4 space-y-3">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="h-8 w-full" />)}
                </div>
              ) : (
                <div className="flex flex-col">
                  <button
                    className={`text-left px-4 py-3 text-sm font-medium transition-colors ${activeCategory === null ? 'bg-primary/10 text-primary border-l-2 border-primary' : 'hover:bg-muted text-muted-foreground border-l-2 border-transparent'}`}
                    onClick={() => setActiveCategory(null)}
                  >
                    All Items
                  </button>
                  {categories?.map(category => (
                    <div key={category.id} className="group flex items-center justify-between pr-2">
                      <button
                        className={`flex-1 text-left px-4 py-3 text-sm font-medium transition-colors ${activeCategory === category.id ? 'bg-primary/10 text-primary border-l-2 border-primary' : 'hover:bg-muted text-muted-foreground border-l-2 border-transparent'}`}
                        onClick={() => setActiveCategory(category.id)}
                      >
                        {category.name}
                      </button>
                      <button 
                        onClick={() => handleDeleteCategory(category.id)}
                        className="p-1.5 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity rounded"
                        title="Delete category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Menu Items List */}
          <div className="flex-1 space-y-4 min-w-0">
            {isMenuLoading ? (
              <>{[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full" />)}</>
            ) : filteredItems?.length === 0 ? (
              <div className="text-center py-20 bg-card border border-border rounded-xl">
                <h3 className="font-serif text-xl font-medium mb-2">No Items Found</h3>
                <p className="text-muted-foreground mb-4">This category is empty.</p>
                <Button onClick={openCreateDialog} variant="outline">Add First Item</Button>
              </div>
            ) : (
              filteredItems?.map(item => (
                <Card key={item.id} className={`transition-opacity ${!item.available ? 'opacity-60' : ''}`}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <SafeImage
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 rounded-md object-cover border border-border"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-serif font-bold text-lg truncate">{item.name}</h4>
                        {!item.available && <Badge variant="secondary" className="text-[10px]">Sold Out</Badge>}
                        {item.isPopular && <Badge variant="outline" className="text-[10px] border-accent text-accent">Popular</Badge>}
                        {(item as any).isFeatured && <Badge className="text-[10px] bg-yellow-500/20 text-yellow-700 border-yellow-400 hover:bg-yellow-500/20"><Star className="w-2.5 h-2.5 mr-0.5 fill-current inline" />Featured</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{item.description}</p>
                      <div className="text-sm font-medium mt-1">${item.price.toFixed(2)}</div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <div className="flex items-center gap-2 mr-4">
                        <Label htmlFor={`avail-${item.id}`} className="sr-only">Available</Label>
                        <Switch 
                          id={`avail-${item.id}`}
                          checked={item.available} 
                          onCheckedChange={() => toggleAvailability(item)} 
                        />
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(item)}>
                        <Edit className="w-4 h-4 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteItem(item.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
