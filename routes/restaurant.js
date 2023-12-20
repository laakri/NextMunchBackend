const express = require("express");
const Restaurant = require("../models/resataurant");
const categories = require("../models/categories");
const router = express.Router();
const multer = require("multer");
const { promisify } = require("util");
const fs = require("fs");
const unlinkAsync = promisify(fs.unlink);
const path = require("path");
const { log } = require("console");

router.post(
  "/restaurants/:restaurantId/ajouter-categories",
  async (req, res) => {
    try {
      const restaurantId = req.params.restaurantId;
      const categorieId = req.body.categorie;

      // Find the existing restaurant
      const existingRestaurant = await Restaurant.findById(restaurantId);

      // Check if the restaurant exists
      if (!existingRestaurant) {
        return res.status(404).json({ message: "Restaurant non trouvé." });
      }

      // Add the category to the list of categories of the restaurant
      if (categorieId) {
        existingRestaurant.categories.push(categorieId);
      }

      // Save the changes to the database
      const updatedRestaurant = await existingRestaurant.save();

      res.status(200).json({
        message: "Catégorie ajoutée avec succès au restaurant.",
        updatedRestaurant,
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

router.post("/restaurants", async (req, res) => {
  try {
    const { ownerId, cin, nameR, descriptionR, location, contact, categories } =
      req.body;

    // Create a new restaurant instance
    const newRestaurant = new Restaurant({
      ownerId,
      cin,
      nameR,
      descriptionR,
      location,
      contact,
      categories,
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

router.get('/liste-categ/:restaurantId', async (req, res) => {
  try {
    const restaurantId = req.params.restaurantId;

    const restaurant = await Restaurant.findById(restaurantId).populate('categories');

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found.' });
    }

    const categories = restaurant.categories;

    res.status(200).json(categories);
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
router.delete("/delete/:id", async (req, res) => {
    try {
      const { id } = req.params;
  
      const restaurant = await Restaurant.findById(id);
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }
  
      await Restaurant.findByIdAndDelete(id);
  
      res.status(200).json({ message: "Restaurant deleted successfully" });
    } catch (error) {
      console.error("Error deleting restaurant", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });



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

/*
router.get('/listRestoByCategory', async (req, res) => {
  try {
    const { categories } = req.query;

    if (!categories || categories.length === 0) {
      return res.status(400).json({ error: 'Categories parameter is required.' });
    }

    // Convert the categories parameter to an array if it's a string
    const categoriesArray = Array.isArray(categories) ? categories : categories.split(',');

    const query = {
      categories: { $all: categoriesArray },
    };

    console.log('query', query);

    const restaurants = await Restaurant.find(query);
    res.json(restaurants);
  } catch (error) {
    console.error('Error fetching restaurants by category', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});*/
/*
router.get('/listRestoSearch', async (req, res) => {

  const searchTerm = req.query.q;

  try {
    const results = await Restaurant.find({ nameR: { $regex: searchTerm, $options: 'i' } });
    res.json(results);
  } catch (error) {
    console.error('Error searching restaurants:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

*/
router.get('/listRestoBySearch', async (req, res) => {
  const { name, categories } = req.query;
  try {
    let query = {};
    if (name) {
      query.nameR = { $regex: name, $options: 'i' };    }

    if (categories && categories.length > 0) {
      const categoriesArray = Array.isArray(categories) ? categories : categories.split(',');
      query.categories = { $all: categoriesArray };
    }

    if (Object.keys(query).length === 0) {
      return res.status(400).json({ error: 'Name or categories are required.' });
    }

    console.log('query', query);

    const restaurants = await Restaurant.find(query);
    res.json(restaurants);
  } catch (error) {
    console.error('Error fetching restaurants by search', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});





module.exports = router;
