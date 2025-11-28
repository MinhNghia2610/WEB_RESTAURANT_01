import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import dishRoutes from "./routes/dishRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import dashboardRoutes from './routes/dashboardRoutes.js';
import reservationRoutes from "./routes/reservationRoutes.js";
//import chatbotRoutes from "./routes/chatbotRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import cartRoutes from "./routes/cartRoutes.js";

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/dishes", dishRoutes);
app.use("/api/orders", orderRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/cart", cartRoutes);
//app.use("/api/chatbot", chatbotRoutes);

app.get("/", (req, res) => res.send("🍽️ L'ESSENCE Backend is running"));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));