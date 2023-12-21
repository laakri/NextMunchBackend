const express = require("express");
const router = express.Router();
const Review = require('../models/review'); // Adjust the path accordingly

router.post('/rating/:userId/:restoId', async (req, res) => {
    const userId = req.params.userId;
    const restoId = req.params.restoId;
    const { rating, text } = req.body;

    try {
        let reviewEntry = await Review.findOne({ userId, restoId });

        if (!reviewEntry) {
            reviewEntry = new Review({
                userId,
                restoId,
                text,
                rating: [rating]
            });
        } else {
            reviewEntry.rating.push(rating);
        }

        // Calculate the new average rating
        const averageRating = reviewEntry.rating.reduce((acc, val) => acc + val, 0) / reviewEntry.rating.length;

        // Update the review entry with the new average rating
        reviewEntry.rating = averageRating;
        
        // Save the updated review entry
        await reviewEntry.save();

        res.json({ message: 'Évaluation soumise avec succès.', averageRating });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la soumission de l\'évaluation.' });
    }
});

module.exports = router;
