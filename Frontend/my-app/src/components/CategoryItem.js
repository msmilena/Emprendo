import React from "react";
import "./CSS/CategoryItem.css";

const CategoryItem = ({ imgURL, title }) => {
  return (
    <div className="category-item">
      <img src={imgURL} alt={title} style={{ width: "250px", height: "250px", objectFit: "cover", borderRadius: "50%" }} />
      <p>{title}</p>
    </div>
  );
};

export default CategoryItem;
