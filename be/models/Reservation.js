// be/models/Reservation.js
import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    date: { type: String, required: true }, // keep simple string or use Date if preferred
    time: { type: String, required: true },
    guests: { type: Number, required: true },
    note: { type: String, default: "" },
    status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
  },
  { timestamps: true }
);

const Reservation = mongoose.model("Reservation", reservationSchema);
export default Reservation;
