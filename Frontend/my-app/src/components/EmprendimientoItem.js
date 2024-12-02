import React from "react";
import { useNavigate } from "react-router-dom"; // Importa el hook useNavigate
import "./CSS/EmprendimientoItem.css"; // Asegúrate de crear este archivo para los estilos
import RatingStar from "./RatingStar";

function EmprendimientoItem({ data }) {
  const { id, name, location, rating, imageUrl } = data;
  const navigate = useNavigate(); // Inicializa el hook useNavigate

  // Maneja el clic en el elemento
  const handleClick = () => {
    navigate(`/emprendimientoCategoria/${id}`); // Redirige a la ruta con el id
  };

  return (
    <div
      className="emprendimiento-item"
      id={id}
      onClick={handleClick} // Añade el manejador de clic
      style={{ cursor: "pointer" }} // Añade un puntero visual para indicar que es clicable
    >
      <img src={imageUrl} alt={name} className="emprendimiento-image" />
      <h4>{name}</h4>
      <p>
        <strong>Ubicación:</strong> {location}
      </p>
      <div className="rating">
        <RatingStar rating={rating} />
        <span className="rating-number">{rating}</span>
      </div>
    </div>
  );
}

export default EmprendimientoItem;
