const express = require("express");
const Restaurant = require("../models/resataurant");
const router = express.Router();

// Route pour ajouter un restaurant
router.post("/restaurants", async (req, res) => {
  try {
    const { ownerId, cin, nameR, location, contact } = req.body;

    // Validate ownerId as a valid ObjectId
    const isValidObjectId = mongoose.Types.ObjectId.isValid(ownerId);
    if (!isValidObjectId) {
      return res.status(400).json({ error: "Invalid ownerId" });
    }

    // Create a new restaurant
    const newRestaurant = new Restaurant({
      ownerId: ownerId,
      cin: cin,
      nameR: nameR,
      location: location,
      contact: contact,
    });

    // Save the restaurant to the database
    const savedRestaurant = await newRestaurant.save();

    res.status(201).json(savedRestaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route pour récupérer tous les restaurants
router.get("/restaurant/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      // Si aucun restaurant n'est trouvé avec l'ID spécifié
      return res.status(404).json({ message: "Restaurant non trouvé." });
    }
    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;
