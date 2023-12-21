const mongoose = require("mongoose");
const reviewsSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    restoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    text: { type: String, required: true },
    rating: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("reviews", reviewsSchema);
