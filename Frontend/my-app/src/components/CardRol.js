import React from "react";
import { Button } from "react-bootstrap";
import "./CSS/CardRol.css"; // Estilos compartidos

function CardRol({ imgSrc, text, onClick }) {
  return (
    <Button className="custom-button2" onClick={onClick}>
      <div className="icon-circle">
        <img src={imgSrc} alt={text} className="icon-image" />
      </div>
      <span className="button-text">{text}</span>
    </Button>
  );
}

export default CardRol;