const express = require("express");
const Restaurant = require("../models/resataurant");
const router = express.Router();

router.post("/restaurants", async (req, res) => {
  try {
    const {
      ownerId,
      cin,
      bannerImg,
      mainImg,
      nameR,
      descriptionR,
      location,
      contact,
    } = req.body;

    // Create a new restaurant instance
    const newRestaurant = new Restaurant({
      ownerId,
      cin,
      bannerImg,
      mainImg,
      nameR,
      descriptionR,
      location,
      contact,
    });

    // Save the restaurant to the database
    const savedRestaurant = await newRestaurant.save();

    // Return the created restaurant's ID in the response
    res
      .status(201)
      .json({
        message: "Restaurant saved successfully",
        restaurantId: savedRestaurant._id,
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route pour récupérer tous les restaurants
router.get("/restaurant/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant non trouvé." });
    }
    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;
