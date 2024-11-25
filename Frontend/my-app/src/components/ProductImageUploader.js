import React from "react";
import "./CSS/ProductImageUploader.css";

const ProductImageUploader = ({ image, onUpload,className,disabled}) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    onUpload(file);
  };

  return (
    <div className={`product-image-uploader ${className}`}>
      <label>Imagen del Producto</label>
      <input type="file" accept="image/*" onChange={handleFileChange} disabled={disabled}/>
      {image && <img src={URL.createObjectURL(image)} alt="Imagen del Producto" className="image-preview" />}
    </div>
  );
};

export default ProductImageUploader;
