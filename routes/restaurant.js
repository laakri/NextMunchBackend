const express = require("express");
const Restaurant = require("../models/resataurant");
const router = express.Router();
const multer = require("multer");
const { promisify } = require("util");
const fs = require("fs");
const unlinkAsync = promisify(fs.unlink);
const path = require("path");

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
    res.status(201).json({
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
/****************  Update Restaurant ***************** */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/restaurant-images");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage: storage });

router.patch(
  "/UpdateRestaurant/:restaurantId",
  upload.fields([
    { name: "mainImg", maxCount: 1 },
    { name: "bannerImg", maxCount: 1 },
  ]),
  async (req, res) => {
    const { restaurantId } = req.params;
    const updateParams = req.body;

    try {
      const url = req.protocol + "://" + req.get("host");

      // Check if the restaurant exists
      const existingRestaurant = await Restaurant.findById(restaurantId);
      if (!existingRestaurant) {
        return res.status(404).json({ error: "Restaurant not found" });
      }

      // Handle image upload for mainImg
      if (req.files && req.files["mainImg"]) {
        updateParams.mainImg =
          url +
          "/uploads/restaurant-images/" +
          req.files["mainImg"][0].filename;
      }

      // Handle image upload for bannerImg
      if (req.files && req.files["bannerImg"]) {
        updateParams.bannerImg =
          url +
          "/uploads/restaurant-images/" +
          req.files["bannerImg"][0].filename;
      }

      // Update the restaurant with the provided parameters
      await Restaurant.findByIdAndUpdate(restaurantId, updateParams);

      res.status(200).json({ message: "Restaurant updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

module.exports = router;
