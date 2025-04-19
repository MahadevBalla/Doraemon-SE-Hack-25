import { useState } from "react";
import { Plus, Search, Edit, Trash, MoreHorizontal, Shield, User, UserCog, UserCheck } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

// Interface for User based on Mongoose schema
interface Warehouse {
  _id: string;
  name?: string; // Adding name for display purposes
}

interface User {
  _id: string;
  username: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  warehouses: Warehouse[];
  lastLogin: Date | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date | null;
}

// Sample users data following the schema
const usersData: User[] = [
  {
    _id: "user-1",
    username: "john_doe",
    email: "john.doe@example.com",
    role: "admin",
    warehouses: [{ _id: "wh-1", name: "Main Warehouse" }, { _id: "wh-2", name: "North Facility" }],
    lastLogin: new Date("2025-04-19T09:45:00"),
    isActive: true,
    createdAt: new Date("2024-10-15T08:30:00"),
    updatedAt: new Date("2025-04-19T09:45:00")
  },
  {
    _id: "user-2",
    username: "sarah_chen",
    email: "sarah.chen@example.com",
    role: "manager",
    warehouses: [{ _id: "wh-2", name: "North Facility" }],
    lastLogin: new Date("2025-04-18T15:20:00"),
    isActive: true,
    createdAt: new Date("2024-11-05T10:15:00"),
    updatedAt: new Date("2025-04-18T15:20:00")
  },
  {
    _id: "user-3",
    username: "mike_johnson",
    email: "mike.johnson@example.com",
    role: "staff",
    warehouses: [{ _id: "wh-1", name: "Main Warehouse" }],
    lastLogin: new Date("2025-04-19T10:15:00"),
    isActive: true,
    createdAt: new Date("2025-01-12T14:20:00"),
    updatedAt: new Date("2025-04-19T10:15:00")
  },
  {
    _id: "user-4",
    username: "lisa_wong",
    email: "lisa.wong@example.com",
    role: "manager",
    warehouses: [{ _id: "wh-3", name: "South Distribution" }],
    lastLogin: new Date("2025-04-17T13:30:00"),
    isActive: true,
    createdAt: new Date("2024-12-20T09:00:00"),
    updatedAt: new Date("2025-04-17T13:30:00")
  },
  {
    _id: "user-5",
    username: "alex_smith",
    email: "alex.smith@example.com",
    role: "staff",
    warehouses: [{ _id: "wh-2", name: "North Facility" }],
    lastLogin: new Date("2025-04-10T11:25:00"),
    isActive: false,
    createdAt: new Date("2025-01-05T15:45:00"),
    updatedAt: new Date("2025-04-10T11:25:00")
  },
];

// Sample warehouses for selection
const warehousesData = [
  { _id: "wh-1", name: "Main Warehouse" },
  { _id: "wh-2", name: "North Facility" },
  { _id: "wh-3", name: "South Distribution" },
  { _id: "wh-4", name: "East Storage" },
  { _id: "wh-5", name: "West Fulfillment Center" },
];

// Role descriptions
const roleDescriptions = {
  admin: "Full access to all features and settings",
  manager: "Manage inventory, products, and view analytics",
  staff: "View and update inventory levels",
};

