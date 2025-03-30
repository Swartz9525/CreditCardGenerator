import React, { useEffect } from "react";

const CardComponent = ({ generatedCard, bgColor, textColor, icon }) => {
  useEffect(() => {
    console.log("Received card in CardComponent:", generatedCard);
  }, [generatedCard]);

  return generatedCard ? (
    <div
      style={{
        backgroundColor: bgColor,
        color: textColor,
        padding: "20px",
        borderRadius: "15px",
        width: "100%",
        maxWidth: "420px",
        margin: "20px auto",
        textAlign: "left",
        boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
        fontFamily: "Arial, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Card Chip */}
      <div
        style={{
          width: "50px",
          height: "35px",
          backgroundColor: "gold",
          borderRadius: "5px",
          position: "absolute",
          top: "20px",
          left: "20px",
        }}
      ></div>

      {/* Card Type Icon */}
      <div style={{ position: "absolute", top: "15px", right: "20px" }}>
        {icon}
      </div>

      {/* Card Number */}
      <p
        style={{
          fontSize: "1.4em",
          fontWeight: "bold",
          letterSpacing: "2px",
          marginTop: "60px",
          textAlign: "center",
        }}
      >
        {generatedCard.cardNumber.replace(/(.{4})/g, "$1 ")}
      </p>

      {/* Expiry and CVV */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "0 20px",
          fontSize: "0.9em",
          marginTop: "10px",
        }}
      >
        <p>
          <strong>Expiry:</strong> {generatedCard.expiry}
        </p>
        <p>
          <strong>CVV:</strong> {generatedCard.cvv} {/* Now showing CVV */}
        </p>
      </div>

      {/* Cardholder Name */}
      <p
        style={{
          fontSize: "1.1em",
          fontWeight: "bold",
          textTransform: "uppercase",
          textAlign: "left",
          padding: "0 20px",
          marginTop: "10px",
        }}
      >
        {generatedCard.name}
      </p>
    </div>
  ) : (
    <p>No card generated yet.</p>
  );
};

export default CardComponent;
