// src/components/LogoUploader.js
import React from "react";
import "./CSS/LogoUploader.css";

const LogoUploader = ({ logo, onUpload }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    onUpload(file);
  };

  return (
    <div className="logo-uploader">
      <label>Logo</label>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {logo && <img src={URL.createObjectURL(logo)} alt="Logo" className="logo-preview" />}
    </div>
  );
};

export default LogoUploader;
