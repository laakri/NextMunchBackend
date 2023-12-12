const mongoose = require("mongoose");
const User = require("./user");


const restaurantSchema = mongoose.Schema({

  nameP: { type: String , required: true},  
  descriptionP: { type: String  , required: true},
  imgP: { type: String  , required: true},
  categoryP: { type: String  , required: true},
  priceP: { type: String  , required: true},
  
  
}
,{ timestamps: true }
);



module.exports = mongoose.model("Restaurant", restaurantSchema);