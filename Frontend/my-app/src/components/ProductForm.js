import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TextInput from "./TextInput";
import TextArea from "./TextArea";
import SubmitButton from "./SubmitButton";
import SelectInput from "./SelectInput";
import Switch from "./Switch";
import Button from "./Button";
import ProductImageUploader from "./ProductImageUploader";
import "./CSS/ProductForm.css";

const ProductForm = ({ productData, onSave, isEditMode, isViewMode, isNewMode }) => {
  const navigate = useNavigate();

  const [formState, setFormState] = useState({
    id: isNewMode ? "" : productData?.id || "",
    nombre_producto: isNewMode ? "" : productData?.nombre_producto || "",
    descripcion_producto: isNewMode ? "" : productData?.descripcion_producto || "",
    categoria_producto: isNewMode ? "" : productData?.categoria_producto || "",
    precio: isNewMode ? "" : productData?.precio || "",
    disponible: isNewMode ? false : productData?.disponible || false,
    imagen: isNewMode ? null : productData?.imagen || null,
  });

  const [errors, setErrors] = useState({});
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    // Cargar categorías desde la API
    const fetchCategorias = async () => {
      try {
        const response = await fetch("https://emprendo-producto-service-26932749356.us-west1.run.app/categorias");
        if (!response.ok) throw new Error("Error al cargar las categorías");
        const data = await response.json();
        setCategorias(data.map((cat) => ({ value: cat.title, label: cat.title })));
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategorias();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSwitchChange = () => {
    setFormState((prevState) => ({ ...prevState, disponible: !prevState.disponible }));
  };

  const handleImageUpload = (file) => {
    setFormState((prevState) => ({ ...prevState, imagen: file }));
  };

  const validateFields = () => {
    const newErrors = {};
    if (!formState.nombre_producto.trim()) newErrors.nombre_producto = "El nombre es requerido";
    if (!formState.descripcion_producto.trim()) newErrors.descripcion_producto = "La descripción es requerida";
    if (!formState.categoria_producto) newErrors.categoria_producto = "La categoría es requerida";
    if (!formState.precio || Number(formState.precio) <= 0)
      newErrors.precio = "El precio debe ser mayor a 0";
    if (!formState.imagen) newErrors.imagen = "La imagen es requerida";
    return newErrors;
  };

  const handleSubmit = () => {
    const errors = validateFields();
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }
    setErrors({});
    console.log(formState);
    onSave(formState);
    navigate("/productosEmprendedor/APEQO6fohuDykka1Uqjn");
  };

  const handleCancel = () => {
    navigate("/productosEmprendedor/APEQO6fohuDykka1Uqjn");
  };

  const handleEdit = () => {
    navigate("/productosEmprendedor/editar/APEQO6fohuDykka1Uqjn");
  };

  return (
    <div className="product-form marginTop50px">
      {!isNewMode && (
        <TextInput
          label="ID"
          name="id"
          value={formState.id}
          onChange={handleInputChange}
          disabled
        />
      )}

      <TextInput
        label="Nombre del Producto"
        name="nombre_producto"
        value={formState.nombre_producto}
        onChange={handleInputChange}
        disabled={isViewMode}
        className="marginTop20px"
        error={errors.nombre_producto}
      />
      <TextArea
        label="Descripción"
        name="descripcion_producto"
        value={formState.descripcion_producto}
        onChange={handleInputChange}
        disabled={isViewMode}
        className="marginTop20px"
        error={errors.descripcion_producto}
      />
      <SelectInput
        label="Categoría"
        name="categoria_producto"
        value={formState.categoria_producto}
        options={categorias.map((category) => category.value)} // Use the 'title' from each category
        onChange={handleInputChange}
        disabled={isViewMode}
        className="marginTop20px"
        error={errors.categoria_producto}
      />
      <TextInput
        label="Precio"
        name="precio"
        value={formState.precio}
        onChange={handleInputChange}
        disabled={isViewMode}
        className="marginTop20px"
        error={errors.precio}
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
        error={errors.imagen}
      />

      {(isEditMode || isNewMode) ? (
        <div className="form-buttons">
          <SubmitButton onClick={handleCancel} className="cancelarBtn" nameText="Cancelar" />
          <SubmitButton onClick={handleSubmit} className="guaAgreBtn" nameText={isNewMode ? "Agregar" : "Guardar"} />
        </div>
      ) : (
        <Button variant="primary" onClick={handleEdit}>
          Editar producto
        </Button>
      )}
    </div>
  );
};

export default ProductForm;
