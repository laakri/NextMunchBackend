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

router.get("/getrating/:restoId", async (req, res) => {
  const restoId = req.params.restoId;

  try {
    const reviews = await Review.find({ restoId }).populate("userId", "name");

    if (reviews.length > 0) {
      // Calculate the average rating
      const averageRating =
        reviews.reduce((acc, review) => acc + review.rating, 0) /
        reviews.length;

      // Count the votes for each star rating
      const ratingsCount = {};
      for (let i = 1; i <= 5; i++) {
        const count = reviews.filter((review) => review.rating === i).length;
        ratingsCount[i] = count;
      }

      res.json({ reviews, averageRating, ratingsCount });
    } else {
      res.json({
        message: "Aucune évaluation pour cet utilisateur et ce restaurant.",
      });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des évaluations." });
  }
});

module.exports = router;