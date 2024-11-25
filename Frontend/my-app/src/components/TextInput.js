// src/components/TextInput.js
import React from "react";
import "./CSS/TextInput.css";

const TextInput = ({ label, name, value, onChange, disabled,className}) => {
  return (
    <div className={`text-input ${className}`}>
      <label>{label}</label>
      <input type="text" name={name} value={value} onChange={onChange} disabled={disabled}/>
    </div>
  );
};

export default TextInput;
