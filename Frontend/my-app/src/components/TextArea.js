// src/components/TextArea.js
import React from "react";
import "./CSS/TextArea.css";

const TextArea = ({ label, name, value, onChange }) => {
  return (
    <div className="text-area">
      <label>{label}</label>
      <textarea name={name} value={value} onChange={onChange} rows="4" />
    </div>
  );
};

export default TextArea;
