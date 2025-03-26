const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
    ref: "User" // Virtual reference to User collection
  },
  cardNumber: { type: String, required: true, unique: true },
  expiry: { type: String, required: true },
  cvv: { type: String, required: true },
  type: { type: String, required: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Virtual populate to reference User collection based on email
cardSchema.virtual("user", {
  ref: "User",
  localField: "userEmail",
  foreignField: "email",
  justOne: true, // Only fetch one matching user
});

const Card = mongoose.model("Card", cardSchema);
module.exports = Card;
