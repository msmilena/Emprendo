// src/pages/Home.js
import CategoryItem from "../components/CategoryItem";
import "./CSS/Home.css";
import { BsSearch } from "react-icons/bs";
import ProductItem from "../components/ProductItem";
import { MdFilterList } from "react-icons/md";
import Footer2 from "../components/Footer2";
import Nav from "../components/Nav";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

function Home() {

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };

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
        <Carousel responsive={responsive} className="category--list--container">
          <CategoryItem
            imgURL="https://media.istockphoto.com/id/171583541/es/foto/marr%C3%B3n-bolsa-de-papel-llena-de-comestibles-en-blanco-de-fondo.jpg?s=612x612&w=0&k=20&c=lhcde1yNZRondiR2kGj9K0DpMDes0zEUFx3IZjyZYdM="
            title="Comida"
          />
          <CategoryItem
            imgURL="https://www.sneakerfactory.net/wp-content/uploads/2015/03/shutterstock_2193850272.jpg"
            title="Calzado"
          />
          <CategoryItem
            imgURL="https://promart.vteximg.com.br/arquivos/ids/6237731-1000-1000/image-3252a491991746eb93dd6b6b4a00fb44.jpg?v=637941274249500000"
            title="Tecnología"
          />
          <CategoryItem
            imgURL="https://casabanchero.com/wp-content/uploads/2024/08/banner-cuadrado.webp"
            title="Joyeria"
          />
          <CategoryItem
            title="Hogar"
            imgURL="https://www.capitanofertas.com/images/articulos/100/101/1_101.jpg"
          />
        </Carousel>
      </section>
      <section className="explore--section--container">
        <p className="home--page--title--section">
          Descubre productos y emprendedores
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
        <div className="product--list--container">
          <ProductItem
            category="Tecnología"
            name="Laptop Intel Core"
            imgURL="https://imagedelivery.net/4fYuQyy-r8_rpBpcY7lH_A/falabellaPE/883322793_001/w=1500,h=1500,fit=pad"
            desc="Descripción"
            price={2500}
          />
          <ProductItem
            category="Tecnología"
            name="Samsung Galaxy Z Flip 6"
            desc="Descripción"
            imgURL="https://http2.mlstatic.com/D_NQ_NP_887156-MPE78166559024_082024-O.webp"
            price={2100}
          />
          <ProductItem
            category="Tecnología"
            imgURL="https://tiendasishop.com/media/catalog/product/i/p/iphone_15_pro_max_natural_titanium_pdp_image_position-1__coes.jpg?optimize=high&bg-color=255,255,255&fit=bounds&height=700&width=700&canvas=700:700"
            name="iPhone 15 Pro Max"
            desc="Descripción"
            price={4500}
          />
          <ProductItem
            category="Calzado"
            imgURL="https://goldenstoreperu.com/wp-content/uploads/2024/02/6.png"
            name="LV TRAINER BLUE"
            desc="Descripción"
            price={500}
          />
        </div>
      </section>
      <Footer2 />
    </div>
  );
}

export default Home;
