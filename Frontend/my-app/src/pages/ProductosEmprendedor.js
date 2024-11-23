// src/App.js
import React from "react";
import Sidebar from "../components/SidebarEmprendedor";
import Header from "../components/HeaderEmprendedor";
import Button from "../components/Button";
import ProductsTable from "../components/ProductsTable";
import './CSS/ProductosEmprendedor.css';

function ProductosEmprendedor() {


    const datos = [
        {
            id: 'EEV485G7fwe',
            nombre: 'Voluptatem et tempore',
            categoria: 'Kits de maquillaje',
            precio: 43.82
        },
        {
            id: 'EEV485G7fwe',
            nombre: 'Voluptatem et tempore',
            categoria: 'Kits de maquillaje',
            precio: 43.82
        },
        {
            id: 'EEV485G7fwe',
            nombre: 'Voluptatem et tempore',
            categoria: 'Kits de maquillaje',
            precio: 43.82
        }
    ];

    return (
        <div className="app-container">
        <Sidebar />
        <div className="main-content">
            <Header />
            <div className="dashboard-content">
            <h2 className="centered-title">Lista de productos</h2>
            <ProductsTable data={datos} />
            <Button 
                variant="primary" 
                onClick={() => alert("Botón presionado")}
                >
                Agregar producto
                </Button>
            </div>
        </div>
        </div>
    );
}

export default ProductosEmprendedor;
