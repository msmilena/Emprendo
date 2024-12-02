import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
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
  
  // Obtener idUsuario desde el contexto o sesión del usuario (deberás implementar esto de acuerdo a tu aplicación)
  const idUsuario =  localStorage.getItem("userId"); // Asegúrate de obtener el idUsuario correctamente

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
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [idEmprendimiento, id]);

  const toggleFavorite = async () => {
    try {
      // Enviar la solicitud al servidor Flask para guardar el favorito
      const response = await fetch(
        `https://emprendo-valoracion-service-26932749356.us-west1.run.app/valoracion/guardarFavorito?idUsuario=${idUsuario}`, // Enviar el idUsuario como parámetro de URL
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            iEmprendimiento: idEmprendimiento, // Enviar el idEmprendimiento
            idProducto: id, // Enviar el idProducto
          }),
        }
      );

      const result = await response.json();
      if (result.success) {
        setIsFavorite(!isFavorite); // Alterna el estado local si la operación fue exitosa
      } else {
        console.error(result.message); // Mostrar el mensaje de error en caso de fallo
      }
    } catch (err) {
      console.error("Error al guardar favorito:", err);
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
              <button
                className="favorite-button"
                onClick={toggleFavorite} // Llama a toggleFavorite al hacer click
              >
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
