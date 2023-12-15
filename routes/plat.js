const express = require("express");
const Plat = require("../models/plat");
const router = express.Router();

router.post("/plat", async (req, res) => {
  try {
    const { nameP, descriptionP, imgP, categoryP, priceP } = req.body;

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
    console.log(savedPlat);

    // Respond with a success message and the ID of the saved plat
    res.status(201).json({
        message: "Plat saved successfully",
        platId: savedPlat._id,
      });
    } catch (error) {
      // If an error occurs, log the error and respond with a 500 status code and an error message
      console.error("Error saving plat:", error);
      res.status(500).json({ error: error.message });
  }
});

router.put('/plats/:id', async (req, res) => {
    const platId = req.params.id;
    const updateData = req.body;
  
    try {
      // Find the Plat by ID and update it
      const updatedPlat = await Plat.findByIdAndUpdate(platId, updateData, { new: true });
  
      if (!updatedPlat) {
        return res.status(404).json({ error: 'Plat not found' });
      }
  
      // Send the updated Plat as a response
      res.json(updatedPlat);
    } catch (error) {
    res.status(500).json({ error: error.message });
      
    }
  });

module.exports = router;
