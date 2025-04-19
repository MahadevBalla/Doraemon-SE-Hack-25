import { useState } from "react";
import { Plus, Search, Edit, Trash, MoreHorizontal, MapPin } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Warehouse } from "@/types";
import { cn } from "@/lib/utils";

// Sample warehouse data matching the schema
const warehousesData = [
  {
    _id: "wh-1",
    name: "Warehouse A",
    location: {
      address: "123 Industrial Park",
      city: "Boston",
      postalCode: "02108"
    },
    quantity: 152,
    capacity: 1000,
    currentOccupancy: 750,
    manager: {
      _id: "user-1",
      name: "John Smith"
    },
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-06-20")
  },
  {
    _id: "wh-2",
    name: "Warehouse B",
    location: {
      address: "456 Commerce St",
      city: "Chicago",
      postalCode: "60601"
    },
    quantity: 98,
    capacity: 800,
    currentOccupancy: 620,
    manager: {
      _id: "user-2",
      name: "Sarah Johnson"
    },
    createdAt: new Date("2023-02-10"),
    updatedAt: new Date("2023-07-15")
  },
  {
    _id: "wh-3",
    name: "Warehouse C",
    location: {
      address: "789 Logistics Blvd",
      city: "Austin",
      postalCode: "78701"
    },
    quantity: 215,
    capacity: 1200,
    currentOccupancy: 1140,
    manager: {
      _id: "user-3",
      name: "Michael Brown"
    },
    createdAt: new Date("2023-03-05"),
    updatedAt: new Date("2023-08-10")
  }
];

const Warehouses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddWarehouseOpen, setIsAddWarehouseOpen] = useState(false);
  const { toast } = useToast();

  // Form state for new warehouse
  const [newWarehouse, setNewWarehouse] = useState({
    name: "",
    location: "",
    capacity: 1000,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewWarehouse({
      ...newWarehouse,
      [name]: name === "capacity" ? parseInt(value) || 0 : value
    });
  };

  const handleAddWarehouse = () => {
    // In a real app, this would send data to an API
    toast({
      title: "Warehouse Added",
      description: `${newWarehouse.name} has been added to your locations.`,
    });
    setIsAddWarehouseOpen(false);
    // Reset form
    setNewWarehouse({
      name: "",
      location: "",
      capacity: 1000,
    });
  };

  // Filter warehouses based on search query
  const filteredWarehouses = warehousesData.filter((warehouse) => {
    return (
      warehouse.name.toLowerCase().includes(searchQuery.toLowerCase())
      //warehouse.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Warehouses</h1>
          <p className="text-muted-foreground">
            Manage warehouse locations and capacity
          </p>
        </div>
        <div>
          <Dialog open={isAddWarehouseOpen} onOpenChange={setIsAddWarehouseOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Warehouse
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Warehouse</DialogTitle>
                <DialogDescription>
                  Add a new warehouse location to your inventory system.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Warehouse Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={newWarehouse.name}
                    onChange={handleInputChange}
                    placeholder="E.g., Warehouse D"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={newWarehouse.location}
                    onChange={handleInputChange}
                    placeholder="E.g., Seattle, WA"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="capacity">Storage Capacity (units)</Label>
                  <Input
                    id="capacity"
                    name="capacity"
                    type="number"
                    min="100"
                    value={newWarehouse.capacity}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddWarehouseOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddWarehouse}>
                  Add Warehouse
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {warehousesData.map((warehouse) => {
          const usagePercentage = Math.round((warehouse.currentOccupancy / warehouse.capacity) * 100);

          let statusColor = "text-green-500";
          if (usagePercentage > 95) {
            statusColor = "text-red-500";
          } else if (usagePercentage > 80) {
            statusColor = "text-amber-500";
          }

          return (
            <Card key={warehouse._id} className="relative overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex justify-between items-center">
                  {warehouse.name}
                  <Badge variant={
                    usagePercentage > 95
                      ? "destructive"
                      : usagePercentage > 80
                        ? "default"
                        : "outline"
                  }>
                    {
                      usagePercentage > 95
                        ? "Critical"
                        : usagePercentage > 80
                          ? "Near Capacity"
                          : "Normal"
                    }
                  </Badge>
                </CardTitle>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                  {warehouse.location ? (
                    <>
                      {warehouse.location.address && (
                        <span className="mr-1">{warehouse.location.address},</span>
                      )}
                      {warehouse.location.city || warehouse.location.postalCode ? (
                        <span>
                          {warehouse.location.city}
                          {warehouse.location.postalCode && ` ${warehouse.location.postalCode}`}
                        </span>
                      ) : (
                        !warehouse.location.address && <span>Location not specified</span>
                      )}
                    </>
                  ) : (
                    <span>Location not specified</span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Storage Usage</span>
                      <span className={`font-medium ${statusColor}`}>{usagePercentage}%</span>
                    </div>
                    <Progress
                      value={usagePercentage}
                      className={`h-2 ${usagePercentage > 95
                        ? "bg-red-500"
                        : usagePercentage > 80
                          ? "bg-amber-500"
                          : "bg-blue-500"
                        }`}
                    />
                  </div>

                  {/* <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-md bg-muted p-3">
                      <div className="text-sm text-muted-foreground">Products</div>
                      <div className="text-xl font-medium mt-1">{warehouse.productCount}</div>
                    </div>
                    <div className="rounded-md bg-muted p-3">
                      <div className="text-sm text-muted-foreground">Items</div>
                      <div className="text-xl font-medium mt-1">{warehouse.itemCount}</div>
                    </div>
                  </div> */}

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Capacity</span>
                    <span className="font-medium">{warehouse.currentOccupancy} / {warehouse.capacity} units</span>
                  </div>

                  <div className="flex justify-end">
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="p-6">
        <div className="relative mb-6">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search warehouses..."
            className="pl-8 max-w-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Occupancy</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Manager</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWarehouses.length > 0 ? (
                filteredWarehouses.map((warehouse) => {
                  const occupancyPercentage = warehouse.capacity > 0
                    ? Math.round((warehouse.currentOccupancy / warehouse.capacity) * 100)
                    : 0;

                  return (
                    <TableRow key={warehouse._id}>
                      <TableCell className="font-medium">{warehouse.name}</TableCell>
                      <TableCell>
                        {warehouse.location?.address}, {warehouse.location?.city}, {warehouse.location?.postalCode}
                      </TableCell>
                      <TableCell>{warehouse.capacity}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={occupancyPercentage}
                            className={cn(
                              "h-2 w-20",
                              occupancyPercentage > 95
                                ? "[--progress-foreground:theme(colors.red.500)]"
                                : occupancyPercentage > 80
                                  ? "[--progress-foreground:theme(colors.amber.500)]"
                                  : ""
                            )}
                          />
                          <span className="text-xs">{occupancyPercentage}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{warehouse.quantity}</TableCell>
                      <TableCell>
                        {warehouse.manager?.name || 'Unassigned'}
                      </TableCell>

                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                    No warehouses found with the current search query.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </>
  );
};

export default Warehouses;
