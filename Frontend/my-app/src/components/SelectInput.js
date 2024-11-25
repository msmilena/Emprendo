// src/components/SelectInput.js
import React from "react";
import "./CSS/SelectInput.css";

const SelectInput = ({ label, name, value, options, onChange,className,disabled }) => {
  return (
    <div className={`select-input ${className}`}>
      <label>{label}</label>
      <select name={name} value={value} onChange={onChange} disabled={disabled}>
        <option value="">Seleccionar</option>
        {options.map((option, index) => (
          <option key={index} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput;
