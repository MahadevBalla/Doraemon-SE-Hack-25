import { useState } from "react";
import { Plus, Search, FileUp, Filter, Download, Edit, Trash, MoreHorizontal } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { BarcodeGenerator } from "@/components/inventory/BarcodeGenerator";
import { StockThreshold } from "@/components/inventory/StockThreshold";

const productsData = [
  {
    id: "prod-1",
    name: "Blue Widgets",
    sku: "BW-1001",
    category: "Electronics",
    stockLevel: 142,
    unit: "piece",
    threshold: 25,
    hasExpiry: false,
    status: "active",
  },
  {
    id: "prod-2",
    name: "Red Gadgets",
    sku: "RG-2002",
    category: "Electronics",
    stockLevel: 87,
    unit: "piece",
    threshold: 20,
    hasExpiry: false,
    status: "active",
  },
  {
    id: "prod-3",
    name: "Green Widgets",
    sku: "GW-3003",
    category: "Office Supplies",
    stockLevel: 253,
    unit: "box",
    threshold: 30,
    hasExpiry: false,
    status: "active",
  },
  {
    id: "prod-4",
    name: "Yellow Gadgets",
    sku: "YG-4004",
    category: "Electronics",
    stockLevel: 12,
    unit: "piece",
    threshold: 20,
    hasExpiry: false,
    status: "low_stock",
  },
  {
    id: "prod-5",
    name: "Purple Widgets",
    sku: "PW-5005",
    category: "Office Supplies",
    stockLevel: 78,
    unit: "box",
    threshold: 15,
    hasExpiry: false,
    status: "active",
  },
  {
    id: "prod-6",
    name: "Medical Supplies",
    sku: "MS-6006",
    category: "Pharmaceutical",
    stockLevel: 45,
    unit: "box",
    threshold: 10,
    hasExpiry: true,
    status: "active",
  },
];

const categories = [
  "All Categories",
  "Electronics",
  "Office Supplies",
  "Furniture",
  "Pharmaceutical",
  "Food",
  "Other"
];

const Products = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const { toast } = useToast();

  const [newProduct, setNewProduct] = useState({
    name: "",
    sku: "",
    category: "",
    unit: "piece",
    threshold: 10,
    hasExpiry: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleSwitchChange = (checked: boolean) => {
    setNewProduct({ ...newProduct, hasExpiry: checked });
  };

  const handleAddProduct = () => {
    toast({
      title: "Product Added",
      description: `${newProduct.name} has been added to the catalog.`,
    });
    setIsAddDialogOpen(false);
    setNewProduct({
      name: "",
      sku: "",
      category: "",
      unit: "piece",
      threshold: 10,
      hasExpiry: false,
    });
  };

  const handleImportCSV = () => {
    toast({
      title: "CSV Import Started",
      description: "Your products are being processed.",
    });
    setIsImportDialogOpen(false);
  };

  const handleExportCSV = () => {
    toast({
      title: "CSV Export Started",
      description: "Your product catalog is being exported to CSV.",
    });
  };

  const filteredProducts = productsData.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === "All Categories" || product.category === categoryFilter;

    const matchesStatus = statusFilter === "all" ||
      (statusFilter === "low_stock" && product.status === "low_stock") ||
      (statusFilter === "active" && product.status === "active");

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage your product catalog
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FileUp className="h-4 w-4 mr-2" />
                Import CSV
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import Products from CSV</DialogTitle>
                <DialogDescription>
                  Upload a CSV file to bulk import products. The file should contain columns for SKU, Name, Category, Unit, and Threshold.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="csvFile">CSV File</Label>
                  <Input id="csvFile" type="file" accept=".csv" />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Duplicate Handling</Label>
                  <Select defaultValue="update">
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Select duplicate handling" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="update">Update Existing</SelectItem>
                      <SelectItem value="skip">Skip</SelectItem>
                      <SelectItem value="create">Create New</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleImportCSV}>
                  Import
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>
                  Fill in the details to add a new product to your catalog.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={newProduct.name}
                      onChange={handleInputChange}
                      placeholder="E.g., Blue Widgets"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      name="sku"
                      value={newProduct.sku}
                      onChange={handleInputChange}
                      placeholder="E.g., BW-1001"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newProduct.category}
                      onValueChange={(value) => handleSelectChange("category", value)}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.slice(1).map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Select
                      value={newProduct.unit}
                      onValueChange={(value) => handleSelectChange("unit", value)}
                    >
                      <SelectTrigger id="unit">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="piece">Piece</SelectItem>
                        <SelectItem value="box">Box</SelectItem>
                        <SelectItem value="kg">Kilogram</SelectItem>
                        <SelectItem value="liter">Liter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="threshold">Low Stock Threshold</Label>
                    <Input
                      id="threshold"
                      name="threshold"
                      type="number"
                      min="0"
                      value={newProduct.threshold.toString()}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="hasExpiry" className="flex items-center justify-between">
                      Track Expiry Date
                      <Switch
                        id="hasExpiry"
                        checked={newProduct.hasExpiry}
                        onCheckedChange={handleSwitchChange}
                      />
                    </Label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddProduct}>
                  Add Product
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products by name or SKU..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Normal Stock</SelectItem>
                <SelectItem value="low_stock">Low Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Stock Level</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Threshold</TableHead>
                <TableHead>Expiry Tracking</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="text-right">
                      <span className={product.stockLevel <= product.threshold ? "text-red-500 font-medium" : ""}>
                        {product.stockLevel}
                      </span>
                      {product.stockLevel <= product.threshold && (
                        <Badge variant="destructive" className="ml-2">Low</Badge>
                      )}
                    </TableCell>
                    <TableCell>{product.unit}</TableCell>
                    <TableCell>{product.threshold}</TableCell>
                    <TableCell>
                      {product.hasExpiry ? (
                        <Badge variant="outline" className="bg-blue-50">Yes</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-50">No</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <BarcodeGenerator productId={product.id} productSku={product.sku} />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Trash className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                    No products found with the current filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <div className="mt-6 grid gap-4">
        <h3 className="text-lg font-semibold">Overstock Alerts</h3>
        <div className="grid gap-2">
          {productsData.map((product) => (
            <StockThreshold
              key={product.id}
              currentStock={product.stockLevel}
              maxThreshold={product.threshold * 2}
              productName={product.name}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Products;
