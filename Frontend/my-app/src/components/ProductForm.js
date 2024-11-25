import React, {useEffect, useState } from "react";
import TextInput from "./TextInput";
import TextArea from "./TextArea";
import SubmitButton from "./SubmitButton";
import SelectInput from "./SelectInput";
import Switch from "./Switch.js";
import ProductImageUploader from "./ProductImageUploader.js"
import "./CSS/ProductForm.css";

const ProductForm = ({ productData, onSave, isEditMode, isViewMode, isNewMode }) => {
  const [formState, setFormState] = useState({
    id: isNewMode ? "" : productData?.id || "",
    nombre_producto: isNewMode ? "" : productData?.nombre_producto || "",
    descripcion_producto: isNewMode ? "" : productData?.descripcion_producto || "",
    categoria_producto: isNewMode ? "" : productData?.categoria_producto || "",
    precio: isNewMode ? "" : productData?.precio || "",
    disponible: isNewMode ? false : productData?.disponible || false,
    imagen: isNewMode ? null : productData?.imagen || null,
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
    console.log("Edición cancelada");
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
        disabled={isViewMode}
        className="marginTop20px"
      />

      <TextArea
        label="Descripción"
        name="descripcion_producto"
        value={formState.descripcion_producto}
        onChange={handleInputChange}
        disabled={isViewMode}
        className="marginTop20px"
      />

      <SelectInput
        label="Categoría"
        name="categoria_producto"
        value={formState.categoria_producto}
        options={["Mandos", "Accesorios", "Consolas"]}
        onChange={handleInputChange}
        disabled={isViewMode}
        className="marginTop20px"
      />

      <TextInput
        label="Precio"
        name="precio"
        value={formState.precio}
        onChange={handleInputChange}
        disabled={isViewMode}
        className="marginTop20px"
      />

      <Switch
        label="Disponible"
        checked={formState.disponible}
        onChange={handleSwitchChange}
        disabled={isViewMode}
        className="marginTop20px"
      />

      <ProductImageUploader
        label="Imagen del Producto"
        image={formState.imagen}
        onUpload={handleImageUpload}
        disabled={isViewMode}
        className="marginTop20px"
      />

      {isEditMode || isNewMode ? (
        <div className="form-buttons">
          <SubmitButton onClick={handleCancel} className="cancelarBtn" nameText={"Cancelar"} />
          <SubmitButton onClick={handleSubmit} className="guaAgreBtn" nameText={isNewMode ? "Agregar" : "Guardar"} />
        </div>
      ) : null}
    </div>
  );
};

export default ProductForm;
