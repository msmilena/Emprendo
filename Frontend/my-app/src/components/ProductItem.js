import React from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/ProductItem.css";

const ProductItem = ({ id, category, name, desc, imgURL, price }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/detalleProducto/${id}`);
  };

  return (
    <div className="product-item" id={id} onClick={handleClick}>
      <img
        src={imgURL}
        alt={name}
        style={{ width: "200px", height: "200px", objectFit: "cover" }}
      />
      <div className="product-info">
        <p className="product-category">{category}</p>
        <h3 className="product-name">{name}</h3>
        <p className="product-desc">{desc}</p>
        <p className="product-price">${price}</p>
      </div>
    </div>
  );
};

export default ProductItem;
