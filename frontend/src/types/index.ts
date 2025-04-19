export interface Warehouse {
  _id: string;
  name: string;
}

export interface User {
  username: string;
  role: "admin" | "manager" | "staff";
  warehouses: Array<{
    _id: string;
    name: string;
  }>;
}


export interface TopBarProps {
  user: User;
}