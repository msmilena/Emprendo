// src/components/SearchBar.js
import React from "react";
import "./CSS/SearchBar.css";

const SearchBar = ({ searchTerm, onSearch }) => {
  return (
    <input
      type="text"
      placeholder="Encuentra productos"
      value={searchTerm}
      onChange={onSearch}
      className="search-bar"
    />
  );
};

export default SearchBar;
