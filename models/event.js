const mongoose = require("mongoose");

const eventSchema = mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    price: { type: Number, required: true },
    numberOfPeople: { type: Number, required: true },
    platIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Plat" }],
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
