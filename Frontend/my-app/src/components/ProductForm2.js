// ProductForm.js
import React, { useState, useEffect } from 'react';

const ProductForm = ({ productData, onSave, isEditMode, isViewMode }) => {
  const [product, setProduct] = useState({
    cantidadFavoritos: 3,
    categoria_producto: "Secadores de cabello",
    descripcion_producto: "Dolores accusamus facilis sequi.",
    flgDisponible: true,
    nombre_producto: "numquam",
    precio: 48.16,
    imagen: null,
    id: "gsrvbdsf"
  });

  useEffect(() => {
    if (productData) {
      setProduct(productData);
    }
  }, [productData]);

  const handleSave = () => {
    onSave(product);
  };

  const handleCancel = () => {
    onSave(null);
  };

  return (
    <div>
      <h2>{isEditMode ? 'Editar Producto' : 'Nuevo Producto'}</h2>

      {isViewMode ? (
        <div>
          <p>ID: {product.id}</p>
          <p>Nombre: {product.nombre_producto}</p>
          <p>Categoría: {product.descripcion_producto}</p>
          <p>Precio: {product.categoria_producto}</p>
        </div>
      ) : (
        <form>
          <div>
            <label>Nombre:</label>
            <input
              type="text"
              value={product.nombre}
              onChange={(e) => setProduct({ ...product, nombre: e.target.value })}
              disabled={isViewMode} // Deshabilitar en modo vista
            />
          </div>
          <div>
            <label>Categoría:</label>
            <input
              type="text"
              value={product.categoria}
              onChange={(e) => setProduct({ ...product, categoria: e.target.value })}
              disabled={isViewMode}
            />
          </div>
          <div>
            <label>Precio:</label>
            <input
              type="number"
              value={product.precio}
              onChange={(e) => setProduct({ ...product, precio: e.target.value })}
              disabled={isViewMode}
            />
          </div>

          {!isViewMode && (
            <div>
              <button type="button" onClick={handleSave}>
                {isEditMode ? 'Guardar cambios' : 'Agregar producto'}
              </button>
              <button type="button" onClick={handleCancel}>
                Cancelar
              </button>
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default ProductForm;
