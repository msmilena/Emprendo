import React from "react";
import "./CSS/BusinessInfo.css";
import StarRating from "./StarRatingValue"
import RatingStar from "./RatingStar"
import fotoPerfil from "../assets/fotoPerfilSeñor.jpg"

const BusinessInfo = ({ info }) => {
    const handleRatingChange = (id, newRating) => {
        // Aquí puedes actualizar el valor de la valoración en la base de datos o estado
        //console.log(`Emprendimiento ${id} valorado con ${newRating} estrellas`);
      };
  return (
    <section className="business-info">
      <div className="business-info-header">
      <h2>{info.name}</h2>
        <img
          src={fotoPerfil}
          alt={info.name}
          className="business-info-image"
        />
        <RatingStar rating={info.rating} />
        <span className="rating-value">{info.rating}</span>
      </div>
      <div className="business-info-side">
      <p>{info.description}</p>
      <p><strong>Ubicación:</strong> {info.location}</p>
      <p><strong>Redes sociales:</strong></p>
        <ul className="business-socials">
          <li><a href={info.socials.facebook} target="_blank" rel="noopener noreferrer">Facebook</a></li>
          <li><a href={info.socials.instagram} target="_blank" rel="noopener noreferrer">Instagram</a></li>
          <li><a href={info.socials.tiktok} target="_blank" rel="noopener noreferrer">TikTok</a></li>
        </ul>
      <StarRating
            initialRating={info.rating}
            onRatingChange={(newRating) => handleRatingChange(info.id, newRating)}
          />
    </div>
    </section>
  );
};

export default BusinessInfo;
