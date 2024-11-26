import React from "react";
import "./CSS/ProductItem.css";

const ProductItem = ({ category, name, desc, imgURL, price}) => {
  return (
    <div className="product-item">
      <img src={imgURL} alt={name} style={{ width: "200px", height: "200px", objectFit: "cover" }}/>
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
