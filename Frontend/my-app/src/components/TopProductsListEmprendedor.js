import React, { useEffect, useState } from "react";
import TopProductItem from "./TopProductItemEmprendedor";
import "./CSS/TopProductsListEmprendedor.css";

const TopProductsListEmprendedor = () => {
  // Estado para almacenar los productos obtenidos del API
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Estado para controlar la carga

  // Función para obtener los productos desde el endpoint
  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const idEmprendedor = localStorage.getItem("userId"); // O el ID que necesites
        const response = await fetch(`https://emprendo-emprendimiento-service-26932749356.us-west1.run.app/emprendimiento/topProductosDashboard?idEmprendedor=${idEmprendedor}`);
        const data = await response.json();

        if (data.success) {
          setTopProducts(data.productos); // Actualizar el estado con los productos
        } else {
          console.error("Error al obtener los productos.");
        }
      } catch (error) {
        console.error("Error de red:", error);
      } finally {
        setLoading(false); // Finalizar carga
      }
    };

    fetchTopProducts();
  }, []);

  if (loading) {
    return <div>Cargando productos...</div>; // Mostrar mensaje mientras se carga
  }

  return (
    <div className="top-products-list">
      <h3>Top Productos Favoritos</h3>
      <ul>
        <li className="top-product-item-2">
        <span>Foto</span>
        <span>Nombre</span>
        <span>Categoría</span>
        <span>Descripción</span>
        <span>Precio</span>
      </li>
        {topProducts.map(product => (
          <TopProductItem key={product.idProducto} product={product} />
        ))}
      </ul>
    </div>
  );
};

export default TopProductsListEmprendedor;
