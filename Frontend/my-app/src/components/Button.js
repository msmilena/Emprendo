// src/components/Button.js
import React from "react";
import { Button as BootstrapButton } from "react-bootstrap";
import "./CSS/Button.css"; // Importa el archivo CSS

const Button = ({ variant, onClick, children }) => {
  return (
    <BootstrapButton className={`custom-button ${variant}`} onClick={onClick}>
      {children}
    </BootstrapButton>
  );
};

export default Button;
