import React from "react";
import { Card } from "react-bootstrap";
import "./CardComponent.css";

const CardComponent = ({ generatedCard, cardIcons }) => {
  if (!generatedCard) return null;

  return (
    <Card className="credit-card mt-4">
      <Card.Body>
        <div className="card-header">{cardIcons[generatedCard.type]}</div>
        <div className="card-number">{generatedCard.cardNumber}</div>
        <div className="card-details">
          <span>Expiry: {generatedCard.expiry}</span>
          <span>CVV: {generatedCard.cvv}</span>
        </div>
        <div className="card-username">{generatedCard.name}</div>
      </Card.Body>
    </Card>
  );
};

export default CardComponent;
