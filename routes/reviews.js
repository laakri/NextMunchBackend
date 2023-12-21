const express = require("express");
const router = express.Router();
const Review = require("../models/review");

router.post("/rating/:userId/:restoId", async (req, res) => {
  const userId = req.params.userId;
  const restoId = req.params.restoId;
  const { rating, text } = req.body;

  try {
    const reviewEntry = new Review({
      userId,
      restoId,
      text,
      rating,
    });

    await reviewEntry.save();

    res.json({ message: "Évaluation soumise avec succès." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur lors de la soumission de l'évaluation." });
  }
});

module.exports = router;
