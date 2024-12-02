import React, { useState, useEffect } from "react";
import { useParams,useLocation } from "react-router-dom";
import Nav from "../components/Nav";
import Footer2 from "../components/Footer2";
import "./CSS/DetalleProducto.css";

const DetalleProducto = () => {
  const { id } = useParams(); // ID del producto desde la URL
  const [product, setProduct] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false); // Estado de favorito
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation(); 
  const queryParams = new URLSearchParams(location.search);
  const idEmprendimiento = queryParams.get("idEmprendimiento");

  //const id = "2YE1oM0ThlMC5R7P45g5";
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `https://emprendo-producto-service-26932749356.us-west1.run.app/emprendimientos/${idEmprendimiento}/productos/${id}`
        );
        if (!response.ok) {
          throw new Error("Producto no encontrado");
        }
        const data = await response.json();
        setProduct(data);
        //setIsFavorite(data.cantidadFavoritos > 0); // Suponer que ya es favorito si tiene más de 0 favoritos
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [idEmprendimiento,id]);

  const toggleFavorite = async () => {
    try {
      // Simula enviar al servidor si es favorito o no
      await fetch(
        `https://emprendo-producto-service-26932749356.us-west1.run.app/emprendimientos/${idEmprendimiento}/productos/${id}/favorito`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ favorite: !isFavorite }),
        }
      );
      setIsFavorite(!isFavorite); // Alterna el estado local
    } catch (err) {
      console.error("Error al actualizar favorito:", err);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Nav />
      <div className="product-card">
        <h2 className="product-title">{product.nombre_producto}</h2>
        <div className="product-details">
          <img
            src={product.imagen}
            alt={product.nombre_producto}
            className="product-image"
          />
          <div className="product-info-2">
            <div className="favorite-section">
              <button className="stock-status">
              {product.flgDisponible ? "Disponible" : "Sin stock"}
            </button>
            <button className="favorite-button" >
                {isFavorite ? "💖" : "🤍"} {/* Cambia según el estado */}
              </button>
            </div>
            <p className="price">S/ {product.precio.toFixed(2)}</p>
            <p className="favorites">
              Favoritos: {product.cantidadFavoritos}
            </p>
            <div className="product-category">
              Categoría: {product.categoria_producto}
            </div>
            <p className="product-description">
              Descripción: {product.descripcion_producto}
            </p>
            <p className="last-updated">
              Última actualización: {new Date(product.fechaActualizacion).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
      <Footer2 />
    </div>
  );
};

export default DetalleProducto;
