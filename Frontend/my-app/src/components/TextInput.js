// src/components/TextInput.js
import React from "react";
import "./CSS/TextInput.css";

const TextInput = ({ label, name, value, onChange, disabled, className, error, ...props}) => {
    return (
        <div className={`text-input ${className}`}>
            <label>{label}</label>
            <input 
                type="text" 
                name={name} 
                value={value} 
                onChange={onChange} 
                disabled={disabled}
                {...props}
            />
            {error && <p className="error-message">{error}</p>} {/* Mostrar error */}
        </div>
    );
};

export default TextInput;
