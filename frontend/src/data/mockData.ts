// // Sample Data with Indian names, products, and locations
// // Using interfaces from frontend\src\types\index.ts

// // Import interfaces from types file
// import { Movement, Product, Report, Alert, Inventory, User, Warehouse } from "@/types/index";

// // Use the previously defined warehouses data
// const warehousesData = [
//   { _id: "wh-1", name: "Main Warehouse", createdAt: new Date("2024-01-01T00:00:00"), updatedAt: new Date("2024-01-01T00:00:00") },
//   { _id: "wh-2", name: "North Facility", createdAt: new Date("2024-01-01T00:00:00"), updatedAt: new Date("2024-01-01T00:00:00") },
//   { _id: "wh-3", name: "South Distribution", createdAt: new Date("2024-01-01T00:00:00"), updatedAt: new Date("2024-01-01T00:00:00") },
//   { _id: "wh-4", name: "East Storage", createdAt: new Date("2024-01-01T00:00:00"), updatedAt: new Date("2024-01-01T00:00:00") },
//   { _id: "wh-5", name: "West Fulfillment Center", createdAt: new Date("2024-01-01T00:00:00"), updatedAt: new Date("2024-01-01T00:00:00") },
// ];

// // Random Indian users data
// const usersData: User[] = [
//   {
//     _id: "user-1",
//     username: "rajesh_kumar",
//     email: "rajesh.kumar@example.com",
//     passwordHash: "$2a$10$abcdefghijklmnopqrstuvwxyz123456",
//     role: "admin",
//     warehouses: [warehousesData[0], warehousesData[1]],
//     isActive: true,
//     refreshTokens: ["token1"],
//     createdAt: new Date("2024-09-12T08:30:00"),
//     updatedAt: new Date("2025-04-18T10:30:00"),
//     isPasswordCorrect: async (password) => true, // Mock function
//     generateAccessToken: () => "access-token-123", // Mock function
//     generateRefreshToken: () => "refresh-token-123" // Mock function
//   },
//   {
//     _id: "user-2",
//     username: "priya_sharma",
//     email: "priya.sharma@example.com",
//     passwordHash: "$2a$10$defghijklmnopqrstuvwxyz1234567",
//     role: "manager",
//     warehouses: [warehousesData[2]],
//     isActive: true,
//     refreshTokens: ["token2"],
//     createdAt: new Date("2024-10-05T11:20:00"),
//     updatedAt: new Date("2025-04-17T14:15:00"),
//     isPasswordCorrect: async (password) => true, // Mock function
//     generateAccessToken: () => "access-token-456", // Mock function
//     generateRefreshToken: () => "refresh-token-456" // Mock function
//   },
//   {
//     _id: "user-3",
//     username: "amit_patel",
//     email: "amit.patel@example.com",
//     passwordHash: "$2a$10$ghijklmnopqrstuvwxyz12345678",
//     role: "staff",
//     warehouses: [warehousesData[0]],
//     isActive: true,
//     refreshTokens: ["token3"],
//     createdAt: new Date("2024-11-20T09:30:00"),
//     updatedAt: new Date("2025-04-19T08:45:00"),
//     isPasswordCorrect: async (password) => true, // Mock function
//     generateAccessToken: () => "access-token-789", // Mock function
//     generateRefreshToken: () => "refresh-token-789" // Mock function
//   },
//   {
//     _id: "user-4",
//     username: "neha_gupta",
//     email: "neha.gupta@example.com",
//     passwordHash: "$2a$10$jklmnopqrstuvwxyz123456789",
//     role: "manager",
//     warehouses: [warehousesData[3]],
//     isActive: true,
//     refreshTokens: ["token4"],
//     createdAt: new Date("2024-12-10T13:45:00"),
//     updatedAt: new Date("2025-04-16T16:20:00"),
//     isPasswordCorrect: async (password) => true, // Mock function
//     generateAccessToken: () => "access-token-101", // Mock function
//     generateRefreshToken: () => "refresh-token-101" // Mock function
//   },
//   {
//     _id: "user-5",
//     username: "suresh_verma",
//     email: "suresh.verma@example.com",
//     passwordHash: "$2a$10$mnopqrstuvwxyz1234567890",
//     role: "staff",
//     warehouses: [warehousesData[1]],
//     isActive: false,
//     refreshTokens: [],
//     createdAt: new Date("2025-01-15T10:00:00"),
//     updatedAt: new Date("2025-03-25T11:10:00"),
//     isPasswordCorrect: async (password) => true, // Mock function
//     generateAccessToken: () => "access-token-102", // Mock function
//   },
//   {
//     _id: "user-6",
//     username: "ananya_reddy",
//     email: "ananya.reddy@example.com",
//     passwordHash: "$2a$10$pqrstuvwxyz1234567890abc",
//     role: "staff",
//     warehouses: [warehousesData[4]],
//     isActive: true,
//     refreshTokens: ["token6"],
//     createdAt: new Date("2025-02-05T14:20:00"),
//     updatedAt: new Date("2025-04-19T09:30:00"),
//     isPasswordCorrect: async (password) => true, // Mock function
//     generateAccessToken: () => "access-token-103", // Mock function
//     generateRefreshToken: () => "refresh-token-103" // Mock function
//   }
// ];

