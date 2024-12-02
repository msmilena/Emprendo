import React from "react"; // Importa React para construir el componente
import "./CSS/Home.css"; // Importa los estilos específicos para la página Home
import { BsSearch } from "react-icons/bs"; // Icono de búsqueda
import { MdFilterList } from "react-icons/md"; // Icono de filtro
import Footer2 from "../components/Footer2"; // Componente del pie de página
import Nav from "../components/Nav"; // Componente de navegación
import DynamicCategoryList from "../components/DynamicCategoryList"; // Componente dinámico para mostrar categorías
import DynamicProductList from "../components/DynamicProductList"; // Componente dinámico para mostrar productos
import { useEffect, useState } from "react"; // Importa useEffect y useState de React
import { useNavigate } from "react-router-dom"; // Importa useNavigate de react-router-dom

function Home() {
  const [categories, setCategories] = useState([]); // Estado para las categorías
  const [products, setProducts] = useState([]); // Estado para los productos
  const [loading, setLoading] = useState(true); // Estado para saber si los productos están cargando
  const navigate = useNavigate(); // Inicializa useNavigate

  useEffect(() => {
    // Cargar categorías
    fetch("https://emprendo-producto-service-26932749356.us-west1.run.app/categorias")
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching categories:", error));

    // Cargar productos
    fetch("https://emprendo-producto-service-26932749356.us-west1.run.app/productos/mas_favoritos")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setLoading(false); // Una vez que los productos se cargan, se actualiza el estado de carga
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false); // Si hay un error, también se detiene el estado de carga
      });
  }, []);

  const handleCategoryClick = (categoryName) => {
    navigate(`/productosxCategoria/${categoryName}`); // Navega a ProductosxCategoria con el nombre de la categoría
  };

  console.log(products);

  return (
    <div className="home--page--container">
      {/* Componente de navegación */}
      <Nav />

      {/* Sección del hero (parte destacada de la página) */}
      <section className="hero--section--container">
        <div className="hero--section--content">
          <div className="hero--layout">
            {/* Título y descripción principal del hero */}
            <h1>Hecho por peruanos, para ti</h1>
            <p>
              Encuentra productos únicos y de calidad, elaborados por
              emprendedores peruanos cerca de ti
            </p>
          </div>
          {/* Contenedor de la imagen del hero */}
          <div className="hero--image--container">
            <img alt="hero" src="hero.svg"></img> {/* Imagen principal */}
          </div>
        </div>
      </section>

      {/* Sección de categorías */}
      <section className="category--section--container">
        <p className="home--page--title--section">Categorías</p>
        {/* Componente dinámico para mostrar la lista de categorías */}
        <DynamicCategoryList categories={categories} onCategoryClick={handleCategoryClick} /> {/* Pasa el manejador */}
      </section>

      {/* Sección de exploración (productos y emprendedores) */}
      <section className="explore--section--container">
        <p className="home--page--title--section">
          Descubre productos y emprendedores
        </p>
        <div className="explore--section--actions">
          {/* Filtro por categorías */}
          <div className="explore--section--actions--categories">
            <MdFilterList /> {/* Icono de filtro */}
            <p>Categorías</p>
          </div>
          {/* Barra de búsqueda */}
          <div className="explore--section--actions--search">
            <input
              type="text"
              placeholder="Encuentra productos o emprendimientos"
            ></input>
            <div className="explore--section--actions--search--icon">
              <BsSearch /> {/* Icono de búsqueda */}
            </div>
          </div>
        </div>

        {/* Sección de productos en tendencia */}
        <p className="home--page--title--section">Productos en tendencia</p>
        {/* Mostrar "Cargando..." si los productos aún no se han cargado */}
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <DynamicProductList products={products} />
        )}
      </section>

      {/* Pie de página */}
      <Footer2 />
    </div>
  );
}

export default Home; // Exporta el componente para ser usado en otras partes de la aplicación
