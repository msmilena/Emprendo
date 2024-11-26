// src/pages/Home.js
import React, { useState } from "react";
import Footer2 from "../components/Footer2";
import Nav from "../components/Nav";
import SearchBar from "../components/SearchBar";
import EmprendimientosListDetalle from "../components/EmprendimientosListDetalle";
import "./CSS/EmprendimientosList.css";
import Pagination from "../components/Pagination";
import fotoPerfil from "../assets/fotoPerfilSeñor.jpg"

const initialData = [
    { id: 1, name: "Emprendimiento 1", location: "Calle Principal 123, Colonia Centro, Ciudad Verde", rating: 4.7, imageUrl: fotoPerfil },
    { id: 2, name: "Emprendimiento 2", location: "Calle Principal 123, Colonia Centro, Ciudad Verde", rating: 3.7, imageUrl: fotoPerfil },
    { id: 3, name: "Emprendimiento 3", location: "Calle Principal 123, Colonia Centro, Ciudad Verde", rating: 4.7, imageUrl: fotoPerfil },
    { id: 4, name: "Emprendimiento 4", location: "Calle Principal 123, Colonia Centro, Ciudad Verde", rating: 4.7, imageUrl: fotoPerfil },
    { id: 5, name: "Emprendimiento 5", location: "Calle Principal 125, Colonia Centro, Ciudad Verde", rating: 4.7, imageUrl: fotoPerfil },
    { id: 6, name: "Emprendimiento 6", location: "Calle Principal 123, Colonia Centro, Ciudad Verde", rating: 4.7, imageUrl: fotoPerfil},
    { id: 7, name: "Emprendimiento 7", location: "Calle Principal 125, Colonia Centro, Ciudad Verde", rating: 4.7, imageUrl: fotoPerfil },
    { id: 8, name: "Emprendimiento 8", location: "Calle Principal 123, Colonia Centro, Ciudad Verde", rating: 4.7, imageUrl: fotoPerfil },
    { id: 9, name: "Emprendimiento 9", location: "Calle Principal 125, Colonia Centro, Ciudad Verde", rating: 4.7, imageUrl: fotoPerfil },
    { id: 10, name: "Emprendimiento 10", location: "Calle Principal 123, Colonia Centro, Ciudad Verde", rating: 4.7, imageUrl: fotoPerfil },
    { id: 11, name: "Emprendimiento 11", location: "Calle Principal 125, Colonia Centro, Ciudad Verde", rating: 4.7, imageUrl: fotoPerfil },
    { id: 12, name: "Emprendimiento 12", location: "Calle Principal 123, Colonia Centro, Ciudad Verde", rating: 4.7, imageUrl: fotoPerfil },
  ];

  // Lista única de ubicaciones extraídas de los datos iniciales
const uniqueLocations = [...new Set(initialData.map((item) => item.location))];
const ITEMS_PER_PAGE = 8; // Elementos por página

function EmprendimientosList() {
    const [searchTerm, setSearchTerm] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [filteredData, setFilteredData] = useState(initialData);
    const [currentPage, setCurrentPage] = useState(1);
  
    // Maneja el cambio en la búsqueda
    const handleSearch = (event) => {
      const query = event.target.value;
      setSearchTerm(query);
      applyFilters(query, locationFilter);
    };

     // Maneja el cambio en el filtro de ubicación
  const handleLocationChange = (event) => {
    const location = event.target.value;
    setLocationFilter(location);
    applyFilters(searchTerm, location);
  };

     // Aplica ambos filtros: búsqueda por nombre y por ubicación
  const applyFilters = (nameQuery, locationQuery) => {
    const filtered = initialData.filter((item) => {
      const matchesName = item.name.toLowerCase().includes(nameQuery.toLowerCase());
      const matchesLocation = locationQuery === "" || item.location === locationQuery;
      return matchesName && matchesLocation;
    });
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  // Maneja el cambio de página
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

   // Cálculo de la paginación
   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
   const endIndex = startIndex + ITEMS_PER_PAGE;
   const currentData = filteredData.slice(startIndex, endIndex);
   const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  return (
    <div className="">
      <Nav />
      <section className="">
        <div className="emprendimientos-container">
          <h2>Emprendimientos</h2>
          <div className="filters">
        <select value={locationFilter} onChange={handleLocationChange} className="location-filter">
          <option value="">Todas las ubicaciones</option>
          {uniqueLocations.map((location, index) => (
            <option key={index} value={location}>
              {location}
            </option>
          ))}
        </select>

        <SearchBar
          searchTerm={searchTerm}
          onSearch={handleSearch}
          placeholder="Encuentra emprendimientos"
        />
      </div>
        <EmprendimientosListDetalle data={currentData} />
        {filteredData.length > ITEMS_PER_PAGE && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </section>
      <Footer2 />
    </div>
  );
}

export default EmprendimientosList;
