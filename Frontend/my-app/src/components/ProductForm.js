import React, { useState } from "react";
import TextInput from "./TextInput";
import TextArea from "./TextArea";
import LogoUploader from "./LogoUploader";
import SubmitButton from "./SubmitButton";
import Button from "./Button";
import SelectInput from "./SelectInput";
import Switch from "./Switch.js";
import ProductImageUploader from "./ProductImageUploader.js"
import "./CSS/ProductForm.css";

const ProductForm = ({ productData, onSave, isEditMode, isViewMode, isNewMode }) => {
  const [formState, setFormState] = useState({
    id: productData?.id || "",
    nombre_producto: productData?.nombre_producto || "",
    descripcion_producto: productData?.descripcion_producto || "",
    categoria_producto: productData?.categoria_producto || "",
    precio: productData?.precio || "",
    disponible: productData?.disponible || false,
    imagen: productData?.imagen || null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSwitchChange = () => {
    setFormState((prevState) => ({
      ...prevState,
      disponible: !prevState.disponible,
    }));
  };

  const handleImageUpload = (file) => {
    setFormState((prevState) => ({
      ...prevState,
      imagen: file,
    }));
  };

  const handleSubmit = () => {
    onSave(formState);
  };

  const handleCancel = () => {
    // Logic to handle cancel (could navigate away or reset form)
  };

  return (
    <div className="product-form marginTop50px">  
      {isNewMode ? null : (
        <TextInput
          label="ID"
          name="id"
          value={formState.id}
          onChange={handleInputChange}
          disabled={true} 
        />
      )}

      <TextInput
        label="Nombre del Producto"
        name="nombre_producto"
        value={formState.nombre_producto}
        onChange={handleInputChange}
        disabled={isViewMode}  // Deshabilitar en vista
        className="marginTop20px"
      />

      <TextArea
        label="Descripción"
        name="descripcion_producto"
        value={formState.descripcion_producto}
        onChange={handleInputChange}
        disabled={isViewMode}  // Deshabilitar en vista
        className="marginTop20px"
      />

      <SelectInput
        label="Categoría"
        name="categoria_producto"
        value={formState.categoria_producto}
        options={["Mandos", "Accesorios", "Consolas"]}
        onChange={handleInputChange}
        disabled={isViewMode}  // Deshabilitar en vista
        className="marginTop20px"
      />

      <TextInput
        label="Precio"
        name="precio"
        value={formState.precio}
        onChange={handleInputChange}
        disabled={isViewMode}  // Deshabilitar en vista
        className="marginTop20px"
      />

      <Switch
        label="Disponible"
        checked={formState.disponible}
        onChange={handleSwitchChange}
        disabled={isViewMode}  // Deshabilitar en vista
        className="marginTop20px"
      />

      <ProductImageUploader
        label="Imagen del Producto"
        image={formState.imagen}
        onUpload={handleImageUpload}
        disabled={isViewMode}  // Deshabilitar en vista
        className="marginTop20px"
      />

      {isEditMode || isNewMode ? (
        <div className="form-buttons">
          <SubmitButton onClick={handleCancel} className="cancelarBtn" nameText={"Cancelar"}/>
          <SubmitButton onClick={handleSubmit} className="guaAgreBtn" nameText={isNewMode ? "Agregar" : "Guardar"}/>
        </div>
      ) : null}
    </div>
  );
};

export default ProductForm;
