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
  const [file, setFile] = useState(null); // Archivo real seleccionado
  const [loading, setLoading] = useState(false); // Indicador de carga

  const data = JSON.parse(localStorage.getItem("emprendimientoData"));

  // Maneja la carga de la nueva imagen
  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const imageUrl = URL.createObjectURL(selectedFile);
      setNewImage(imageUrl);
      setFile(selectedFile);
    }
  };

  // Confirmar el cambio de imagen
  const handlePublish = async () => {
    setLoading(true); // Muestra el indicador de carga

    try {
      const formData = new FormData();
      formData.append("idEmprendimiento", data.idEmprendimiento); // Reemplaza con el ID real del emprendimiento
      formData.append("imagen", file);

      const response = await fetch("http://127.0.0.1:8080/emprendimiento/guardarPublicidad", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error al guardar la publicidad");
      }

      const result = await response.json();
      console.log("Publicidad guardada con éxito:", result);

      // Actualiza la imagen actual y cierra el modo de edición
      setCurrentImage(newImage);
      setNewImage(null);
      setIsEditing(false);
    } catch (error) {
      console.error("Error al publicar:", error);
      alert("Ocurrió un error al guardar la publicidad");
    } finally {
      setLoading(false); // Oculta el indicador de carga
    }
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
                <SubmitButton
                  className="cancelarBtn"
                  onClick={handleCancel}
                  nameText="Cancelar"
                />
                <SubmitButton
                  className="guaAgreBtn"
                  onClick={handlePublish}
                  disabled={!newImage || loading}
                  nameText={loading ? "Guardando..." : "Guardar"}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PublicidadEmprendedor;
