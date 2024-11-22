// src/components/TopProductItem.js
import React from "react";
import "./CSS/TopProductItemEmprendedor.css";

const TopProductItemEmprendedor = ({ product }) => {
  return (
    <li className="top-product-item">
      <span>{product.id}</span>
      <span>{product.name}</span>
      <span>{product.category}</span>
      <span>S/ {product.price.toFixed(2)}</span>
    </li>
  );
};

export default TopProductItemEmprendedor;
