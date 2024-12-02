import React, { useState, useEffect } from "react";
import Footer2 from "../components/Footer2";
import Nav from "../components/Nav";
import BusinessInfo from "../components/BusinessInfo";
import Products from "../components/ProductsEmprendimientoCategoria";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import "./CSS/EmprendimientoPorCategoria.css";
import { useParams } from "react-router-dom";

const GOOGLE_MAPS_API_KEY = "AIzaSyBcYYMGd6XzoGXr3GNobB49cEOJg_7N2wU"; 

function EmprendimientoPorCategoria() {

  const { id } = useParams(); // Obtén el id desde la URL

  useEffect(() => {
    // Usa el id para realizar alguna acción, como cargar datos específicos
    console.log("ID del emprendimiento:", id);
  }, [id]);

  const [info, setInfo] = useState(null); // Estado para la información del negocio
  const [products, setProducts] = useState([]);
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

  // Cargar datos desde la API con el id dinámico
useEffect(() => {
  const fetchData = async () => {
    if (!id) return; // Asegúrate de que `id` no sea nulo o undefined

    try {
      const response = await fetch(
        ` https://emprendo-emprendimiento-service-26932749356.us-west1.run.app/emprendimiento/emprendimientoInfo?idEmprendimiento=${id}`
      );

      console.log(response);
      const responseData = await response.json();

      console.log(responseData)

      if (responseData.success) {
        const emprendimiento = responseData.emprendimientoData;

        const exactLocation = await getAddressFromCoordinates(
          emprendimiento.localizacion.latitude,
          emprendimiento.localizacion.longitude
        );

        const transformedInfo = {
          name: emprendimiento.nombreComercial,
          description: emprendimiento.descripcion||"",
          location: exactLocation, // Ubicación exacta
          socials: emprendimiento.redesSociales || {},
        };

        setInfo(transformedInfo);

        console.log('Emprendimiento Productos', emprendimiento.productos)
        // Opcional: Actualiza también los productos si vienen en la respuesta
        if ( emprendimiento.productos) {
          setProducts(emprendimiento.productos.map(product => ({
            id:product.idProducto||0,
            idEmprendimiento:product.idEmprendimiento||0,
            category: product.categoria_producto || "Sin categoría",
            name: product.nombre_producto,
            desc: product.descripcion_producto || "Sin descripción",
            imgURL: product.imagen || "URL_IMAGEN_DEFAULT",
            price: product.precio || 0,
          })));
        }
      }
    } catch (error) {
      console.error("Error fetching emprendimiento data:", error);
    }
  };

  fetchData();
}, [id]);


  // Filtrar productos
  const filteredProducts = products.filter(
    (product) =>
      product.name && // Verifica que `product.name` esté definido
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
