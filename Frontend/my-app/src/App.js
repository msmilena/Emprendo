// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

//pages
import Home from "./pages/Home";
import RegisterEmprendedor from "./pages/Register-Emprendedor";
import RegisterUsuario from "./pages/RegisterUsuario";
import TipoPerfil from "./pages/TipoPerfil";
import Login from "./pages/Login";
import PerfilCliente from "./pages/PerfilCliente";
import FavoritosUsuarios from "./pages/FavoritosUsuario";
import ProductosxCategoria from "./pages/ProductosxCategoria";
import EmprendimientosList from "./pages/EmprendimientosList";
import DetalleEmprendimiento from "./pages/Detalle-Emprendimiento";
import EmprendimientoPorCategoria from "./pages/EmprendimientoPorCategoria"
import RegisterPreferencias from "./pages/RegisterPreferencias";
import CategoriaEmprendimiento from "./pages/CategoriaEmprendimiento";
import HomeEmprendedor from "./pages/HomeEmprendedor";
import ProductosEmprendedor from "./pages/ProductosEmprendedor";
import ProductFormPage from "./pages/ProductFormPage";
import EmprendimientoDatos from "./pages/EmprendimientoDatos";
import PublicidadEmprendedor from "./pages/PublicidadEmprendedor";
import DetallesCuenta from "./pages/DetallesCuenta";

import MiPerfilEmprendedor from "./pages/MiPerfilEmprendedor";
//
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/registerEmprendedor" element={<RegisterEmprendedor />} />
        <Route path="/registerUsuario" element={<RegisterUsuario />} />
        <Route path="/rolSelect" element={<TipoPerfil />} />
        <Route path="/login" element={<Login />} />
        <Route path="/perfilCliente" element={<PerfilCliente />} />
        <Route path="/favoritos/:id" element={< FavoritosUsuarios />} />
        <Route path="/categoria/:id" element={< ProductosxCategoria />} />
        <Route path="/listaEmprendimientos" element={< EmprendimientosList />} />
        <Route path="/detalleEmprendimiento/:id" element={< DetalleEmprendimiento />} />
        <Route path="/emprendimientoCategoria/:id" element={< EmprendimientoPorCategoria />} />
        <Route path="/registerPreferencias" element={<RegisterPreferencias />} />
        <Route path="/categoriaEmprendimiento" element={<CategoriaEmprendimiento/>}/>
        <Route path="/homeEmprendedor/:id" element={< HomeEmprendedor />} />
        <Route path="/productosEmprendedor/:id" element={< ProductosEmprendedor />} />
        <Route path="/productosEmprendedor/nuevo" element={<ProductFormPage mode="new" />} />
        <Route path="/productosEmprendedor/ver/:id" element={<ProductFormPage mode="view" />} />
        <Route path="/productosEmprendedor/editar/:id" element={<ProductFormPage mode="edit" />} />
        <Route path="/emprendimientoDatos/:id" element={< EmprendimientoDatos />} />
        <Route path="/publicidadEmprendedor/:id" element={< PublicidadEmprendedor />} />
        <Route path="/detalleCuenta/:id" element={< DetallesCuenta  />} />
        <Route path="/miPerfilEmprendedor/:id" element={< MiPerfilEmprendedor />} />

      </Routes>
    </Router>
  );
}

export default App;
