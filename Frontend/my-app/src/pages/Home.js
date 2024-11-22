// src/pages/Home.js
import React from "react";
import "./CSS/Home.css";
import { BsSearch } from "react-icons/bs";
import { MdFilterList } from "react-icons/md";
import Footer2 from "../components/Footer2";
import Nav from "../components/Nav";
import DynamicCategoryList from "../components/DynamicCategoryList";
import DynamicProductList from "../components/DynamicProductList";
import categoriesData from "../dataFalsa/categoriasHome.json"; // JSON de categorías
import productsData from "../dataFalsa/productosTendenciaHomes.json"; // JSON de productos

function Home() {
  return (
    <div className="home--page--container">
      <Nav />
      <section className="hero--section--container">
        <div className="hero--section--content">
          <div className="hero--layout">
            <h1>Hecho por peruanos, para ti</h1>
            <p>
              Encuentra productos únicos y de calidad, elaborados por
              emprendedores peruanos cerca de ti
            </p>
          </div>
          <div className="hero--image--container">
            <img alt="hero" src="hero.svg"></img>
          </div>
        </div>
      </section>
      <section className="category--section--container">
        <p className="home--page--title--section">Categorías</p>
        <DynamicCategoryList categories={categoriesData} />
      </section>
      <section className="explore--section--container">
        <p className="home--page--title--section">
          Descrubre productos y emprendedores
        </p>
        <div className="explore--section--actions">
          <div className="explore--section--actions--categories">
            <MdFilterList />
            <p>Categorías</p>
          </div>
          <div className="explore--section--actions--search">
            <input
              type="text"
              placeholder="Encuentra productos o emprendimientos"
            ></input>
            <div className="explore--section--actions--search--icon">
              <BsSearch />
            </div>
          </div>
        </div>
        <p className="home--page--title--section">Productos en tendencia</p>
        <DynamicProductList products={productsData} />
      </section>
      <Footer2 />
    </div>
  );
}

export default Home;
