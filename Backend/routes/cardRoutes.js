const express = require("express");
const router = express.Router();
const Card = require("../models/Card");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const MAX_CARDS = 5; // Set limit for the number of cards per user

// ✅ Store a generated card
router.post("/save", async (req, res) => {
  try {
    const { userEmail, cardNumber, expiry, cvv, type, name } = req.body;
    if (!userEmail || !cardNumber || !expiry || !cvv || !type || !name) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    // Check user's existing card count first
    const userCardCount = await Card.countDocuments({ userEmail });
    if (userCardCount >= MAX_CARDS) {
      return res.status(403).json({ success: false, message: "You have reached the maximum limit of 5 cards. Delete an existing card to add a new one." });
    }

    // Prevent duplicate card numbers
    const existingCard = await Card.findOne({ userEmail, cardNumber });
    if (existingCard) {
      return res.status(409).json({ success: false, message: "This card already exists." });
    }

    const newCard = new Card({ userEmail, cardNumber, expiry, cvv, type, name });
    await newCard.save();

    res.status(201).json({ success: true, message: "Card saved successfully!", card: newCard });
  } catch (error) {
    console.error("Error saving card:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
});

// ✅ Get all cards of a user by email
router.get("/:userEmail", async (req, res) => {
  try {
    const userEmail = req.params.userEmail;
    const cards = await Card.find({ userEmail });
    res.status(200).json({ success: true, cards });
  } catch (error) {
    console.error("Error fetching cards:", error);
    res.status(500).json({ success: false, message: "Failed to fetch cards.", error: error.message });
  }
});

// ✅ Delete a card by ID (with password verification)
router.post("/delete", async (req, res) => {
  try {
    const { email, cardId, password } = req.body;
    if (!email || !cardId || !password) {
      return res.status(400).json({ success: false, message: "Email, Card ID, and Password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Incorrect password." });
    }

    const card = await Card.findOneAndDelete({ _id: cardId, userEmail: email });
    if (!card) {
      return res.status(404).json({ success: false, message: "Card not found or already deleted." });
    }

    res.status(200).json({ success: true, message: "Card deleted successfully!" });
  } catch (error) {
    console.error("Error deleting card:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
});

module.exports = router;
