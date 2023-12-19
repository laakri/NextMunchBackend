const express = require("express");
const Plat = require("../models/plat");
const router = express.Router();
const multer = require("multer"); // For handling file uploads
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/plat-images"); // Change the destination folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.post("/plat", upload.single("imgP"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const url = req.protocol + "://" + req.get("host");
    let imgP = url + "/uploads/plat-images/" + req.file.filename;
    const { nameP, descriptionP, categoryP, priceP } = req.body;

    const newPlat = new Plat({
      nameP,
      descriptionP,
      imgP,
      categoryP,
      priceP,
    });

    const savedPlat = await newPlat.save();

    res.status(201).json({
      message: "Plat saved successfully",
      platId: savedPlat._id,
      imgPath: imgP ? path.join("plat-images", imgP) : null,
    });
  } catch (error) {
    console.error("Error saving plat:", error);
    res.status(500).json({ error: error.message });
  }
});

router.put("/plats/:id", async (req, res) => {
  const platId = req.params.id;
  const updateData = req.body;

  try {
    // Find the Plat by ID and update it
    const updatedPlat = await Plat.findByIdAndUpdate(platId, updateData, {
      new: true,
    });

    if (!updatedPlat) {
      return res.status(404).json({ error: "Plat not found" });
    }

    // Send the updated Plat as a response
    res.json(updatedPlat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/liste-plats", async (req, res) => {
  try {
    // Fetch all plats from the database
    const plats = await Plat.find();

    // Send the list of plats as a response
    res.status(200).json(plats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
