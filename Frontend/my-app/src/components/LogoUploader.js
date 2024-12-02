import React from "react";
import "./CSS/LogoUploader.css";

const LogoUploader = ({ logo, onUpload, disabled }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onUpload(file);  // Pass the file to the parent component
    }
  };

  return (
    <div className="logo-uploader">
      <label>Logo</label>
      
      {/* Display image if logo is a URL and not disabled */}
      {logo && typeof logo === "string" ? (
        <img src={logo} alt="Logo" className="logo-preview" />
      ) : (
        <p>No logo uploaded</p>
      )}

      {/* Render file input for uploading new logo only if not disabled */}
      {!disabled && (
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={disabled}
        />
      )}
    </div>
  );
};

export default LogoUploader;
