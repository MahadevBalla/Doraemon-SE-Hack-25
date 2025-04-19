import { useState } from "react";
import { Download, Filter, Plus, Search, ArrowUpDown } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

const stockData = [
  {
    id: "stock-1",
    product: "Blue Widgets",
    sku: "BW-1001",
    warehouse: "Warehouse A",
    quantity: 82,
    threshold: 25,
    status: "normal",
    unit: "piece",
    lastUpdated: "2025-04-15",
  },
  {
    id: "stock-2",
    product: "Blue Widgets",
    sku: "BW-1001",
    warehouse: "Warehouse B",
    quantity: 60,
    threshold: 25,
    status: "normal",
    unit: "piece",
    lastUpdated: "2025-04-16",
  },
  {
    id: "stock-3",
    product: "Red Gadgets",
    sku: "RG-2002",
    warehouse: "Warehouse A",
    quantity: 45,
    threshold: 20,
    status: "normal",
    unit: "piece",
    lastUpdated: "2025-04-17",
  },
  {
    id: "stock-4",
    product: "Red Gadgets",
    sku: "RG-2002",
    warehouse: "Warehouse C",
    quantity: 42,
    threshold: 20,
    status: "normal",
    unit: "piece",
    lastUpdated: "2025-04-15",
  },
  {
    id: "stock-5",
    product: "Green Widgets",
    sku: "GW-3003",
    warehouse: "Warehouse B",
    quantity: 120,
    threshold: 30,
    status: "normal",
    unit: "box",
    lastUpdated: "2025-04-16",
  },
  {
    id: "stock-6",
    product: "Yellow Gadgets",
    sku: "YG-4004",
    warehouse: "Warehouse A",
    quantity: 12,
    threshold: 20,
    status: "low",
    unit: "piece",
    lastUpdated: "2025-04-14",
  },
  {
    id: "stock-7",
    product: "Medical Supplies",
    sku: "MS-6006",
    warehouse: "Warehouse C",
    quantity: 45,
    threshold: 10,
    status: "normal",
    unit: "box",
    lastUpdated: "2025-04-18",
    expiryDate: "2025-06-20",
  },
];

const warehouses = [
  "All Warehouses",
  "Warehouse A",
  "Warehouse B",
  "Warehouse C",
];

