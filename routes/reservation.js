const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Reservation = require("../models/reservation");
const Plat = require("../models/plat");

router.post("/reservation/:userId/:restoId", async (req, res) => {
  const userId = req.params.userId;
  const restoId = req.params.restoId;
  const { userName, userPhone, userLocation, platQuantities, totalPrice } =
    req.body;
  try {
    const reservationEntry = new Reservation({
      platQuantities,
      userId,
      restoId,
      userName,
      userPhone,
      userLocation,
      totalPrice,
    });
    console.log(reservationEntry);

    await reservationEntry.save();

    res.json({ message: "Réservation avec succès." });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Erreur lors de la réservation.",
      details: error.message,
    });
  }
});
router.get("/getreservation/:restoId", async (req, res) => {
  try {
    const restoId = req.params.restoId;

    const reservations = await Reservation.find({ restoId }).populate({
      path: "platQuantities.platId",
      model: "Plat",
      select: "nameP descriptionP priceP",
    });

    res.json({ reservations });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des réservations." });
  }
});
module.exports = router;
