// src/components/SearchBar.js
import React from "react";
import "./CSS/SearchBar.css";

const SearchBar = ({ searchTerm, onSearch,placeholder}) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={searchTerm}
      onChange={onSearch}
      className="search-bar"
    />
  );
};

export default SearchBar;
