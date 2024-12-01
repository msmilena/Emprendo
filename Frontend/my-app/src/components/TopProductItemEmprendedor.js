import React from "react";
import "./CSS/TopProductItemEmprendedor.css";

const TopProductItemEmprendedor = ({ product }) => {
  return (
    <li className="top-product-item">
      <img src={product.imagen} alt={product.nombre_producto} className="product-image" />
      <span>{product.nombre_producto}</span>
      <span>{product.categoria_producto}</span>
      <span>{product.descripcion_producto}</span>
      <span>S/ {product.precio.toFixed(2)}</span>
    </li>
  );
};

export default TopProductItemEmprendedor;
