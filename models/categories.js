const mongoose = require("mongoose");
const categorieSchema = mongoose.Schema(
  {
    nameCat: { type: String, required: true },
    imgCat: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("categorie", categorieSchema);
