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
  };

  return (

      <form className="form-container">
        <TextInput disabled={true} label="Emprendimiento" name="emprendimiento" value={formData.emprendimiento} onChange={handleChange} />
        <TextInput disabled={true} label="RUC" name="ruc" value={formData.ruc} onChange={handleChange} />
        <TextInput disabled={true} label="Ubicación" name="ubicacion" value={formData.ubicacion} onChange={handleChange} />
        <TextArea label="Descripción" name="descripcion" value={formData.descripcion} onChange={handleChange} />
        
        <SelectInput label="Categoría" name="categoria" value={formData.categoria} options={["Opción 1", "Opción 2"]} onChange={handleChange} />
        <SelectInput label="Sub Categorías" name="subCategoria" value={formData.subCategoria} options={["Opción A", "Opción B"]} onChange={handleChange} />

        <SocialLinks 
          facebook={formData.facebook}
          instagram={formData.instagram}
          tiktok={formData.tiktok}
          onChange={handleChange}
        />

        <LogoUploader logo={formData.logo} onUpload={handleLogoUpload} />
        
        <SubmitButton onClick={handleSubmit} nameText={"Guardar"}/>
      </form>
  );
};

export default FormContainer;