// // Indian-specific products
// const productsData: Product[] = [
//   {
//     _id: "prod-1",
//     sku: "RICE-001",
//     name: "Basmati Rice Premium",
//     description: "Premium long-grain basmati rice from Punjab",
//     category: "Staples",
//     unit: "kg",
//     barcode: "8901234567890",
//     minStockLevel: 50,
//     isPerishable: false,
//     attributes: { origin: "Punjab", grade: "Premium" },
//     createdAt: new Date("2024-10-10T08:30:00"),
//     updatedAt: new Date("2024-12-15T09:45:00")
//   },
//   {
//     _id: "prod-2",
//     sku: "SPICE-007",
//     name: "Garam Masala Blend",
//     description: "Traditional Indian spice blend",
//     category: "Spices",
//     unit: "kg",
//     barcode: "8901234567891",
//     minStockLevel: 25,
//     isPerishable: false,
//     defaultExpiryDays: 365,
//     attributes: { components: ["Cardamom", "Cinnamon", "Cloves", "Cumin"] },
//     createdAt: new Date("2024-10-12T10:15:00"),
//     updatedAt: new Date("2025-01-05T11:30:00")
//   },
//   {
//     _id: "prod-3",
//     sku: "TEA-022",
//     name: "Darjeeling First Flush Tea",
//     description: "Premium first flush tea from Darjeeling hills",
//     category: "Beverages",
//     unit: "kg",
//     barcode: "8901234567892",
//     minStockLevel: 30,
//     isPerishable: true,
//     defaultExpiryDays: 730,
//     attributes: { grade: "FTGFOP1", harvestSeason: "Spring 2024" },
//     createdAt: new Date("2024-11-05T09:20:00"),
//     updatedAt: new Date("2025-02-10T14:25:00")
//   },
//   {
//     _id: "prod-4",
//     sku: "TEXT-105",
//     name: "Cotton Saree Bundle",
//     description: "Handloom cotton sarees from Tamil Nadu",
//     category: "Textiles",
//     unit: "piece",
//     barcode: "8901234567893",
//     minStockLevel: 20,
//     isPerishable: false,
//     attributes: { material: "100% Cotton", origin: "Kanchipuram" },
//     createdAt: new Date("2024-12-01T11:45:00"),
//     updatedAt: new Date("2025-03-15T16:20:00")
//   },
//   {
//     _id: "prod-5",
//     sku: "SOAP-054",
//     name: "Neem & Tulsi Soap Box",
//     description: "Ayurvedic herbal soap with neem and tulsi extracts",
//     category: "Personal Care",
//     unit: "box",
//     barcode: "8901234567894",
//     minStockLevel: 40,
//     isPerishable: true,
//     defaultExpiryDays: 1095,
//     attributes: { quantity: "12 pcs per box", weight: "100g per piece" },
//     createdAt: new Date("2025-01-10T13:30:00"),
//     updatedAt: new Date("2025-03-20T10:15:00")
//   },
//   {
//     _id: "prod-6",
//     sku: "OIL-032",
//     name: "Mustard Oil Premium",
//     description: "Cold-pressed mustard oil from Gujarat",
//     category: "Cooking Oils",
//     unit: "liter",
//     barcode: "8901234567895",
//     minStockLevel: 35,
//     isPerishable: true,
//     defaultExpiryDays: 365,
//     attributes: { processing: "Cold-pressed", origin: "Gujarat" },
//     createdAt: new Date("2025-01-15T15:10:00"),
//     updatedAt: new Date("2025-04-02T09:40:00")
//   },
//   {
//     _id: "prod-7",
//     sku: "SWEET-091",
//     name: "Mysore Pak Box",
//     description: "Traditional South Indian sweet box",
//     category: "Sweets",
//     unit: "box",
//     barcode: "8901234567896",
//     minStockLevel: 15,
//     isPerishable: true,
//     defaultExpiryDays: 30,
//     attributes: { pieces: "24 per box", ingredients: ["Gram flour", "Ghee", "Sugar"] },
//     createdAt: new Date("2025-02-05T12:45:00"),
//     updatedAt: new Date("2025-04-10T11:50:00")
//   }
// ];

