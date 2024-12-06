// ProductFormPage.js
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
    const [mensaje, setMensaje] = useState("");
    const isEditMode = mode === 'edit';
    const isViewMode = mode === 'view';
    const isNewMode = mode === 'new';

    useEffect(() => {
        const fetchProductDetails = async () => {
            const emprendimientoData = JSON.parse(localStorage.getItem("emprendimientoData"));
            const id_emprendimiento = emprendimientoData?.idEmprendimiento;

            if (isEditMode || isViewMode) {
                try {
                    const response = await fetch(`https://emprendo-producto-service-26932749356.us-west1.run.app/emprendimientos/${id_emprendimiento}/productos/${id}`);
                    if (!response.ok) {
                        throw new Error(`Error al obtener los detalles del producto: ${response.statusText}`);
                    }
                    const productData = await response.json();
                    setData(productData);
                } catch (error) {
                    console.error(error);
                    setMensaje("No se pudieron cargar los datos del producto.");
                }
            } else if (isNewMode) {
                // Limpiar data para nuevo producto
                setData(null);
            }
        };

        fetchProductDetails();
    }, [id, isEditMode, isViewMode, isNewMode]);

    const handleSave = async (formData) => {
        const data = JSON.parse(localStorage.getItem("emprendimientoData"));
        const id_emprendimiento = data.idEmprendimiento;
    
        if (isNewMode) {
            // Lógica para agregar un producto (ya está implementada)
            try {
                const formDataToSend = new FormData();
                formDataToSend.append("imagen", formData.imagen); // Archivo de imagen
                formDataToSend.append("nombre_producto", formData.nombre_producto);
                formDataToSend.append("descripcion_producto", formData.descripcion_producto);
                formDataToSend.append("flgDisponible", formData.disponible ? "true" : "false");
                formDataToSend.append("categoria_producto", formData.categoria_producto);
                formDataToSend.append("precio", formData.precio);
                formDataToSend.append("cantidadFavoritos", 0);
    
                const response = await fetch(
                    `https://emprendo-producto-service-26932749356.us-west1.run.app/emprendimientos/${id_emprendimiento}/agregar_producto`,
                    {
                        method: "POST",
                        body: formDataToSend,
                    }
                );
    
                if (!response.ok) {
                    const errorData = await response.json();
                    alert(`Error: ${errorData.error}`);
                    return;
                }
    
                const result = await response.json();
                alert(result.message); // Mostrar mensaje de éxito
                navigate("/productosEmprendedor/APEQO6fohuDykka1Uqjn"); // Redirigir después de guardar
            } catch (error) {
                console.error("Error al agregar producto:", error);
                alert("Hubo un error al agregar el producto.");
            }
        } else if (isEditMode) {
            // Lógica para editar un producto
            try {
                const formDataToSend = new FormData();
                formDataToSend.append("imagen", formData.imagen); // Archivo de imagen
                formDataToSend.append("nombre_producto", formData.nombre_producto);
                formDataToSend.append("descripcion_producto", formData.descripcion_producto);
                formDataToSend.append("flgDisponible", formData.disponible ? "true" : "false");
                formDataToSend.append("categoria_producto", formData.categoria_producto);
                formDataToSend.append("precio", formData.precio);
    
                const response = await fetch(
                    `https://emprendo-producto-service-26932749356.us-west1.run.app/emprendimientos/${id_emprendimiento}/productos/${id}`,
                    {
                        method: "PUT",
                        body: formDataToSend,
                    }
                );
    
                if (!response.ok) {
                    const errorData = await response.json();
                    alert(`Error: ${errorData.error}`);
                    return;
                }
    
                const result = await response.json();
                alert(result.message); // Mostrar mensaje de éxito
                navigate("/productosEmprendedor/APEQO6fohuDykka1Uqjn"); // Redirigir después de guardar
            } catch (error) {
                console.error("Error al editar producto:", error);
                alert("Hubo un error al editar el producto.");
            }
        }
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
                            <p>{mensaje || "Cargando..."}</p>
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
