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
                const response = await fetch(`http://127.0.0.1:8080/emprendimientos/${id_emprendimiento}/productos`, {
                    method: 'GET',
                });
                console.log(response)

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
                        <ProductsTable data={productos} /> // Mostrar tabla si hay productos
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
