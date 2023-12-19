const express = require("express");
const Plat = require("../models/plat");
const router = express.Router();
const multer = require('multer'); // For handling file uploads
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/plat-images'); // Change the destination folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });


router.post("/plat", upload.single('imgP'), async (req, res) => {
  try {
    const { nameP, descriptionP, categoryP, priceP } = req.body;
    const imgP = req.file ? req.file.filename : null; // Check if a file was uploaded

    // Create a new Plat instance
    const newPlat = new Plat({
      nameP,
      descriptionP,
      imgP,
      categoryP,
      priceP,
    });

    // Save the new plat to the database
    const savedPlat = await newPlat.save();

    // Respond with a success message, the ID of the saved plat, and the file path
    res.status(201).json({
      message: "Plat saved successfully",
      platId: savedPlat._id,
      imgPath: imgP ? path.join('plat-images', imgP) : null, // Provide the full path if an image was uploaded

  } )}catch (error) {
    // If an error occurs, log the error and respond with a 500 status code and an error message
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

//delete an array of plat 
router.post('/deleteArrayP', async (req, res) => {
  try {
    const { platIds } = req.body;

    if (!platIds || !Array.isArray(platIds) || platIds.length === 0) {
      return res.status(400).json({ message: 'Invalid plat IDs provided.' });
    }
    const result = await Plat.deleteMany({ _id: { $in: platIds } });

    res.status(200).json({
      message: 'Plats deleted successfully.',
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error('Error deleting plats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
//set an array of plat hidden
router.post('/setPlatHidden', async (req, res) => {
  try {
    const { platIds } = req.body;

    if (!platIds || !Array.isArray(platIds)) {
      return res.status(400).json({ message: 'Invalid platIds array' });
    }

    const updateResult = await Plat.updateMany(
      { _id: { $in: platIds } },
      { $set: { hidden: true } }
    );

    return res.json({
      message: 'Plats sitten hidden ',
      updatedCount: updateResult.nModified
    });
  } catch (error) {
    console.error('Error in setting hidden for plats:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
