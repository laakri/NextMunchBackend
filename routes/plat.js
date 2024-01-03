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
//get Plats Info an array of plat
router.post("/getPlatsInfo", async (req, res) => {
  try {
    // Extract the array of plat IDs from the request body
    const platIds = req.body.platIds;

    // Find the plats with the specified IDs and select the required fields
    const platsInfo = await Plat.find({ _id: { $in: platIds } }).select(
      "nameP descriptionP imgP priceP"
    );

    res.json({ platsInfo });
  } catch (error) {
    console.error("Error fetching plat information:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

//delete an array of plat
router.post("/deleteArrayP", async (req, res) => {
  try {
    const { platIds } = req.body;

    if (!platIds || !Array.isArray(platIds) || platIds.length === 0) {
      return res.status(400).json({ message: "Invalid plat IDs provided." });
    }
    const result = await Plat.deleteMany({ _id: { $in: platIds } });

    res.status(200).json({
      message: "Plats deleted successfully.",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting plats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//set a plat or  array  of plat hidden
router.post("/setPlatHidden", async (req, res) => {
  try {
    const { platIds } = req.body;

    if (!platIds) {
      return res.status(400).json({ message: "platIds parameter is required" });
    }

    const platIdsArray = Array.isArray(platIds) ? platIds : [platIds];

    const updateResult = await Plat.updateMany(
      { _id: { $in: platIdsArray } },
      { $set: { hidden: true } }
    );

    return res.json({
      message: "Plats successfully set as hidden",
      updatedCount: updateResult.nModified,
    });
  } catch (error) {
    console.error("Error in setting hidden for plats:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;