const Users = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const { toast } = useToast();

  // Form state for new user
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "", // For creating new users
    role: "staff" as 'admin' | 'manager' | 'staff',
    isActive: true,
    warehouses: [] as string[],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleSelectChange = (name: string, value: string | string[]) => {
    setNewUser({ ...newUser, [name]: value });
  };

  const handleSwitchChange = (checked: boolean) => {
    setNewUser({ ...newUser, isActive: checked });
  };

  const handleAddUser = () => {
    // In a real app, this would send data to an API
    toast({
      title: "User Added",
      description: `${newUser.username} has been added with ${newUser.role} role.`,
    });
    setIsAddUserOpen(false);
    // Reset form
    setNewUser({
      username: "",
      email: "",
      password: "",
      role: "staff",
      isActive: true,
      warehouses: [],
    });
  };

  // Filter users based on search query, role, and status
  const filteredUsers = usersData.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    const matchesStatus = statusFilter === "all" ||
      (statusFilter === "active" && user.isActive) ||
      (statusFilter === "inactive" && !user.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Count users by role
  const userCounts = {
    admin: usersData.filter(user => user.role === "admin").length,
    manager: usersData.filter(user => user.role === "manager").length,
    staff: usersData.filter(user => user.role === "staff").length,
  };

  // Get initials for avatar fallback
  const getInitials = (username: string) => {
    return username
      .split('_')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  // Format date for display
  const formatDate = (date: Date | null) => {
    if (!date) return "Never";
    return format(date, "yyyy-MM-dd hh:mm a");
  };

  // Role icon mapping
  const roleIcons = {
    admin: <Shield className="h-5 w-5 text-primary" />,
    manager: <UserCog className="h-5 w-5 text-blue-500" />,
    staff: <UserCheck className="h-5 w-5 text-green-500" />,
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage user accounts and permissions
          </p>
        </div>
        <div>
          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Create a new user account and assign permissions.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    value={newUser.username}
                    onChange={handleInputChange}
                    placeholder="E.g., john_doe"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={newUser.email}
                    onChange={handleInputChange}
                    placeholder="E.g., john.doe@example.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={newUser.password}
                    onChange={handleInputChange}
                    placeholder="Create a strong password"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={newUser.role}
                    onValueChange={(value: 'admin' | 'manager' | 'staff') => handleSelectChange("role", value)}
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {newUser.role && roleDescriptions[newUser.role]}
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="warehouses">Assigned Warehouses</Label>
                  <Select
                    value={newUser.warehouses.length > 0 ? "selected" : ""}
                    onValueChange={() => { }}
                  >
                    <SelectTrigger id="warehouses">
                      <SelectValue placeholder="Select warehouses" />
                    </SelectTrigger>
                    <SelectContent>
                      {warehousesData.map(warehouse => (
                        <div key={warehouse._id} className="flex items-center px-2 py-1">
                          <input
                            type="checkbox"
                            id={`warehouse-${warehouse._id}`}
                            checked={newUser.warehouses.includes(warehouse._id)}
                            onChange={(e) => {
                              const warehouses = e.target.checked
                                ? [...newUser.warehouses, warehouse._id]
                                : newUser.warehouses.filter(id => id !== warehouse._id);
                              handleSelectChange("warehouses", warehouses);
                            }}
                            className="mr-2"
                          />
                          <label htmlFor={`warehouse-${warehouse._id}`}>{warehouse.name}</label>
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {newUser.warehouses.map(warehouseId => {
                      const warehouse = warehousesData.find(w => w._id === warehouseId);
                      return warehouse ? (
                        <Badge key={warehouse._id} variant="outline" className="text-xs">
                          {warehouse.name}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="isActive" className="flex-1">Active Account</Label>
                  <Switch
                    id="isActive"
                    checked={newUser.isActive}
                    onCheckedChange={handleSwitchChange}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddUser}>
                  Add User
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-primary" />
            <h3 className="font-medium">Administrators</h3>
          </div>
          <div className="mt-2">
            <div className="text-3xl font-bold">{userCounts.admin}</div>
            <p className="text-sm text-muted-foreground">Full access users</p>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <UserCog className="h-5 w-5 text-blue-500" />
            <h3 className="font-medium">Managers</h3>
          </div>
          <div className="mt-2">
            <div className="text-3xl font-bold">{userCounts.manager}</div>
            <p className="text-sm text-muted-foreground">Inventory managers</p>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <UserCheck className="h-5 w-5 text-green-500" />
            <h3 className="font-medium">Staff Members</h3>
          </div>
          <div className="mt-2">
            <div className="text-3xl font-bold">{userCounts.staff}</div>
            <p className="text-sm text-muted-foreground">Limited access users</p>
          </div>
        </Card>
      </div>
      <Card className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by username or email..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Warehouses</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{user.username}</div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {roleIcons[user.role]}
                        <span className="capitalize">{user.role}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.warehouses.length > 0 ? (
                          user.warehouses.map(warehouse => (
                            <Badge key={warehouse._id} variant="outline" className="text-xs">
                              {warehouse.name}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground text-sm">None assigned</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.isActive ? (
                        <Badge className="bg-green-500">Active</Badge>
                      ) : (
                        <Badge variant="outline" className="border-muted-foreground">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(user.lastLogin)}</TableCell>
                    <TableCell className="text-right">
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
                            <User className="h-4 w-4 mr-2" />
                            Reset Password
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-500">
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    No users found with the current filters.
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

export default Users;