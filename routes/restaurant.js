const express = require("express");
const Restaurant = require("../models/resataurant");
const router = express.Router();

// Route pour ajouter un restaurant
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

    const restaurant = new Restaurant({
      ownerId: ownerId,
      cin: cin,
      bannerImg: bannerImg,
      mainImg: mainImg,
      nameR: nameR,
      descriptionR: descriptionR,
      location: location,
      contact: contact,
    });

    const nouvelRestaurant = restaurant.save();
    res.status(201).json(nouvelRestaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;