const Stock = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [warehouseFilter, setWarehouseFilter] = useState("All Warehouses");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortColumn, setSortColumn] = useState("product");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);
  const { toast } = useToast();

  const [newStock, setNewStock] = useState({
    product: "",
    warehouse: "",
    quantity: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewStock({ ...newStock, [name]: name === "quantity" ? parseInt(value) || 0 : value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewStock({ ...newStock, [name]: value });
  };

  const handleAddStock = () => {
    toast({
      title: "Stock Added",
      description: `Added ${newStock.quantity} units to inventory.`,
    });
    setIsAddStockOpen(false);
    setNewStock({
      product: "",
      warehouse: "",
      quantity: 0,
    });
  };

  const handleExportCSV = () => {
    toast({
      title: "CSV Export Started",
      description: "Your inventory data is being exported to CSV.",
    });
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const filteredStock = stockData
    .filter((item) => {
      const matchesSearch =
        item.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesWarehouse = warehouseFilter === "All Warehouses" || item.warehouse === warehouseFilter;

      const matchesStatus = statusFilter === "all" ||
        (statusFilter === "low" && item.status === "low") ||
        (statusFilter === "normal" && item.status === "normal");

      return matchesSearch && matchesWarehouse && matchesStatus;
    })
    .sort((a, b) => {
      let compareA: string | number = a[sortColumn as keyof typeof a] as string | number;
      let compareB: string | number = b[sortColumn as keyof typeof b] as string | number;

      const result = typeof compareA === "string"
        ? compareA.localeCompare(compareB as string)
        : (compareA as number) - (compareB as number);

      return sortDirection === "asc" ? result : -result;
    });

  const productTotals = stockData.reduce((acc, curr) => {
    if (!acc[curr.sku]) {
      acc[curr.sku] = {
        product: curr.product,
        sku: curr.sku,
        total: 0,
        threshold: curr.threshold,
        unit: curr.unit,
      };
    }
    acc[curr.sku].total += curr.quantity;
    return acc;
  }, {} as Record<string, { product: string; sku: string; total: number; threshold: number; unit: string }>);

  const productTotalsArray = Object.values(productTotals);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Stock</h1>
          <p className="text-muted-foreground">
            View and manage current inventory levels
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>

          <Dialog open={isAddStockOpen} onOpenChange={setIsAddStockOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Stock
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Stock</DialogTitle>
                <DialogDescription>
                  Add inventory to an existing product.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="product">Product</Label>
                  <Select
                    value={newStock.product}
                    onValueChange={(value) => handleSelectChange("product", value)}
                  >
                    <SelectTrigger id="product">
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from(new Set(stockData.map(item => item.product))).map((product) => (
                        <SelectItem key={product} value={product}>
                          {product}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="warehouse">Warehouse</Label>
                  <Select
                    value={newStock.warehouse}
                    onValueChange={(value) => handleSelectChange("warehouse", value)}
                  >
                    <SelectTrigger id="warehouse">
                      <SelectValue placeholder="Select warehouse" />
                    </SelectTrigger>
                    <SelectContent>
                      {warehouses.slice(1).map((warehouse) => (
                        <SelectItem key={warehouse} value={warehouse}>
                          {warehouse}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="1"
                    value={newStock.quantity || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddStockOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddStock}>
                  Add Stock
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="by-location" className="mb-6">
        <TabsList>
          <TabsTrigger value="by-location">By Location</TabsTrigger>
          <TabsTrigger value="by-product">By Product</TabsTrigger>
        </TabsList>

        <TabsContent value="by-location">
          <Card className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by product name or SKU..."
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Warehouses" />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouses.map((warehouse) => (
                      <SelectItem key={warehouse} value={warehouse}>
                        {warehouse}
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
                    <SelectItem value="normal">Normal Stock</SelectItem>
                    <SelectItem value="low">Low Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("product")}>
                      <div className="flex items-center">
                        Product
                        {sortColumn === "product" && (
                          <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === "desc" ? "transform rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("warehouse")}>
                      <div className="flex items-center">
                        Warehouse
                        {sortColumn === "warehouse" && (
                          <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === "desc" ? "transform rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="text-right cursor-pointer" onClick={() => handleSort("quantity")}>
                      <div className="flex items-center justify-end">
                        Quantity
                        {sortColumn === "quantity" && (
                          <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === "desc" ? "transform rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Threshold</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStock.length > 0 ? (
                    filteredStock.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.product}</TableCell>
                        <TableCell>{item.sku}</TableCell>
                        <TableCell>{item.warehouse}</TableCell>
                        <TableCell className="text-right font-medium">
                          {item.quantity}
                        </TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell>{item.threshold}</TableCell>
                        <TableCell>
                          {item.quantity <= item.threshold ? (
                            <Badge variant="destructive">Low Stock</Badge>
                          ) : (
                            <Badge variant="outline" className="bg-green-50">Normal</Badge>
                          )}
                        </TableCell>
                        <TableCell>{item.lastUpdated}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                        No stock items found with the current filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="by-product">
          <Card className="p-6">
            <div className="relative mb-6">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by product name or SKU..."
                className="pl-8 max-w-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Total Quantity</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Threshold</TableHead>
                    <TableHead>Stock Level</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productTotalsArray
                    .filter(item =>
                      item.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      item.sku.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((item) => {
                      const percentage = Math.min(Math.round((item.total / (item.threshold * 2)) * 100), 100);
                      const isLow = item.total <= item.threshold;

                      return (
                        <TableRow key={item.sku}>
                          <TableCell className="font-medium">{item.product}</TableCell>
                          <TableCell>{item.sku}</TableCell>
                          <TableCell className="font-medium">
                            {item.total} {item.unit}s
                          </TableCell>
                          <TableCell>{item.unit}</TableCell>
                          <TableCell>{item.threshold}</TableCell>
                          <TableCell className="w-[200px]">
                            <div className="flex items-center gap-2">
                              <Progress
                                value={percentage}
                                className={`h-2 ${isLow ? "bg-red-100" : "bg-green-100"}`}
                              />
                              <span className={isLow ? "text-red-500 text-sm" : "text-green-500 text-sm"}>
                                {percentage}%
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Stock;
