const express = require("express");
const router = express.Router();
const Card = require("../models/Card");

// ✅ Store a generated card
router.post("/save", async (req, res) => {
  try {
    const { userEmail, cardNumber, expiry, cvv, type, name } = req.body;

    if (!userEmail || !cardNumber || !expiry || !cvv || !type || !name) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newCard = new Card({ userEmail, cardNumber, expiry, cvv, type, name });
    await newCard.save();

    res.status(201).json({ message: "Card saved successfully!" });
  } catch (error) {
    console.error("Error saving card:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});

// ✅ Get all cards of a user by email
router.get("/:userEmail", async (req, res) => {
  try {
    const userEmail = req.params.userEmail;
    const cards = await Card.find({ userEmail });

    if (!cards.length) {
      return res.status(404).json({ message: "No cards found for this user." });
    }

    res.status(200).json(cards);
  } catch (error) {
    console.error("Error fetching cards:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});

module.exports = router;
