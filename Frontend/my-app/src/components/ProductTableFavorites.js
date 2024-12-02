// src/components/ProductTable.js
import React,{ useState, useEffect } from "react";
import "./CSS/ProductTable.css";
import tasho from "../assets/deleteIcon.png";

const ProductTableFavorites = ({ products }) => {
  console.log(products)
  const [productList, setProductList] = useState(products); // Estado para los productos
  const [showModal, setShowModal] = useState(false); // Estado para mostrar/ocultar el modal
  const [productToDelete, setProductToDelete] = useState(null); // Producto a eliminar
  const idUsuario =  localStorage.getItem("userId"); 
  const handleDelete = async (productId,idEmprendimiento) => {
    setProductToDelete({ productId, idEmprendimiento }); // Guardar el producto a eliminar
    setShowModal(true); // Mostrar el modal de confirmación
  };
  const confirmDelete = async () => {
    const { productId, idEmprendimiento } = productToDelete;
    try {
      const response = await fetch(
        'https://emprendo-valoracion-service-26932749356.us-west1.run.app/valoracion/eliminarFavorito?idUsuario=' + idUsuario,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            idEmprendimiento: idEmprendimiento,
            idProducto: productId
          })
        }
      );

      const result = await response.json();

      if (result.success) {
        // Eliminar el producto del estado local si la solicitud fue exitosa
        setProductList(productList.filter(product => product.id !== productId));
        setShowModal(false); // Cerrar el modal
      } else {
        console.error("Error al eliminar el producto:", result.message);
      }
    } catch (error) {
      console.error("Error en la solicitud DELETE:", error);
    }
  };
  const cancelDelete = () => {
    setShowModal(false); // Cerrar el modal sin hacer nada
  };

  useEffect(() => {
    setProductList(products)
  }, [products]); 

  return (
    <div>
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
        {productList.map(product => (
          <tr key={product.id}>
            <td><img src={product.image} alt={product.name} className="product-image" /></td>
            <td>{product.name}</td>
            <td>{product.category}</td>
            <td>S/ {product.price.toFixed(2)}</td>
            <td>
              <img
                src={tasho} // Ruta a la imagen de la papelera
                alt="Eliminar"
                className="delete-icon"
                onClick={() => handleDelete(product.id, product.idEmprendimiento)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>¿Estás seguro de eliminar este producto de favoritos?</h3>
            <div className="modal-buttons">
              <button onClick={confirmDelete} className="confirm-btn">Sí, eliminar</button>
              <button onClick={cancelDelete} className="cancel-btn">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductTableFavorites;
