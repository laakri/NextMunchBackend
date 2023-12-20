const mongoose = require("mongoose");

const eventSchema = mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    eventName: { type: String, required: true },
    eventPrice: { type: Number, required: true },
    numberOfPersons: { type: Number, required: true },
    platIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Plat" }],
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    selectedImage: { type: String, required: true },
    totalPrice: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
