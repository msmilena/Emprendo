// src/components/DynamicCategoryList.js
import React from "react";
import { Carousel } from "react-bootstrap";
import CategoryItem from "./CategoryItem";
import "./CSS/DynamicCategoryList.css";

function DynamicCategoryList({ categories }) {
  // Divide las categorías en grupos de 5 para mostrarlas en cada diapositiva
  const chunkSize = 4;
  const groupedCategories = [];
  for (let i = 0; i < categories.length; i += chunkSize) {
    groupedCategories.push(categories.slice(i, i + chunkSize));
  }

  return (
    <Carousel indicators={false} interval={3000} controls={true} slide={false}>
      {groupedCategories.map((group, groupIndex) => (
        <Carousel.Item key={groupIndex}>
          <div className="d-flex justify-content-center">
            {group.map((category, index) => (
              <div key={index} className="category-column">
                <CategoryItem imgURL={category.imgURL} title={category.title} />
              </div>
            ))}
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default DynamicCategoryList;