// // Inventory data
// const inventoryData: Inventory[] = [
//   {
//     _id: "inv-1",
//     product: productsData[0],
//     warehouse: warehousesData[0]._id,
//     quantity: 500,
//     allocatedQuantity: 50,
//     value: {
//       costPrice: 125,
//       currency: "INR"
//     },
//     createdAt: new Date("2024-10-15T09:30:00"),
//     updatedAt: new Date("2025-04-15T10:45:00")
//   },
//   {
//     _id: "inv-2",
//     product: productsData[1],
//     warehouse: warehousesData[0],
//     quantity: 200,
//     allocatedQuantity: 20,
//     value: {
//       costPrice: 450,
//       currency: "INR"
//     },
//     createdAt: new Date("2024-10-18T11:15:00"),
//     updatedAt: new Date("2025-04-12T14:20:00")
//   },
//   {
//     _id: "inv-3",
//     product: productsData[2],
//     warehouse: warehousesData[1],
//     quantity: 150,
//     allocatedQuantity: 30,
//     value: {
//       costPrice: 1200,
//       currency: "INR"
//     },
//     createdAt: new Date("2024-11-10T10:20:00"),
//     updatedAt: new Date("2025-04-08T09:15:00")
//   },
//   {
//     _id: "inv-4",
//     product: productsData[3],
//     warehouse: warehousesData[2],
//     quantity: 75,
//     allocatedQuantity: 15,
//     value: {
//       costPrice: 2500,
//       currency: "INR"
//     },
//     createdAt: new Date("2024-12-05T14:45:00"),
//     updatedAt: new Date("2025-03-25T16:30:00")
//   },
//   {
//     _id: "inv-5",
//     product: productsData[4],
//     warehouse: warehousesData[3],
//     quantity: 120,
//     allocatedQuantity: 0,
//     value: {
//       costPrice: 600,
//       currency: "INR"
//     },
//     createdAt: new Date("2025-01-12T12:30:00"),
//     updatedAt: new Date("2025-04-05T11:20:00")
//   },
//   {
//     _id: "inv-6",
//     product: productsData[5],
//     warehouse: warehousesData[4],
//     quantity: 250,
//     allocatedQuantity: 50,
//     value: {
//       costPrice: 180,
//       currency: "INR"
//     },
//     createdAt: new Date("2025-01-20T13:40:00"),
//     updatedAt: new Date("2025-04-17T15:10:00")
//   },
//   {
//     _id: "inv-7",
//     product: productsData[6],
//     warehouse: warehousesData[0],
//     quantity: 100,
//     allocatedQuantity: 20,
//     value: {
//       costPrice: 800,
//       currency: "INR"
//     },
//     createdAt: new Date("2025-02-10T11:15:00"),
//     updatedAt: new Date("2025-04-18T10:05:00")
//   }
// ];

