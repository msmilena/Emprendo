// src/components/Switch.js
import React from "react";
import "./CSS/Switch.css";

const Switch = ({ label, checked, onChange,className,disabled }) => {
  return (
    <div className={`switch ${className}`}>
      <label>{label}</label>
      <input type="checkbox" checked={checked} onChange={onChange} disabled={disabled}/>
      <span className="slider"></span>
    </div>
  );
};

export default Switch;
