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
            const mockData = {
                cantidadFavoritos: 4,
                categoria_producto: "Sábanas de algodón",
                descripcion_producto: "Ipsum aut neque non quibusdam ratione sunt.",
                flgDisponible: true,
                imagen: new File([""], "imagen_simulada.png", { type: "image/png" }),
                nombre_producto: "consequuntur",
                precio: 39.09,
                disponible:true,
                id: "gsrvbdsf",
            };
            setData(mockData);
        }else if (isNewMode) {
            // Limpiar data para nuevo producto
            setData(null);
        }
    }, [id,isEditMode, isViewMode,isNewMode]);

    const handleSave = (formData) => {
        console.log(isEditMode ? 'Guardar cambios:' : 'Nuevo producto:', formData);
        navigate('/productosEmprendedor');
    };

    return (
        <div className="app-container">
            <Sidebar />
            <div className="main-content">
                <Header />
                <div className="dashboard-content">
                    <BackButton to="/productosEmprendedor/APEQO6fohuDykka1Uqjn" />
                    <h2>
                        {isEditMode
                            ? "Editar Producto"
                            : isViewMode
                            ? "Detalles de Producto"
                            : "Agregar producto"}
                    </h2>
                    {/* Lógica para mostrar el formulario o un mensaje de carga */}
                    {isEditMode || isViewMode ? (
                        data ? (
                            <ProductForm
                                productData={data}
                                onSave={handleSave}
                                isEditMode={isEditMode}
                                isViewMode={isViewMode}
                                isNewMode={isNewMode}
                            />
                        ) : (
                            <p>Cargando...</p>
                        )
                    ) : (
                        <ProductForm
                            productData={data}
                            onSave={handleSave}
                            isEditMode={isEditMode}
                            isViewMode={isViewMode}
                            isNewMode={isNewMode}
                        />
                    )}
                </div>
            </div>
        </div>
    );
    
};

export default ProductFormPage;
