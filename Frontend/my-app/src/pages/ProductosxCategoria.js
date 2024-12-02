// src/pages/Home.js
import React, { useEffect, useState } from "react";
import Footer2 from "../components/Footer2";
import Nav from "../components/Nav";
import ProductSectionsXCategoria from "../components/ProductSectionsXCategoria";
import "./CSS/ProductosxCategoria.css";
import { useParams } from "react-router-dom";

function ProductosxCategoria() {
  const { categoryName } = useParams(); // Get the category name from the URL
  const [sectionsData, setSectionsData] = useState([]);

  useEffect(() => {
    fetch(`http://127.0.0.1:8080/emprendimientos/categoria/${categoryName}`)
      .then((response) => response.json())
      .then((data) => {
        /*const section = {
          title: `Productos de ${categoryName}`,
          products: data.flatMap(emprendimiento => 
            emprendimiento.productos.map(product => ({
              category: product.categoria_producto,
              name: product.nombre_producto,
              desc: product.descripcion_producto,
              price: product.precio,
              imgURL: product.imagen,
              rating: product.cantidadFavoritos // Assuming rating is based on the number of favorites
            }))
          )
        };*/
        setSectionsData(data);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, [categoryName]);

  return (
    <div className="">
      <Nav />
      <section className="">
        <div className="categoria-container">
          <h2>Categoría: <span>{categoryName}</span></h2> {/* Use the category name from the URL */}
          <ProductSectionsXCategoria sectionsData={sectionsData} />
        </div>
      </section>
      <Footer2 />
    </div>
  );
}

export default ProductosxCategoria;
