import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Container, Row, Col, Button, Form, Alert } from "react-bootstrap";
import CardComponent from "./CardComponent";
import { motion } from "framer-motion";
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
  AmericanExpress: "37",
  Discover: "6",
  RuPay: "81",
};

const cardIcons = {
  Visa: <FaCcVisa size={50} />,
  MasterCard: <FaCcMastercard size={50} />,
  AmericanExpress: <FaCcAmex size={50} />,
  Discover: <FaCcDiscover size={50} />,
  RuPay: <FaCreditCard size={50} />,
};

const getCardStyles = (type) => {
  const cardStyles = {
    Visa: { bgColor: "#1A1F71", textColor: "#fff", iconColor: "#FFD700" },
    MasterCard: { bgColor: "#EB001B", textColor: "#fff", iconColor: "#FFB400" },
    AmericanExpress: {
      bgColor: "#2E77BC",
      textColor: "#fff",
      iconColor: "#FFD700",
    },
    Discover: { bgColor: "#FF6000", textColor: "#fff", iconColor: "#FFD700" },
    RuPay: { bgColor: "#005BAC", textColor: "#fff", iconColor: "#FFD700" },
  };
  return (
    cardStyles[type] || {
      bgColor: "#333",
      textColor: "#fff",
      iconColor: "#FFD700",
    }
  );
};

const generateLuhnValidNumber = (prefix) => {
  let length = 15;
  let number =
    prefix +
    Math.random()
      .toString()
      .slice(2, 2 + (length - prefix.length));
  return number + calculateLuhnCheckDigit(number);
};

const calculateLuhnCheckDigit = (number) => {
  let digits = number.split("").map(Number).reverse();
  let sum = digits.reduce((acc, digit, idx) => {
    if (idx % 2 === 0) {
      return acc + digit;
    } else {
      let double = digit * 2;
      return acc + (double > 9 ? double - 9 : double);
    }
  }, 0);
  return (10 - (sum % 10)) % 10;
};

const generateExpiryDate = () => {
  const year = new Date().getFullYear() + Math.floor(Math.random() * 5) + 1;
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
  return `${month}/${year}`;
};

const generateCVV = () => Math.floor(100 + Math.random() * 900).toString();

const Home = () => {
  const { user } = useContext(AuthContext);
  const [selectedType, setSelectedType] = useState("Visa");
  const [generatedCard, setGeneratedCard] = useState(null);
  const [generatedCardType, setGeneratedCardType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleGenerate = async () => {
    if (!user || !user.email) {
      alert("User details are missing. Please log in.");
      return;
    }

    const newCard = {
      userEmail: user.email,
      cardNumber: generateLuhnValidNumber(cardPrefixes[selectedType]),
      expiry: generateExpiryDate(),
      cvv: generateCVV(),
      type: selectedType,
      name: user.name.toUpperCase(),
    };

    setGeneratedCard(newCard);
    setGeneratedCardType(selectedType);

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
      setMessage("Error saving card. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const { bgColor, textColor, iconColor } = getCardStyles(generatedCardType);
  const defaultIcon = <FaCreditCard size={50} />;

  return (
    <Container className="mt-5 text-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h1 className="mb-4 text-primary">Credit Card Generator</h1>
        <p className="text-muted">
          Generate a secure credit card instantly for testing or educational
          purposes.
        </p>
      </motion.div>

      <Row className="justify-content-center mt-4">
        <Col md={6}>
          <Form>
            <Form.Group>
              <Form.Label className="fw-bold">Select Card Type</Form.Label>
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
            className="mt-3 w-100"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? "Saving..." : "Generate Card"}
          </Button>

          {message && (
            <Alert
              className="mt-3"
              variant={message.includes("success") ? "success" : "danger"}
            >
              {message}
            </Alert>
          )}

          {generatedCard && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <CardComponent
                generatedCard={generatedCard}
                bgColor={bgColor}
                textColor={textColor}
                icon={React.cloneElement(
                  cardIcons[generatedCardType] || defaultIcon,
                  { color: iconColor }
                )}
              />
            </motion.div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
