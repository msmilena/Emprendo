import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Footer2 from "../components/Footer2";
import Nav from "../components/Nav";
import SearchBar from "../components/SearchBar";
import EmprendimientosListDetalle from "../components/EmprendimientosListDetalle";
import "./CSS/EmprendimientosList.css";
import Pagination from "../components/Pagination";
import fotoPerfil from "../assets/fotoPerfilSeñor.jpg";

// Clave de Google Maps API
const GOOGLE_MAPS_API_KEY = "AIzaSyBcYYMGd6XzoGXr3GNobB49cEOJg_7N2wU";
const ITEMS_PER_PAGE = 6; // Elementos por página

function EmprendimientosList() {
  const { id } = useParams(); // Obtén el id desde la URL
  const [data, setData] = useState([]); // Estado para los datos de la API
  //const [recommendations, setRecommendations] = useState([]); // Estado para las recomendaciones
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Cargar los datos desde la API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://emprendo-emprendimiento-service-26932749356.us-west1.run.app/emprendimiento/emprendimientos"
        );
        const responseData = await response.json();

        if (responseData.success) {
          const transformedData = await Promise.all(
            responseData.emprendimientos.map(async (item) => {
              const latitude = item.localizacion.latitude;
              const longitude = item.localizacion.longitude;
              const address = await getAddressFromCoordinates(latitude, longitude, GOOGLE_MAPS_API_KEY);

              return {
                id: item.idEmprendimiento || item.ruc,
                name: item.nombreComercial,
                location: address, // Usa la dirección obtenida
                rating: item.valoracion?.promedioValoracion || 0,
                imageUrl: item.image_url || fotoPerfil,
              };
            })
          );

          setData(transformedData);
          setFilteredData(transformedData); // Inicializar con los datos completos
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // const fetchRecommendations = async () => {
    //   try {
    //     const response = await fetch(
    //       `https://emprendo-recomendacion-service-26932749356.us-west1.run.app/recommendation/recomendaciones/${id}`
    //     );
    //     const responseData = await response.json();

    //     if (responseData.success) {
    //       const transformedRecommendations = await Promise.all(
    //         responseData.map(async (item) => ({
    //           id: item.emprendimientoData.idEmprendimiento,
    //           name: item.emprendimientoData.nombreComercial,
    //           location: await getAddressFromCoordinates(
    //             item.emprendimientoData.localizacion.latitude,
    //             item.emprendimientoData.localizacion.longitude,
    //             GOOGLE_MAPS_API_KEY
    //           ),
    //           rating: item.emprendimientoData.valoracion?.promedioValoracion || 0,
    //           imageUrl: item.emprendimientoData.image_url || fotoPerfil,
    //         }))
    //       );
    //       setRecommendations(transformedRecommendations);
    //     }
    //   } catch (error) {
    //     console.error("Error fetching recommendations:", error);
    //   }
    // };

    fetchData();
    //fetchRecommendations();
  }, [id]);

  // Lista única de ubicaciones extraídas de los datos
  const uniqueLocations = [...new Set(data.map((item) => item.location))];

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
    const filtered = data.filter((item) => {
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
            <select
              value={locationFilter}
              onChange={handleLocationChange}
              className="location-filter"
            >
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
          {/* <h2>Recomendaciones</h2>
          <EmprendimientosListDetalle data={recommendations} /> */}
        </div>
      </section>
      <Footer2 />
    </div>
  );
}

export default EmprendimientosList;

// Función para obtener direcciones a partir de coordenadas
async function getAddressFromCoordinates(latitude, longitude, apiKey) {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
    );
    const data = await response.json();

    if (data.status === "OK" && data.results.length > 0) {
      return data.results[0].formatted_address; // Retorna la dirección formateada
    } else {
      console.error("Error fetching address:", data.status);
      return "Dirección no disponible";
    }
  } catch (error) {
    console.error("Error fetching address:", error);
    return "Error al obtener la dirección";
  }
}
