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
// GET route for retrieving reviews
router.get('/getrating/:restoId', async (req, res) => {
    const restoId = req.params.restoId;

    try {
        const reviews = await Review.find({ restoId });

        if (reviews.length > 0) {
            // Calculate the average rating
            const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

            res.json({  averageRating });
        } else {
            res.json({ message: 'Aucune évaluation pour cet utilisateur et ce restaurant.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la récupération des évaluations.' });
    }
});

module.exports = router;
