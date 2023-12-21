const mongoose = require("mongoose");
const reviewsSchema = mongoose.Schema(
    {
      userId: { type: String, required: true },
      restoId: { type: String, required: true },
      text: { type: String, required: true },
      rating: { type: Number, required: true },

    },
    { timestamps: true }
  );
  
  module.exports = mongoose.model("reviews", reviewsSchema);
  