import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import Sidebar from "../components/SidebarEmprendedor";
import Header from "../components/HeaderEmprendedor";
import BackButton from "../components/BackButton";
import './CSS/HomeEmprendedor.css';

const ProductFormPage = ({ mode }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const isEditMode = mode === 'edit';
    const isViewMode = mode === 'view';
    const isNewMode = mode === 'new';

    useEffect(() => {
        if (isEditMode || isViewMode) {
            // Simulación de carga de datos de producto
            fetchProductData(id).then((data) => setData(data));
        }
    }, [id, isEditMode, isViewMode]);

    const handleSave = (formData) => {
        if (isEditMode) {
            console.log('Guardar cambios de edición:', formData);
            // Endpoint guardar producto
        } else if (isNewMode) {
            console.log('Agregar nuevo producto:', formData);
            // Endpoint nuevo producto
        }
        navigate('/productosEmprendedor'); // Redirigir después de guardar
    };
    
    return (
        <div className="app-container">
            <Sidebar />
            <div className="main-content">
                <Header />
                <div className="dashboard-content">
                    <BackButton to='/productosEmprendedor/APEQO6fohuDykka1Uqjn' />
                    <h2>{isEditMode? 'Editar Producto' : isViewMode?'Detalles de Producto': 'Agregar producto'}</h2>
                    <ProductForm
                        productData={data}
                        onSave={handleSave}
                        isEditMode={isEditMode}
                        isViewMode={isViewMode}
                        isNewMode={isNewMode}
                    />
                </div>
            </div>
        </div>
    );
};

const fetchProductData = async (id) => {
    // Simulación de llamada a API para obtener producto
    return { 
        cantidadFavoritos: 4,
        categoria_producto: "Sábanas de algodón",
        descripcion_producto: "Ipsum aut neque non quibusdam ratione sunt.",
        flgDisponible: true,
        imagen: "https://picsum.photos/381/524",
        nombre_producto: "consequuntur",
        precio: 39.09,
        imagen: null,
        id: "gsrvbdsf"
    };
};

export default ProductFormPage;