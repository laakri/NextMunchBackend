const mongoose = require("mongoose");
const User = require("./user");

const restaurantSchema = mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: User },
    cin: { type: Number, required: true },
    bannerImg: {
      type: String,
      default: "https://i.postimg.cc/28VWdMnj/image.png",
    },
    mainImg: {
      type: String,
      default: "https://i.postimg.cc/28VWdMnj/image.png",
    },
    nameR: { type: String, required: true },
    descriptionR: { type: String },
    location: { type: String, required: true },
    contact: { type: String, required: true },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    openDates: { type: String },
    closeDates: { type: String },
  },
  { timestamps: true }
);

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;
