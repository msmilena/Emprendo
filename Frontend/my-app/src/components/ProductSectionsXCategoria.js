import React, { useState } from "react";
import DynamicProductList from "./DynamicProductList";
import Pagination from "./Pagination";
import SubmitButton from "./SubmitButton";
import "./CSS/ProductSectionsXCategoria.css";

const ProductSectionsXCategoria = ({ sectionsData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const sectionsPerPage = 3;
  const totalPages = Math.ceil(sectionsData.length / sectionsPerPage);

  // Obtener las secciones correspondientes a la página actual
  const getCurrentPageSections = () => {
    const startIndex = (currentPage - 1) * sectionsPerPage;
    const endIndex = startIndex + sectionsPerPage;
    return sectionsData.slice(startIndex, endIndex);
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="product-sections-container">
      {getCurrentPageSections().map((section, index) => (
        <div key={index} className="section">
          <h2>{section.nombreComercial}</h2>
          {section.productos && section.productos.length > 0 ? (
            <>
              <DynamicProductList products={section.productos} />
              { /*<SubmitButton
                onClick={() => alert("Mostrando todos los productos de esta sección")}
                nameText="Ver todos los productos"
                className="view-all-button"
              />*/}
            </>
          ) : (
            <p>No hay productos disponibles en esta sección.</p>
          )}
        </div>
      ))}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ProductSectionsXCategoria;
