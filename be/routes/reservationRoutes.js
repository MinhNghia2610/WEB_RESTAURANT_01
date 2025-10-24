// be/routes/reservationRoutes.js
import express from "express";
import { addReservation, getReservations } from "../controllers/reservationController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", addReservation); // public
router.get("/", protect, adminOnly, getReservations); // admin can view all

export default router;
