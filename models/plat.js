const mongoose = require("mongoose");

const platSchema = mongoose.Schema(
  {
    nameP: { type: String, required: true },
    descriptionP: { type: String, required: true },
    imgP: { type: String, required: true },
    categoryP: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "categorie",
      },
    ],
    idResto :{type:mongoose.Schema.Types.ObjectId, required: true, ref:"Restaurant"},
    priceP: { type: String, required: true },
    hidden: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Plat", platSchema);
