// src/components/TopProductsList.js
import React from "react";
import TopProductItem from "./TopProductItemEmprendedor";
import "./CSS/TopProductsListEmprendedor.css";

const topProducts = [
  { id: 1, name: 'Laptop Intel Core', category: 'Tecnología', price: 4040.47 },
  { id: 2, name: 'Botas', category: 'Calzado', price: 49.99 },
  { id: 3, name: 'Samsung Galaxy Z Series', category: 'Tecnología', price: 13826.58 },
];

const TopProductsListEmprendedor = () => {
  return (
    <div className="top-products-list">
      <h3>Top Productos Favoritos</h3>
      <ul>
        {topProducts.map(product => (
          <TopProductItem key={product.id} product={product} />
        ))}
      </ul>
    </div>
  );
};

export default TopProductsListEmprendedor;
