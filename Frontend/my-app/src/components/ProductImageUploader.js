import React from "react";
import "./CSS/ProductImageUploader.css";

const ProductImageUploader = ({ image, onUpload, className, disabled, error, ...props }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    onUpload(file); // Llama a la función de subida de archivo
  };

  // Determinar la fuente de la imagen (URL o File)
  const getImageSrc = () => {
    if (image instanceof File) {
      return URL.createObjectURL(image); // Si es un File, crea una URL temporal
    }
    if (typeof image === "string") {
      return image; // Si es una URL, úsala directamente
    }
    return null; // Si no hay imagen, retorna null
  };

  const imageSrc = getImageSrc();

  return (
    <div className={`product-image-uploader ${className}`}>
      <label>Imagen del Producto</label>
      
      {imageSrc && <img src={imageSrc} alt="Imagen del Producto" className="image-preview" />}
      {!disabled && <input type="file" accept="image/*" onChange={handleFileChange} />}
      {error && <p className="error-message">{error}</p>} {/* Mostrar error si existe */}
    </div>
  );
};

export default ProductImageUploader;
