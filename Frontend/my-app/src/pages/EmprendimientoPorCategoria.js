import React, { useState, useEffect } from "react";
import Footer2 from "../components/Footer2";
import Nav from "../components/Nav";
import BusinessInfo from "../components/BusinessInfo";
import Products from "../components/ProductsEmprendimientoCategoria";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import "./CSS/EmprendimientoPorCategoria.css";

const GOOGLE_MAPS_API_KEY = "AIzaSyBcYYMGd6XzoGXr3GNobB49cEOJg_7N2wU"; 

function EmprendimientoPorCategoria() {
  const [info, setInfo] = useState(null); // Estado para la información del negocio
  const [products, setProducts] = useState([
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

    // Agrega más productos según sea necesario...
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 5; // Cantidad de productos por página

  // Función para convertir coordenadas a dirección
  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      if (data.status === "OK" && data.results.length > 0) {
        return data.results[0].formatted_address;
      }
      return "Ubicación no disponible";
    } catch (error) {
      console.error("Error fetching address:", error);
      return "Error al obtener ubicación";
    }
  };

  // Cargar datos desde la API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://emprendo-emprendimiento-service-26932749356.us-west1.run.app/emprendimiento/emprendimientos"
        );
        const responseData = await response.json();

        if (responseData.success) {
          const firstEmprendimiento = responseData.emprendimientos[0]; // Simulación: tomamos el primer emprendimiento
          const exactLocation = await getAddressFromCoordinates(
            firstEmprendimiento.localizacion.latitude,
            firstEmprendimiento.localizacion.longitude
          );

          const transformedInfo = {
            name: firstEmprendimiento.nombreComercial,
            description: firstEmprendimiento.descripcion,
            location: exactLocation, // Ubicación exacta
            socials: firstEmprendimiento.redesSociales || {},
            rating: firstEmprendimiento.valoracion?.promedioValoracion || 0,
          };

          setInfo(transformedInfo);
        }
      } catch (error) {
        console.error("Error fetching emprendimiento data:", error);
      }
    };

    fetchData();
  }, []);

  // Filtrar productos
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
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="">
      <Nav />
      <section className="">
        <div className="productsEmprendimientoCategoria-container">
          <h2>
            Emprendimientos: <span>{info?.name || "Cargando..."}</span>
          </h2>
          <SearchBar
            searchTerm={searchTerm}
            onSearch={handleSearch}
            placeholder="  Encuentra productos"
          />

          {/* Información del negocio */}
          {info && <BusinessInfo info={info} />}

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
