// src/components/TextArea.js
import React from "react";
import "./CSS/TextArea.css";

const TextArea = ({ label, name, value, onChange,className,disabled}) => {
  return (
    <div className={`text-area ${className}`}>
      <label>{label}</label>
      <textarea name={name} value={value} onChange={onChange} rows="4" disabled={disabled}/>
    </div>
  );
};

export default TextArea;
