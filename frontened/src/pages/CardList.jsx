import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import CardComponent from "./CardComponent";
import { motion } from "framer-motion";
import {
  Container,
  Row,
  Col,
  Alert,
  Modal,
  Button,
  Form,
} from "react-bootstrap";
import {
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaCcDiscover,
  FaCreditCard,
  FaTrash,
} from "react-icons/fa";

const CardList = () => {
  const { user } = useContext(AuthContext);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [password, setPassword] = useState("");
  const [deleteError, setDeleteError] = useState(null);

  // Card Styles Mapping
  const cardStyles = {
    visa: {
      bgColor: "#1a1f71",
      textColor: "#fff",
      icon: <FaCcVisa size={40} />,
    },
    mastercard: {
      bgColor: "#ff5f00",
      textColor: "#fff",
      icon: <FaCcMastercard size={40} />,
    },
    amex: {
      bgColor: "#2e77bc",
      textColor: "#fff",
      icon: <FaCcAmex size={40} />,
    },
    discover: {
      bgColor: "#f76b1c",
      textColor: "#fff",
      icon: <FaCcDiscover size={40} />,
    },
    default: {
      bgColor: "#444",
      textColor: "#fff",
      icon: <FaCreditCard size={40} />,
    },
  };

  useEffect(() => {
    if (!user?.email) {
      setError("User email is missing. Please log in.");
      setLoading(false);
      return;
    }

    const fetchCards = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/cards/${user.email}`
        );
        setCards(response.data.cards || []);
      } catch (err) {
        setError("Failed to fetch cards. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [user?.email]);

  const handleDeleteClick = (card) => {
    setSelectedCard(card);
    setShowModal(true);
    setDeleteError(null);
  };

  const confirmDelete = async () => {
    if (!password) {
      setDeleteError("Please enter your password.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/cards/delete",
        {
          email: user.email,
          cardId: selectedCard._id,
          password,
        }
      );

      if (response.data.success) {
        setCards((prevCards) =>
          prevCards.filter((card) => card._id !== selectedCard._id)
        );
        setShowModal(false);
        setDeleteError(null);
        setPassword("");
      } else {
        setDeleteError(
          response.data.message || "Incorrect password. Please try again."
        );
      }
    } catch (error) {
      setDeleteError("Incorrect password or server error.");
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Your Saved Cards</h2>

      {/* Check for loading and errors */}
      {loading && <p>Loading...</p>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="justify-content-center">
        {cards.length > 0
          ? cards.map((card, index) => {
              let normalizedType = card.type?.toLowerCase().replace(/\s/g, "");
              if (normalizedType === "americanexpress") normalizedType = "amex";
              const { bgColor, textColor, icon } =
                cardStyles[normalizedType] || cardStyles.default;

              return (
                <Col md={4} sm={6} xs={12} key={index} className="mb-3">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ position: "relative" }}
                  >
                    <CardComponent
                      generatedCard={card}
                      bgColor={bgColor}
                      textColor={textColor}
                      icon={icon}
                    />
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      style={{
                        position: "absolute",
                        bottom: 10,
                        right: 10,
                        cursor: "pointer",
                      }}
                    >
                      <FaTrash
                        size={20}
                        color="red"
                        onClick={() => handleDeleteClick(card)}
                      />
                    </motion.div>
                  </motion.div>
                </Col>
              );
            })
          : !loading && <p className="text-center">No saved cards found.</p>}
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Enter your password to confirm deletion:</p>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {deleteError && (
            <Alert variant="danger" className="mt-2">
              {deleteError}
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CardList;
