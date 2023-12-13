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

//Route pour get restaurant 

// Route pour récupérer tous les restaurants
router.get("/restaurants/:id", async (req, res) => {
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
