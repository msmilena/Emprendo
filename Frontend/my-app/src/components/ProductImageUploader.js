import React from "react";
import "./CSS/ProductImageUploader.css";

const ProductImageUploader = ({ image, onUpload, className, disabled, error, ...props }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    onUpload(file); // Llama a la función de subida de archivo
  };

  return (
    <div className={`product-image-uploader ${className}`}>
      <label>Imagen del Producto</label>
      
      {image && <img src={URL.createObjectURL(image)} alt="Imagen del Producto" className="image-preview" />}
      {!disabled && <input type="file" accept="image/*" onChange={handleFileChange} disabled={disabled} />}
      {error && <p className="error-message">{error}</p>} {/* Mostrar error si existe */}
    </div>
  );
};

export default ProductImageUploader;
