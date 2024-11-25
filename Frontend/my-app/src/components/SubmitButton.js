// src/components/SubmitButton.js
import React from "react";
import "./CSS/SubmitButton.css";

const SubmitButton = ({ onClick, nameText,className}) => {
  return (
    <button className={`submit-button ${className}`}type="button" onClick={onClick}>
      {nameText}
    </button>
  );
};

export default SubmitButton;
