import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import MyNavbar from "./MyNavbar";
import CardComponent from "./CardComponent";
import {
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaCcDiscover,
  FaCreditCard,
} from "react-icons/fa";

const cardPrefixes = {
  Visa: "4",
  MasterCard: "5",
  AmericanExpress: "3",
  Discover: "6",
  RuPay: "81",
};

const cardIcons = {
  Visa: <FaCcVisa size={50} color="#1A1F71" />,
  MasterCard: <FaCcMastercard size={50} color="#EB001B" />,
  AmericanExpress: <FaCcAmex size={50} color="#2E77BC" />,
  Discover: <FaCcDiscover size={50} color="#FF6000" />,
  RuPay: <FaCreditCard size={50} color="#005BAC" />,
};

const generateLuhnValidNumber = (prefix) => {
  let cardNumber = prefix;
  while (cardNumber.length < 15) {
    cardNumber += Math.floor(Math.random() * 10);
  }

  let sum = 0;
  let shouldDouble = true;

  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber[i], 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }

  const checkDigit = (10 - (sum % 10)) % 10;
  return (cardNumber + checkDigit).replace(/(.{4})/g, "$1 ").trim();
};

const generateExpiryDate = () => {
  const year = new Date().getFullYear() + Math.floor(Math.random() * 5) + 1;
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
  return `${month}/${year}`;
};

const generateCVV = () => String(Math.floor(Math.random() * 900) + 100);

const Home = () => {
  const { user } = useContext(AuthContext);
  const [selectedType, setSelectedType] = useState("Visa");
  const [generatedCard, setGeneratedCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleGenerate = async () => {
    if (!user || !user.email) {
      alert("User details are missing. Please log in.");
      return;
    }

    const newCard = {
      userEmail: user.email, // Use email instead of user._id
      cardNumber: generateLuhnValidNumber(cardPrefixes[selectedType]),
      expiry: generateExpiryDate(),
      cvv: generateCVV(),
      type: selectedType,
      name: user.name.toUpperCase(),
    };

    setGeneratedCard(newCard);
    await sendCardToBackend(newCard);
  };

  const sendCardToBackend = async (cardData) => {
    setLoading(true);
    setMessage("");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/cards/save",
        cardData
      );
      setMessage(
        response.data.success
          ? "Card saved successfully!"
          : response.data.message || "Error saving card."
      );
    } catch (error) {
      console.error(
        "Error saving card:",
        error.response?.data || error.message
      );
      setMessage("Error saving card. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MyNavbar />
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={6} className="text-center">
            <h2 className="mb-4">Credit Card Generator</h2>

            <Form>
              <Form.Group>
                <Form.Label>Select Card Type</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  {Object.keys(cardPrefixes).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Form>

            <Button
              variant="primary"
              className="mt-3"
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? "Saving..." : "Generate Card"}
            </Button>

            {message && <p className="mt-3">{message}</p>}

            {generatedCard && (
              <CardComponent
                generatedCard={generatedCard}
                cardIcons={cardIcons}
              />
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;
