// src/pages/Home.js
import React, { useState } from "react";
import Footer2 from "../components/Footer2";
import Nav from "../components/Nav";
import BusinessInfo from "../components/BusinessInfo";
import Products from "../components/ProductsEmprendimientoCategoria";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import "./CSS/EmprendimientoPorCategoria.css";


function EmprendimientoPorCategoria() {
  
    const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Datos de ejemplo (puedes reemplazarlo con datos desde una API)
  const info = {
    name: "EcoVida Market",
    description:
      "EcoVida Market es una tienda dedicada a la venta de productos orgánicos, saludables y sostenibles...",
    location: "Calle Principal 123, Ciudad Verde",
    image: "URL_DE_LA_IMAGEN", // URL de la imagen del logo o negocio
    socials: {
      facebook: "https://facebook.com/EcoVidaMarket",
      instagram: "https://instagram.com/EcoVidaMarket",
      tiktok: "https://tiktok.com/@EcoVidaMarket",
    },
    rating: 4.7,
    };

  const products = [
    {
      category: "Tecnología",
      name: "Laptop Intel Core",
      desc: "Descripción breve del producto",
      imgURL: "URL_IMAGEN_LAPTOP",
      price: 4040.47,
      rating: 4.5,
    },{
      category: "Tecnología",
      name: "Laptop Intel Core",
      desc: "Descripción breve del producto",
      imgURL: "URL_IMAGEN_LAPTOP",
      price: 4040.47,
      rating: 4.5,
    },{
      category: "Tecnología",
      name: "Laptop Intel Core",
      desc: "Descripción breve del producto",
      imgURL: "URL_IMAGEN_LAPTOP",
      price: 4040.47,
      rating: 4.5,
    },{
      category: "Tecnología",
      name: "Laptop Intel Core",
      desc: "Descripción breve del producto",
      imgURL: "URL_IMAGEN_LAPTOP",
      price: 4040.47,
      rating: 4.5,
    },{
      category: "Tecnología",
      name: "Laptop Intel Core",
      desc: "Descripción breve del producto",
      imgURL: "URL_IMAGEN_LAPTOP",
      price: 4040.47,
      rating: 4.5,
    },{
      category: "Tecnología",
      name: "Laptop Intel Core",
      desc: "Descripción breve del producto",
      imgURL: "URL_IMAGEN_LAPTOP",
      price: 4040.47,
      rating: 4.5,
    },{
      category: "Tecnología",
      name: "Laptop Intel Core",
      desc: "Descripción breve del producto",
      imgURL: "URL_IMAGEN_LAPTOP",
      price: 4040.47,
      rating: 4.5,
    },{
      category: "Tecnología",
      name: "Laptop Intel Core",
      desc: "Descripción breve del producto",
      imgURL: "URL_IMAGEN_LAPTOP",
      price: 4040.47,
      rating: 4.5,
    },{
      category: "Tecnología",
      name: "Laptop Intel Core",
      desc: "Descripción breve del producto",
      imgURL: "URL_IMAGEN_LAPTOP",
      price: 4040.47,
      rating: 4.5,
    }
    // Agrega más productos...
  ];

  const ITEMS_PER_PAGE = 5; // Cantidad de productos por página
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reinicia la página al buscar
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="">
      <Nav />
      <section className="">
        <div className="productsEmprendimientoCategoria-container">
          <h2>Emprendimientos: <span>Emprendimiento 1</span></h2>
          <SearchBar searchTerm={searchTerm} onSearch={handleSearch} placeholder="  Encuentra productos"/>
          
          {/* Información del negocio */}
          <BusinessInfo info={info} />

          {/* Listado de productos */}
          <Products products={paginatedProducts} />

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

export default EmprendimientoPorCategoria;
