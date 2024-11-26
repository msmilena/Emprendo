import React from "react";
import ProductItem from "./ProductItem";
import "./CSS/ProductsEmprendimientoCategoria.css";

const ProductsEmprendimientoCategoria = ({ products }) => {
  return (
    <section className="products">
      <h2>Productos</h2>
      <div className="product-grid">
        {products.map((product, index) => (
          <ProductItem key={index} {...product} />
        ))}
      </div>
    </section>
  );
};

export default ProductsEmprendimientoCategoria;
