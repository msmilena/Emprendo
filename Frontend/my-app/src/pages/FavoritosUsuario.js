// src/pages/Home.js
import React, { useState } from "react";
import Footer2 from "../components/Footer2";
import Nav from "../components/Nav";
import ProductTable from "../components/ProductTableFavorites";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import "./CSS/FavoritosUsuario.css";

const mockProducts = [
  { id: 1, name: 'Voluptatem et tempore', category: 'Kits de maquillaje', price: 43.82, image: "https://http2.mlstatic.com/D_NQ_NP_887156-MPE78166559024_082024-O.webp" },
  { id: 2, name: 'Voluptatem et tempore', category: 'Kits de maquillaje', price: 43.82, image: 'path_to_image.jpg' },
  { id: 3, name: 'Voluptatem et tempore', category: 'Kits de maquillaje', price: 43.82, image: 'path_to_image.jpg' },
  { id: 4, name: 'Voluptatem et tempore', category: 'Kits de maquillaje', price: 43.82, image: 'path_to_image.jpg' },
  { id: 5, name: 'Voluptatem et tempore', category: 'Kits de maquillaje', price: 43.82, image: 'path_to_image.jpg' },
  { id: 6, name: 'Voluptatem et tempore', category: 'Kits de maquillaje', price: 43.82, image: 'path_to_image.jpg' },
  { id: 7, name: 'Voluptatem et tempore', category: 'Kits de maquillaje', price: 43.82, image: 'path_to_image.jpg' },
  { id: 8, name: 'Voluptatem et tempore', category: 'Kits de maquillaje', price: 43.82, image: 'path_to_image.jpg' },
  // Add more items as needed
];

const ITEMS_PER_PAGE = 7;

function FavoritosUsuario() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredProducts = mockProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const currentItems = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="">
      <Nav />
      <section className="">
        <div className="favorites-container">
          <h2>Mis Favoritos</h2>
          <SearchBar searchTerm={searchTerm} onSearch={handleSearch} placeholder="  Encuentra productos"/>
          <ProductTable products={currentItems} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </section>
      <Footer2 />
    </div>
  );
}

export default FavoritosUsuario;
