import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/user.routes.js";
import movementRoutes from "./routes/movements.routes.js";
import warehouseRoutes from "./routes/warehouse.routes.js";
import alertsRoutes from "./routes/alerts.routes.js";
import inventoryRoutes from "./routes/inventory.routes.js";

const app = express();

app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = ["http://localhost:8080", "http://localhost:3000"];
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "16kb" })); //accept data in json format with specified limit

app.use(express.urlencoded({ extended: true, limit: "16kb" })); //to handle data that comes from urls and forms

app.use(express.static("public")); //all static files are in public folder

app.use(cookieParser());

//routes import

//routes declaration
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/warehouse", warehouseRoutes);
app.use("/api/v1/movements", movementRoutes);
app.use("/api/v1/alerts", alertsRoutes);
app.use("/api/v1/inventory", inventoryRoutes);

export default app;
