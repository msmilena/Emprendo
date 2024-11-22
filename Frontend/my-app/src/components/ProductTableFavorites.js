// src/components/ProductTable.js
import React from "react";
import "./CSS/ProductTable.css";

const ProductTableFavorites = ({ products }) => {
  const handleDelete = (productId) => {
    console.log(`Producto con ID ${productId} eliminado`);
    // Aquí puedes agregar la lógica para eliminar el producto
  };

  return (
    <table className="favorites-table">
      <thead>
        <tr>
          <th>Imagen</th>
          <th>Nombre</th>
          <th>Categoría</th>
          <th>Precio</th>
          <th>Acción</th>
        </tr>
      </thead>
      <tbody>
        {products.map(product => (
          <tr key={product.id}>
            <td><img src={product.image} alt={product.name} className="product-image" /></td>
            <td>{product.name}</td>
            <td>{product.category}</td>
            <td>S/ {product.price.toFixed(2)}</td>
            <td>
              <img
                src="../assets/deleteIcon.png" // Ruta a la imagen de la papelera
                alt="Eliminar"
                className="delete-icon"
                onClick={() => handleDelete(product.id)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductTableFavorites;
