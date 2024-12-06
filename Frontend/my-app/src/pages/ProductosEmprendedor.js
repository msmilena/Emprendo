import React, { useEffect, useState } from "react";
import Sidebar from "../components/SidebarEmprendedor";
import Header from "../components/HeaderEmprendedor";
import Button from "../components/Button";
import ProductsTable from "../components/ProductsTable";
import './CSS/ProductosEmprendedor.css';
import { useNavigate } from 'react-router-dom';

function ProductosEmprendedor() {
    const [productos, setProductos] = useState([]);
    const [mensaje, setMensaje] = useState(""); // Estado para manejar mensajes
    const navigate = useNavigate();
    const data = JSON.parse(localStorage.getItem("emprendimientoData"));
    const id_emprendimiento = data.idEmprendimiento;

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await fetch(`https://emprendo-producto-service-26932749356.us-west1.run.app/emprendimientos/${id_emprendimiento}/productos`, {
                    method: 'GET',
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    setMensaje(errorData.mensaje || "Hubo un error al cargar los productos.");
                    return;
                }

                const data = await response.json();
                if (data.mensaje) {
                    setMensaje(data.mensaje); // Establece el mensaje si no hay productos
                } else {
                    setProductos(data); // Establece los productos si existen
                }
            } catch (error) {
                console.error("Error al obtener los productos:", error);
                setMensaje("No se pudieron cargar los productos.");
            }
        };

        if (id_emprendimiento) {
            fetchProductos();
        } else {
            setMensaje("No se encontró un ID de emprendimiento válido.");
        }
    }, [id_emprendimiento]);

    // Función para manejar la eliminación de un producto
    const handleDeleteProduct = async (productId) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este producto?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(
                `https://emprendo-producto-service-26932749356.us-west1.run.app/emprendimientos/${id_emprendimiento}/productos/${productId}`,
                {
                    method: 'DELETE',
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                alert(`Error al eliminar producto: ${errorData.mensaje}`);
                return;
            }

            alert("Producto eliminado correctamente.");

            // Actualiza la lista de productos después de eliminar
            setProductos((prevProductos) =>
                prevProductos.filter((producto) => producto.id !== productId)
            );
        } catch (error) {
            console.error("Error al eliminar producto:", error);
            alert("Hubo un error al eliminar el producto.");
        }
    };

    const handleAddProduct = () => {
        navigate('/productosEmprendedor/nuevo');
    };

    return (
        <div className="app-container">
            <Sidebar />
            <div className="main-content">
                <Header />
                <div className="dashboard-content">
                    <h2 className="centered-title">Lista de productos</h2>
                    {mensaje ? (
                        <p className="mensaje-error">{mensaje}</p> // Mostrar mensaje si existe
                    ) : (
                        <ProductsTable
                            data={productos}
                            onDelete={handleDeleteProduct} // Pasa la función como prop
                        />
                    )}
                    <Button
                        variant="btn-center btn-color-verde"
                        onClick={handleAddProduct}
                        style={{ backgroundColor: "#4CAF50" }}
                    >
                        Agregar producto
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default ProductosEmprendedor;
