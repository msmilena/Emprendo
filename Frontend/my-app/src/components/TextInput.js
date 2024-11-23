// src/components/TextInput.js
import React from "react";
import "./CSS/TextInput.css";

const TextInput = ({ label, name, value, onChange, disabled}) => {
  return (
    <div className="text-input">
      <label>{label}</label>
      <input type="text" name={name} value={value} onChange={onChange} disabled={disabled}/>
    </div>
  );
};

export default TextInput;
