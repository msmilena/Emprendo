// src/pages/Home.js
import React, {  } from "react";
import Footer2 from "../components/Footer2";
import Nav from "../components/Nav";
import ProductSectionsXCategoria from "../components/ProductSectionsXCategoria";
import "./CSS/ProductosxCategoria.css";

function ProductosxCategoria() {

    const sectionsData = [
        {
          title: "Emprendimiento 1",
          products: [
            { category: "Tecnología", name: "Laptop Intel core", desc: "Descripción", price: "4040.47", imgURL: "url-de-imagen" },
            { category: "Tecnología", name: "Samsung Galaxy Z Series", desc: "Descripción", price: "1825.58", imgURL: "url-de-imagen" },
            { category: "Tecnología", name: "LAPTOP ASUS AMDA RYZEN", desc: "Descripción", price: "3783.23", imgURL: "url-de-imagen" },
          ]
        },
        {
          title: "Emprendimiento 2",
          products: [
            { category: "Tecnología", name: "Laptop Intel core", desc: "Descripción", price: "4040.47", imgURL: "url-de-imagen" },
            { category: "Tecnología", name: "Samsung Galaxy Z Series", desc: "Descripción", price: "1825.58", imgURL: "url-de-imagen" },
            { category: "Tecnología", name: "LAPTOP ASUS AMDA RYZEN", desc: "Descripción", price: "3783.23", imgURL: "url-de-imagen" },
          ]
        },
        {
          title: "Emprendimiento 3",
          products: [
            { category: "Tecnología", name: "Laptop Intel core", desc: "Descripción", price: "4040.47", imgURL: "url-de-imagen" },
            { category: "Tecnología", name: "Samsung Galaxy Z Series", desc: "Descripción", price: "1825.58", imgURL: "url-de-imagen" },
            { category: "Tecnología", name: "LAPTOP ASUS AMDA RYZEN", desc: "Descripción", price: "3783.23", imgURL: "url-de-imagen" },
          ]
        },
        {
          title: "Emprendimiento 4",
          products: [
            { category: "Tecnología", name: "Laptop Intel core", desc: "Descripción", price: "4040.47", imgURL: "url-de-imagen" },
            { category: "Tecnología", name: "Samsung Galaxy Z Series", desc: "Descripción", price: "1825.58", imgURL: "url-de-imagen" },
            { category: "Tecnología", name: "LAPTOP ASUS AMDA RYZEN", desc: "Descripción", price: "3783.23", imgURL: "url-de-imagen" },
          ]
        },
        {
          title: "Emprendimiento 5",
          products: [
            { category: "Tecnología", name: "Laptop Intel core", desc: "Descripción", price: "4040.47", imgURL: "url-de-imagen" },
            { category: "Tecnología", name: "Samsung Galaxy Z Series", desc: "Descripción", price: "1825.58", imgURL: "url-de-imagen" },
            { category: "Tecnología", name: "LAPTOP ASUS AMDA RYZEN", desc: "Descripción", price: "3783.23", imgURL: "url-de-imagen" },
            { category: "Tecnología", name: "Samsung Galaxy Z Series", desc: "Descripción", price: "1825.58", imgURL: "url-de-imagen" },
            { category: "Tecnología", name: "LAPTOP ASUS AMDA RYZEN", desc: "Descripción", price: "3783.23", imgURL: "url-de-imagen" },
            { category: "Tecnología", name: "Samsung Galaxy Z Series", desc: "Descripción", price: "1825.58", imgURL: "url-de-imagen" },
            { category: "Tecnología", name: "LAPTOP ASUS AMDA RYZEN", desc: "Descripción", price: "3783.23", imgURL: "url-de-imagen" },
          ]
        }
      ];

  return (
    <div className="">
      <Nav />
      <section className="">
        <div className="categoria-container">
          <h2>Categoría: <span>Tecnologia</span></h2>
          <ProductSectionsXCategoria sectionsData={sectionsData} />
        </div>
      </section>
      <Footer2 />
    </div>
  );
}

export default ProductosxCategoria;
