import React, { useState, useEffect } from "react";
import Footer2 from "../components/Footer2";
import Nav from "../components/Nav";
import ProductTable from "../components/ProductTableFavorites";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import "./CSS/FavoritosUsuario.css";

// Número de elementos por página
const ITEMS_PER_PAGE = 5;

function FavoritosUsuario() {
  // Estado para los productos favoritos cargados desde la API
  const [products, setProducts] = useState([]);
  // Estado para el término de búsqueda ingresado por el usuario
  const [searchTerm, setSearchTerm] = useState('');
  // Estado para la página actual de la paginación
  const [currentPage, setCurrentPage] = useState(1);

  const idUsuario =  localStorage.getItem("userId");
  // Cargar datos de favoritos desde la API
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch(
          `https://emprendo-valoracion-service-26932749356.us-west1.run.app/valoracion/getFavoritos/usuario?idUsuario=${idUsuario}`
        );
        const responseData = await response.json();

        if (responseData.success) {
          // Transformar datos al formato esperado
          const transformedProducts = responseData.favoritos.map((item) => ({
            id: item.idProducto,
            idEmprendimiento: item.idEmprendimiento,
            name: item.nombre_producto,
            category: item.categoria_producto,
            price: item.precio,
            image: item.imagen,
          }));
          setProducts(transformedProducts); // Actualizar estado con los datos transformados
        }
      } catch (error) {
        console.error("Error fetching favoritos:", error);
      }
    };

    fetchFavorites();
  }, [idUsuario]);

// Filtra los productos según el término de búsqueda en nombre o categoría
const filteredProducts = products.filter((product) =>
  product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  product.category.toLowerCase().includes(searchTerm.toLowerCase())
);


  // Calcula el número total de páginas necesarias
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  // Obtiene los elementos de la página actual
  const currentItems = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, // Índice inicial
    currentPage * ITEMS_PER_PAGE // Índice final
  );

  // Maneja el cambio en el término de búsqueda
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Maneja el cambio de página
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage); // Cambia el estado de la página actual
    }
  };

  return (
    <div className="">
      <Nav />
      <section className="">
        <div className="favorites-container">
          <h2>Mis Favoritos</h2>
          {/* Barra de búsqueda */}
          <SearchBar
            searchTerm={searchTerm}
            onSearch={handleSearch}
            placeholder="Encuentra productos"
          />
          {/* Tabla de productos favoritos */}
          <ProductTable products={currentItems} />
          {/* Componente de paginación */}
          {filteredProducts.length > ITEMS_PER_PAGE && (
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

export default FavoritosUsuario;
