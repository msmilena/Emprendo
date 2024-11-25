// src/components/SubmitButton.js
import React from "react";
import "./CSS/SubmitButton.css";

const SubmitButton = ({ onClick }) => {
  return (
    <button className="submit-button" type="button" onClick={onClick}>
      Guardar
    </button>
  );
};

export default SubmitButton;
