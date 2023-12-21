const express = require("express");
const router = express.Router();
const Event = require("../models/event");
const Restaurant = require("../models/resataurant");

router.post("/addEvent", async (req, res) => {
  try {
    const {
      restaurantId,
      eventName,
      eventPrice,
      numberOfPersons,
      platIds,
      startDate,
      endDate,
      selectedImage,
      totalPrice,
    } = req.body;

    const newEvent = new Event({
      restaurantId,
      eventName,
      eventPrice,
      numberOfPersons,
      platIds,
      startDate,
      endDate,
      selectedImage,
      totalPrice,
    });

    const savedEvent = await newEvent.save();

    res.status(201).json(savedEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
// GET events for a specific restaurant ID
router.get("/getEvents/:restaurantId", async (req, res) => {
  try {
    const restaurantId = req.params.restaurantId;

    const events = await Event.find({ restaurantId });

    res.json({ events });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = router;
