// src/components/StarRating.js
import React, { useState } from "react";
import "./CSS/StarRatingValue.css";  // Asegúrate de agregar el estilo necesario

const StarRatingValue = ({ initialRating = 0, onRatingChange }) => {
  const [rating, setRating] = useState(initialRating);

  // Maneja el clic en una estrella
  const handleClick = (value) => {
    setRating(value);
    if (onRatingChange) {
      onRatingChange(value);
    }
  };

  const stars = [1, 2, 3, 4, 5]; // 5 estrellas para valorar

  return (
    <div className="star-rating-container">
    <h4>Pulsa para valorar</h4>
    <div className="star-rating">
      {stars.map((star) => (
        <span
          key={star}
          className={`star ${star <= rating ? "filled" : ""}`}
          onClick={() => handleClick(star)}
        >
          ★
        </span>
      ))}
    </div>
    <p className="rating-value">{rating}</p>
    </div>
  );
};

export default StarRatingValue;
