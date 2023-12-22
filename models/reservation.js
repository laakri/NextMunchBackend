const mongoose = require("mongoose");

const reservationSchema = mongoose.Schema(
  {
    platQuantities: [
      {
        platId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Plat",
        },
        numberOfPlates: {
          type: Number,
          required: true,
        },
      },
    ],
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
    userName: { type: String, required: true },
    userPhone: { type: String, required: true },
    userLocation: { type: String, required: true },
    totalPrice: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("reservation", reservationSchema);
