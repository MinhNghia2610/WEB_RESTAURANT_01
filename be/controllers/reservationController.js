// be/controllers/reservationController.js
import Reservation from "../models/Reservation.js";

export const addReservation = async (req, res) => {
  try {
    const newRes = await Reservation.create(req.body);
    res.status(201).json({ message: "Đặt bàn thành công", data: newRes });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getReservations = async (req, res) => {
  try {
    const list = await Reservation.find().sort({ date: 1, time: 1 });
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
