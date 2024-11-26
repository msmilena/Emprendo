// src/components/RatingStar.js
import React from "react";
import "./CSS/RatingStar.css";

const RatingStar = ({ rating }) => {
  // Validamos que el rating esté en el rango correcto de 0 a 5
  const validatedRating = Math.min(Math.max(rating, 0), 5);
  
  // Calcula la cantidad de estrellas llenas, medias y vacías
  const fullStars = Math.floor(validatedRating);  // Estrellas llenas
  const halfStar = validatedRating % 1 >= 0.25 && validatedRating % 1 < 0.75 ? 1 : 0;  // Media estrella
  const emptyStars = 5 - fullStars - halfStar;    // Estrellas vacías

  return (
    <div className="rating-star">
      {/* Estrellas llenas */}
      {Array.from({ length: fullStars }, (_, index) => (
        <span key={`full-${index}`} className="star full">★</span>
      ))}

      {/* Estrella media si corresponde */}
      {halfStar === 1 && <span className="star half">★</span>}

      {/* Estrellas vacías */}
      {Array.from({ length: emptyStars }, (_, index) => (
        <span key={`empty-${index}`} className="star empty">★</span>
      ))}
    </div>
  );
};

export default RatingStar;
