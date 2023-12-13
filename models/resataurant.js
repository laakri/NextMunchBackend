const mongoose = require("mongoose");
const User = require("./user");

const restaurantSchema = mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: User },
    cin: { type: Number, required: true },
    bannerImg: { type: String },
    mainImg: { type: String },
    nameR: { type: String, required: true },
    descriptionR: { type: String },
    location: { type: String, required: true },
    contact: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Restaurant", restaurantSchema);
