// src/components/FormContainer.js
import React, { useState } from "react";
import TextInput from "./TextInput";
import TextArea from "./TextArea";
import SelectInput from "./SelectInput";
import SocialLinks from "./SocialLinks";
import LogoUploader from "./LogoUploader";
import SubmitButton from "./SubmitButton";
import "./CSS/FormContainer.css";

const FormContainer = () => {
  const [formData, setFormData] = useState({
    emprendimiento: "EcoVida Market",
    ruc: "282562656262",
    ubicacion: "Calle Principal 123, Colonia Centro, Ciudad Verde",
    descripcion: `EcoVida Market es una tienda dedicada a la venta de productos orgánicos, saludables y sostenibles...`,
    categoria: "",
    subCategoria: "",
    facebook: "EcoVidaMarket",
    instagram: "@EcoVidaMarket",
    tiktok: "@EcoVidaMarket",
    logo: null,
  });

   // Estado inicial para restaurar valores si se cancela la edición
   const [initialData, setInitialData] = useState({ ...formData });

  // State to handle edit mode
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogoUpload = (file) => {
    setFormData({ ...formData, logo: file });
  };

  const handleSubmit = () => {
    // Lógica para enviar el formulario
    console.log("Datos del formulario enviados:", formData);
    // Switch back to view mode after saving
    setIsEditing(false);

    // Actualizar los valores iniciales con los cambios guardados
    setInitialData({ ...formData });
  };

  // Cancelar la edición y restaurar los valores originales
  const handleCancel = () => {
    setFormData({ ...initialData }); // Restaurar datos originales
    setIsEditing(false); // Cambiar a modo de solo lectura
  };

   // Alternar entre "Actualizar" y "Guardar cambios"
   const handleButtonClick = () => {
    if (isEditing) {
      handleSubmit(); // Si ya está en edición, guarda los datos
    } else {
      setIsEditing(!isEditing); // Si no está en edición, habilita la edición
    }
  };

  return (
    <div className="dashboard-content">
          <h2>{!isEditing ? "Información del emprendimiento" : "Actualizar información del emprendimiento"}</h2>
    <div className="">
      <form className="form-container">
        <TextInput disabled={!isEditing} label="Emprendimiento" name="emprendimiento" value={formData.emprendimiento} onChange={handleChange} />
        <TextInput disabled={!isEditing} label="RUC" name="ruc" value={formData.ruc} onChange={handleChange} />
        <TextInput disabled={!isEditing} label="Ubicación" name="ubicacion" value={formData.ubicacion} onChange={handleChange} />
        <TextArea disabled={!isEditing} label="Descripción" name="descripcion" value={formData.descripcion} onChange={handleChange} />
        
        <SelectInput disabled={!isEditing} label="Categoría" name="categoria" value={formData.categoria} options={["Opción 1", "Opción 2"]} onChange={handleChange} />
        <SelectInput disabled={!isEditing} label="Sub Categorías" name="subCategoria" value={formData.subCategoria} options={["Opción A", "Opción B"]} onChange={handleChange} />

        <SocialLinks 
          disabled={!isEditing}
          facebook={formData.facebook}
          instagram={formData.instagram}
          tiktok={formData.tiktok}
          onChange={handleChange}
        />

        <LogoUploader disabled={!isEditing} logo={formData.logo} onUpload={handleLogoUpload} />
        
        <div className="form-buttons">
          {isEditing && (
            <SubmitButton  className="cancelarBtn" nameText="Cancelar" onClick={handleCancel} />
          )}
          <SubmitButton
            className="guaAgreBtn"
            nameText={isEditing ? "Guardar cambios" : "Actualizar"}
            onClick={handleButtonClick}
          />
        </div>
      </form>
      </div>
      </div>
  );
};

export default FormContainer;
