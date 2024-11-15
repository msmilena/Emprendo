import React from "react";
import "./CSS/CategoryItem.css";

const CategoryItem = ({ imgURL, title }) => {
  return (
    <div className="category-item">
      <img src={imgURL} alt={title} style={{ width: "300px", height: "300px", objectFit: "cover" }} />
      <p>{title}</p>
    </div>
  );
};

export default CategoryItem;
