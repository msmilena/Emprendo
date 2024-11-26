import React, { useState } from "react";
import Sidebar from "../components/SidebarEmprendedor";
import Header from "../components/HeaderEmprendedor";
import SubmitButton from "../components/SubmitButton";
import "./CSS/PublicidadEmprendedor.css";

function PublicidadEmprendedor() {
  const [currentImage, setCurrentImage] = useState(
    "https://http2.mlstatic.com/D_NQ_NP_887156-MPE78166559024_082024-O.webp"
  ); // Imagen inicial de la publicidad
  const [isEditing, setIsEditing] = useState(false); // Controla si estamos editando
  const [newImage, setNewImage] = useState(null); // Imagen cargada temporalmente

  // Maneja la carga de la nueva imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNewImage(imageUrl);
    }
  };

  // Confirmar el cambio de imagen
  const handlePublish = () => {
    setCurrentImage(newImage);
    setNewImage(null);
    setIsEditing(false);
  };

  // Cancelar el cambio
  const handleCancel = () => {
    setNewImage(null);
    setIsEditing(false);
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="dashboard-content">
          <h2 className="centered-title">Publicidad del Emprendimiento</h2>

          {!isEditing ? (
            <div className="publicidad-actual">
              <img
                src={currentImage}
                alt="Publicidad actual"
                className="imagen-publicidad"
              />
              <SubmitButton
                className="width50"
                onClick={() => setIsEditing(true)}
                 nameText="Cambiar publicidad"
              />
            </div>
          ) : (
            <div className="actualizar-publicidad">
              <div className="publicidad-upload">
                {newImage ? (
                  <img
                    src={newImage}
                    alt="Nueva publicidad"
                    className="imagen-preview"
                  />
                ) : (
                  <div className="backSpan">
                    <span>📷</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input"
                />
              </div>
              <div className="form-buttons">
                <SubmitButton className="cancelarBtn" onClick={handleCancel} nameText="Cancelar"/>
                <SubmitButton
                  className="guaAgreBtn"
                  onClick={handlePublish}
                  disabled={!newImage}
                  nameText="Guardar"/>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PublicidadEmprendedor;
