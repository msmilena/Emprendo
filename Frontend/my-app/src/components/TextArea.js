// src/components/TextArea.js
import React from "react";
import "./CSS/TextArea.css";

const TextArea = ({ label, name, value, onChange,className,disabled, error, ...props}) => {
  return (
    <div className={`text-area ${className}`}>
      <label>{label}</label>
      <textarea name={name} value={value} onChange={onChange} rows="4" disabled={disabled}
        {...props}
        />
        {error && <p className="error-message">{error}</p>} {/* Mostrar error */}
    </div>
  );
};

export default TextArea;
