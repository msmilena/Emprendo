import React from "react";
import "./CSS/TopProductItemEmprendedor.css";

const TopProductItemEmprendedor = ({ product }) => {
  const precio = typeof product.precio === 'string' ? parseFloat(product.precio) : product.precio;
  return (
    <li className="top-product-item">
      <img src={product.imagen} alt={product.nombre_producto} className="product-image" />
      <span>{product.nombre_producto}</span>
      <span>{product.categoria_producto}</span>
      <span>{product.descripcion_producto}</span>
      <span>S/ {precio.toFixed(2)}</span>
    </li>
  );
};

export default TopProductItemEmprendedor;