// // Movement data
// const movementsData: Movement[] = [
//   {
//     _id: "mov-1",
//     type: "Incoming",
//     product: productsData[0],
//     toWarehouse: warehousesData[0],
//     quantity: 200,
//     reference: "PO-2025042501",
//     initiatedBy: usersData[0],
//     metadata: { supplier: "Punjab Agro Industries", invoice: "INV-4567" },
//     createdAt: new Date("2025-04-10T09:15:00"),
//     updatedAt: new Date("2025-04-10T09:15:00")
//   },
//   {
//     _id: "mov-2",
//     type: "Transfer",
//     product: productsData[1],
//     fromWarehouse: warehousesData[0],
//     toWarehouse: warehousesData[1],
//     quantity: 50,
//     reference: "TR-2025042502",
//     initiatedBy: usersData[1],
//     metadata: { reason: "Stock balancing" },
//     createdAt: new Date("2025-04-12T11:30:00"),
//     updatedAt: new Date("2025-04-12T11:30:00")
//   },
//   {
//     _id: "mov-3",
//     type: "Outgoing",
//     product: productsData[2],
//     fromWarehouse: warehousesData[1],
//     quantity: 30,
//     reference: "SO-2025042503",
//     initiatedBy: usersData[2],
//     metadata: { customer: "Chai Point Ltd", order: "ORDER-7890" },
//     createdAt: new Date("2025-04-14T14:20:00"),
//     updatedAt: new Date("2025-04-14T14:20:00")
//   },
//   {
//     _id: "mov-4",
//     type: "Incoming",
//     product: productsData[3],
//     toWarehouse: warehousesData[2],
//     quantity: 25,
//     reference: "PO-2025042504",
//     initiatedBy: usersData[3],
//     metadata: { supplier: "Tamil Handlooms Co-op", invoice: "INV-8901" },
//     createdAt: new Date("2025-04-15T10:45:00"),
//     updatedAt: new Date("2025-04-15T10:45:00")
//   },
//   {
//     _id: "mov-5",
//     type: "Transfer",
//     product: productsData[4],
//     fromWarehouse: warehousesData[3],
//     toWarehouse: warehousesData[0],
//     quantity: 40,
//     reference: "TR-2025042505",
//     initiatedBy: usersData[1],
//     metadata: { reason: "Warehouse consolidation" },
//     createdAt: new Date("2025-04-16T13:15:00"),
//     updatedAt: new Date("2025-04-16T13:15:00")
//   },
//   {
//     _id: "mov-6",
//     type: "Outgoing",
//     product: productsData[5],
//     fromWarehouse: warehousesData[4],
//     quantity: 60,
//     reference: "SO-2025042506",
//     initiatedBy: usersData[2],
//     metadata: { customer: "Foodhall Supermarkets", order: "ORDER-4567" },
//     createdAt: new Date("2025-04-17T15:30:00"),
//     updatedAt: new Date("2025-04-17T15:30:00")
//   },
//   {
//     _id: "mov-7",
//     type: "Incoming",
//     product: productsData[6],
//     toWarehouse: warehousesData[0],
//     quantity: 30,
//     reference: "PO-2025042507",
//     initiatedBy: usersData[0],
//     metadata: { supplier: "Karnataka Sweets Ltd", invoice: "INV-2345" },
//     createdAt: new Date("2025-04-18T11:45:00"),
//     updatedAt: new Date("2025-04-18T11:45:00")
//   }
// ];

// // Alert data
// const alertsData: Alert[] = [
//   {
//     _id: "alert-1",
//     type: "low-stock",
//     product: productsData[3],
//     warehouse: warehousesData[2],
//     threshold: 100,
//     currentValue: 75,
//     status: "active",
//     createdAt: new Date("2025-04-15T16:30:00"),
//     updatedAt: new Date("2025-04-15T16:30:00")
//   },
//   {
//     _id: "alert-2",
//     type: "expiry",
//     product: productsData[6],
//     warehouse: warehousesData[0],
//     currentValue: 15, // Days until expiry
//     status: "acknowledged",
//     acknowledgedBy: usersData[0],
//     acknowledgedAt: new Date("2025-04-16T10:15:00"),
//     notes: "Need to run a promotional offer on these items",
//     createdAt: new Date("2025-04-15T09:20:00"),
//     updatedAt: new Date("2025-04-16T10:15:00")
//   },
//   {
//     _id: "alert-3",
//     type: "discrepancy",
//     product: productsData[1],
//     warehouse: warehousesData[0],
//     currentValue: -15, // Units missing compared to system
//     status: "resolved",
//     acknowledgedBy: usersData[1],
//     acknowledgedAt: new Date("2025-04-14T14:10:00"),
//     resolvedAt: new Date("2025-04-17T11:30:00"),
//     notes: "Inventory count error - corrected during stock audit",
//     createdAt: new Date("2025-04-14T11:45:00"),
//     updatedAt: new Date("2025-04-17T11:30:00")
//   },
//   {
//     _id: "alert-4",
//     type: "low-stock",
//     product: productsData[2],
//     warehouse: warehousesData[1],
//     threshold: 200,
//     currentValue: 150,
//     status: "active",
//     createdAt: new Date("2025-04-18T09:15:00"),
//     updatedAt: new Date("2025-04-18T09:15:00")
//   },
//   {
//     _id: "alert-5",
//     type: "theft",
//     product: productsData[5],
//     warehouse: warehousesData[4],
//     currentValue: 20, // Units missing
//     status: "acknowledged",
//     acknowledgedBy: usersData[0],
//     acknowledgedAt: new Date("2025-04-18T16:45:00"),
//     notes: "Security footage being reviewed. Police report filed.",
//     createdAt: new Date("2025-04-18T15:20:00"),
//     updatedAt: new Date("2025-04-18T16:45:00")
//   }
// ];

