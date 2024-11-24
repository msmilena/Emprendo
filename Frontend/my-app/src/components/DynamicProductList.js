// src/components/DynamicProductList.js
import React from "react";
import { Carousel } from "react-bootstrap";
import ProductItem from "./ProductItem";
import "./CSS/DynamicProductList.css"; // Asegúrate de crear este archivo para los estilos

function DynamicProductList({ products }) {
  // Divide los productos en grupos de 4 para mostrarlos en cada diapositiva
  const chunkSize = 4;
  const groupedProducts = [];
  for (let i = 0; i < products.length; i += chunkSize) {
    groupedProducts.push(products.slice(i, i + chunkSize));
  }

  return (
    <Carousel indicators={false} interval={3000} controls={true} slide={false}>
      {groupedProducts.map((group, groupIndex) => (
        <Carousel.Item key={groupIndex}>
          <div className="d-flex justify-content-center">
            {group.map((product, index) => (
              <div key={index} className="product-column">
                <ProductItem
                  category={product.category}
                  name={product.name}
                  desc={product.desc}
                  price={product.price}
                  imgURL={product.imgURL}
                />
              </div>
            ))}
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default DynamicProductList;