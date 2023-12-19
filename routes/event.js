const express = require("express");
const router = express.Router();
const Event = require("../models/event");
const Restaurant = require("../models/resataurant");

// Route to add an event for a restaurant
router.post("/add-event", async (req, res) => {
  try {
    const { restaurantId, price, numberOfPeople, platIds, startDate, endDate } =
      req.body;

    // Check if the restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found." });
    }

    // Create a new event instance
    const newEvent = new Event({
      restaurantId,
      price,
      numberOfPeople,
      platIds,
      startDate,
      endDate,
    });

    // Save the event to the database
    await newEvent.save();

    res.status(201).json({ message: "Event added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