// // Report data
// const reportsData: Report[] = [
//   {
//     _id: "report-1",
//     name: "Monthly Inventory Valuation - April 2025",
//     type: "inventory-valuation",
//     createdBy: usersData[0],
//     filters: { month: 4, year: 2025 },
//     data: {
//       totalValue: 2450000,
//       warehouseBreakdown: {
//         "Main Warehouse": 950000,
//         "North Facility": 600000,
//         "South Distribution": 450000,
//         "East Storage": 200000,
//         "West Fulfillment Center": 250000
//       }
//     },
//     format: "pdf",
//     createdAt: new Date("2025-04-18T17:30:00"),
//     updatedAt: new Date("2025-04-18T17:30:00")
//   },
//   {
//     _id: "report-2",
//     name: "Stock Movement Analysis Q1 2025",
//     type: "stock-movement",
//     createdBy: usersData[1],
//     filters: { startDate: "2025-01-01", endDate: "2025-03-31" },
//     data: {
//       totalMovements: 457,
//       byType: { Incoming: 180, Outgoing: 195, Transfer: 82 },
//       topProducts: ["Basmati Rice Premium", "Mustard Oil Premium", "Garam Masala Blend"]
//     },
//     format: "csv",
//     createdAt: new Date("2025-04-10T14:15:00"),
//     updatedAt: new Date("2025-04-10T14:15:00")
//   },
//   {
//     _id: "report-3",
//     name: "Slow-Moving Items - March 2025",
//     type: "slow-moving",
//     createdBy: usersData[0],
//     filters: { threshold: 30, period: "30 days" },
//     data: {
//       itemCount: 24,
//       warehouseDistribution: {
//         "Main Warehouse": 8,
//         "North Facility": 5,
//         "South Distribution": 4,
//         "East Storage": 3,
//         "West Fulfillment Center": 4
//       }
//     },
//     format: "pdf",
//     createdAt: new Date("2025-04-05T11:40:00"),
//     updatedAt: new Date("2025-04-05T11:40:00")
//   },
//   {
//     _id: "report-4",
//     name: "Fast-Moving Items - Q1 2025",
//     type: "fast-moving",
//     createdBy: usersData[1],
//     filters: { threshold: 100, period: "90 days" },
//     data: {
//       itemCount: 15,
//       topItems: [
//         { name: "Basmati Rice Premium", turnover: 4.5 },
//         { name: "Garam Masala Blend", turnover: 3.8 },
//         { name: "Darjeeling First Flush Tea", turnover: 3.2 }
//       ]
//     },
//     format: "json",
//     createdAt: new Date("2025-04-08T15:20:00"),
//     updatedAt: new Date("2025-04-08T15:20:00")
//   },
//   {
//     _id: "report-5",
//     name: "Upcoming Expiry Items - May 2025",
//     type: "expiry",
//     createdBy: usersData[3],
//     filters: { expiryWithin: "30 days" },
//     data: {
//       itemCount: 12,
//       totalValue: 145000,
//       categories: ["Sweets", "Personal Care", "Beverages"]
//     },
//     format: "pdf",
//     createdAt: new Date("2025-04-19T09:15:00"),
//     updatedAt: new Date("2025-04-19T09:15:00")
//   }
// ];

// // Export the data for use in application
// export {
//   usersData,
//   warehousesData,
//   productsData,
//   inventoryData,
//   movementsData,
//   alertsData,
//   reportsData
// };