const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Reservation = require("../models/reservation");
const Plat = require("../models/plat");

router.post("/reservation/:userId/:restoId", async (req, res) => {
  const userId = req.params.userId;
  const restoId = req.params.restoId;
  const { userName, userPhone, userLocation, platQuantities } = req.body;

  try {
    // Vérifier si les plats existent avant de les réserver
    const platQuantitiesWithPrices = await Promise.all(platQuantities.map(async (item) => {
      const plat = await Plat.findById(item.platId);
      if (!plat) {
        throw new Error(`Le plat avec l'ID ${item.platId} n'existe pas.`);
      }
      
      // Vérifier si le prix du plat est une chaîne numérique valide
      const platPrice = parseFloat(plat.priceP);
      
      // Vérifier si le prix est un nombre valide
      if (isNaN(platPrice)) {
        throw new Error(`Le plat avec l'ID ${item.platId} a un prix non valide.`);
      }

      return {
        platId: item.platId,
        numberOfPlates: item.numberOfPlates,
        price: platPrice,
      };
    }));

    // Calculer le totalPrice des plats réservés
    const totalPrice = platQuantitiesWithPrices.reduce((acc, plat) => {
      return acc + plat.numberOfPlates * plat.price;
    }, 0);

    const reservationEntry = new Reservation({
      platQuantities: platQuantitiesWithPrices,
      userId,
      restoId,
      userName,
      userPhone,
      userLocation,
      totalPrice,
    });

    await reservationEntry.save();

    res.json({ message: "Réservation avec succès." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la réservation.", details: error.message });
  }
});

module.exports = router;
