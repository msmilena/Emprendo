// src/components/LogoUpload.js
import React from "react";
import "./CSS/LogoUpload.css"; // Importa el archivo CSS específico

function LogoUpload({ onLogoChange }) {
  return (
    <div className="logo-upload">
      <label htmlFor="logo-upload-input" className="logo-upload-label">
        <div className="logo-placeholder">
          <div className="img_icono_logo"></div>
          <p>Logo del emprendimiento</p>
        </div>
      </label>
      <input
        id="logo-upload-input"
        type="file"
        accept="image/*"
        onChange={onLogoChange}
        className="logo-upload-input"
      />
    </div>
  );
}

export default LogoUpload;
