import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import TextInput from "./TextInput";
import TextArea from "./TextArea";
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
    const [errors, setErrors] = useState({}); 
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

    const validateFields = () => {
        const newErrors = {};
        if (!formState.nombre_producto.trim()) newErrors.nombre_producto = "El nombre es requerido";
        if (!formState.descripcion_producto.trim()) newErrors.descripcion_producto = "La descripción es requerida";
        if (!formState.categoria_producto.trim()) newErrors.categoria_producto = "La categoría es requerida";
        if (!formState.precio.trim()) newErrors.precio = "El precio es requerido";
        if (!formState.imagen.trim()) newErrors.imagen = "La imagen es requerida";
        return newErrors;
      };
    const handleSubmit = () => {
        let errors = {};
        errors = validateFields();
        if (Object.keys(errors).length > 0) {
        setErrors(errors);
        return; // No avanza si hay errores
        }
        setErrors({}); // Limpia errores si todo está bien
        onSave(formState);
    };
    const navigate = useNavigate();
    const handleEdit = () => {
        navigate('/productosEmprendedor/editar/APEQO6fohuDykka1Uqjn');
    };
    const handleCancel = () => {
        navigate('/productosEmprendedor/APEQO6fohuDykka1Uqjn')
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
            label="Nombre del Producto" name="nombre_producto"      value={formState.nombre_producto} onChange={handleInputChange}
            disabled={isViewMode}       className="marginTop20px"   error={errors.nombre_producto}/>
        <TextArea
            label="Descripción"     name="descripcion_producto" value={formState.descripcion_producto} onChange={handleInputChange}
            disabled={isViewMode}   className="marginTop20px"   error={errors.descripcion_producto}/>
        <SelectInput
            label="Categoría"               name="categoria_producto"   value={formState.categoria_producto}    options={["Mandos", "Accesorios", "Consolas"]}
            onChange={handleInputChange}    disabled={isViewMode}       className="marginTop20px"               error={errors.categoria_producto}/>
        <TextInput
            label="Precio"          name="precio"               value={formState.precio}    onChange={handleInputChange} 
            disabled={isViewMode}   className="marginTop20px"   error={errors.precio}/>
        <Switch
            label="Disponible"      checked={formState.disponible}      onChange={handleSwitchChange}
            disabled={isViewMode}   className="marginTop20px"           error={errors.disponible}/>
        <ProductImageUploader
            label="Imagen del Producto"     image={formState.imagen}        onUpload={handleImageUpload}
            disabled={isViewMode}           className="marginTop20px"       error={errors.imagen}/>

        {isEditMode || isNewMode ? (
            <div className="form-buttons">
            <SubmitButton onClick={handleCancel} className="cancelarBtn" nameText={"Cancelar"}/>
            <SubmitButton onClick={handleSubmit} className="guaAgreBtn" nameText={isNewMode ? "Agregar" : "Guardar"}/>
            </div>
        ) : 
        <Button variant="primary" onClick={handleEdit}>
            Editar producto
        </Button>}
        </div>
    );
};

export default ProductForm;
