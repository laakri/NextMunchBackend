const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const enumValues = require("mongoose-enumvalues");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: "false" },
    roles: {
      type: [
        {
          type: String,
          enum: ["free", "silver", "plat"],
        },
      ],
      default: "free",
    },
    roleChangeDate: { type: Date }, // Add roleChangeDate field
  },
  { timestamps: true }
);

const enumOptions = {};

userSchema.plugin(enumValues, enumOptions);

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
