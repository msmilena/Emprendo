// src/components/EmprendimientoItem.js
import React from "react";
import "./CSS/EmprendimientoItem.css"; // Asegúrate de crear este archivo para los estilos
import RatingStar from "./RatingStar"

function EmprendimientoItem({ data }) {
  const { name, location, rating, imageUrl } = data;

  return (
    <div className="emprendimiento-item">
      <img src={imageUrl} alt={name} className="emprendimiento-image" />
      <h4>{name}</h4>
      <p><strong>Ubicación:</strong> {location}</p>
      <div className="rating">
        <RatingStar rating={rating} />
        <span className="rating-number">{rating}</span>
      </div>
    </div>
  );
}

export default EmprendimientoItem;
