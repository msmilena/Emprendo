// TablaComponent.jsx
import React, { useState } from "react";
import { Eye, Edit, Trash2 } from 'lucide-react';
import "./CSS/ProductsTable.css";
import Modal from "./Modal";
import { useNavigate } from 'react-router-dom';

const ProductsTable = ({ data }) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    
    const navigate = useNavigate();

    const handleViewClick = (product) => {
        navigate(`/productosEmprendedor/ver/${product.id_producto}`);
    };

    const handleEditClick = (product) => {
        navigate(`/productosEmprendedor/editar/${product.id_producto}`);
    };

    const handleDeleteClick = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        //console.log('Eliminar', selectedProduct.id);
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    return (
        <>
        <div className="tabla-container">
        <table className="tabla">
            <thead>
            <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Acciones</th>
            </tr>
            </thead>
            <tbody>
            {data.map((item, index) => (
                <tr>
                <td>{item.id_producto}</td>
                <td>{item.nombre_producto}</td>
                <td>{item.categoria_producto}</td>
                <td>S/.{item.precio}</td>
                <td>
                <div className="action-buttons">
                    <button 
                        className="action-button view"
                        onClick={() => handleViewClick(item)}
                    >
                        <Eye size={18} />
                    </button>
                    <button 
                        className="action-button edit"
                        onClick={() => handleEditClick(item)}
                    >
                        <Edit size={18} />
                    </button>
                    <button 
                        className="action-button delete"
                        onClick={() => handleDeleteClick(item)}
                    >
                        <Trash2 size={18} />
                    </button>
                    </div>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        <Modal
            isOpen={isModalOpen}
            onCancel={handleCloseModal}
            onDelete={handleDeleteConfirm}
            productData={selectedProduct}
        >
            <h3>¿Está seguro de eliminar este producto?</h3>
            <p>ID - <strong>{selectedProduct?.id_producto}</strong></p>
            <p>Nombre - <strong>{selectedProduct?.nombre_producto}</strong></p>
            <p>Categoría - <strong>{selectedProduct?.categoria_producto}</strong></p>
            <p>Precio - <strong>{selectedProduct?.precio}</strong></p>
        </Modal>

        </div>

        
        </>
    );
};

export default ProductsTable;
