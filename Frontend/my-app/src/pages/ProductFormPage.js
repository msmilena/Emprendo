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

    const handleSave = async (formData) => {
        const data = JSON.parse(localStorage.getItem("emprendimientoData"));
        const id_emprendimiento = data.idEmprendimiento;
    
        if (isNewMode) {
            console.log(formData)
            try {
                const formDataToSend = new FormData();
                formDataToSend.append("imagen", formData.imagen); // Archivo de imagen
                formDataToSend.append("nombre_producto", formData.nombre_producto);
                formDataToSend.append("descripcion_producto", formData.descripcion_producto);
                formDataToSend.append("flgDisponible", formData.disponible ? "true" : "false");
                formDataToSend.append("categoria_producto", formData.categoria_producto);
                formDataToSend.append("precio", formData.precio);
                formDataToSend.append("cantidadFavoritos", 0);

                console.log(formDataToSend);
    
                const response = await fetch(`http://127.0.0.1:8080/emprendimientos/${id_emprendimiento}/agregar_producto`, {
                    method: "POST",
                    body: formDataToSend,
                });
    
                if (!response.ok) {
                    const errorData = await response.json();
                    alert(`Error: ${errorData.error}`);
                    return;
                }
    
                const result = await response.json();
                alert(result.message); // Mostrar mensaje de éxito
                navigate("/productosEmprendedor"); // Redirigir después de guardar
            } catch (error) {
                console.error("Error al agregar producto:", error);
                alert("Hubo un error al agregar el producto.");
            }
        }
    }    
    
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
