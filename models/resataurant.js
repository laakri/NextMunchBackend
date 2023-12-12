const mongoose = require("mongoose");
const User = require("./user");


const restaurantSchema = mongoose.Schema({

  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: User },  
  bannerImg: { type: String  , required: true},
  mainImg: { type: String  , required: true},
  nameR: { type: String  , required: true},
  descriptionR: { type: String  , required: true},
  location: { type: String  , required: true},
  contact: { type: String  , required: true},
  
}
,{ timestamps: true }
);



module.exports = mongoose.model("Restaurant", restaurantSchema);