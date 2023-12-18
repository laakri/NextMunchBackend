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
router.get('/list', async (req, res) => {
  try {
    const restaurants = await Restaurant.find().populate('ownerId', 'name email');
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    await Restaurant.findByIdAndDelete(id);

    res.status(200).json({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    console.error('Error deleting restaurant', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
module.exports = router;
