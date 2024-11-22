// src/components/TextInput.js
import React from "react";
import "./CSS/TextInput.css";

const TextInput = ({ label, name, value, onChange }) => {
  return (
    <div className="text-input">
      <label>{label}</label>
      <input type="text" name={name} value={value} onChange={onChange} />
    </div>
  );
};

export default TextInput;
