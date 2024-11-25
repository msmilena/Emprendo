// src/components/ProductForm.js
import React, { useEffect,useState } from "react";
import TextInput from "./TextInput";
import TextArea from "./TextArea";
import LogoUploader from "./LogoUploader";
import SubmitButton from "./SubmitButton";
import Button from "./Button";
import "./CSS/FormContainer.css";
import { useNavigate } from 'react-router-dom';

const ProductForm = ({ formData: initialData, onSave, isEditMode, isViewMode , isNewMode}) => {

    const emptyFormData = {
        cantidadFavoritos: 0,
        categoria_producto: "",
        descripcion_producto: "",
        flgDisponible: true,
        nombre_producto: "",
        precio: 0,
        imagen: null,
        id: null
    };

    // Inicialización del estado basada en el modo
    const getInitialFormData = () => {
        if (isNewMode) {
            return emptyFormData;
        }
        if ((isEditMode || isViewMode) && initialData) {
            return initialData;
        }
        return emptyFormData;
    };

    const [formData, setFormData] = useState(getInitialFormData());

    // Actualizar formData cuando cambien los datos iniciales (útil para modo edición/vista)
    useEffect(() => {
        if ((isEditMode || isViewMode) && initialData) {
            setFormData(initialData);
        } else if (isNewMode) {
            setFormData(emptyFormData);
        }
    }, [initialData, isEditMode, isViewMode, isNewMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };
    
    const navigate = useNavigate();
    const handleEditClick = (formData) => {
        navigate(`/productosEmprendedor/editar/${formData.id}`);
    };

    const handleLogoUpload = (file) => {
        setFormData(prevData => ({
            ...prevData,
            imagen: file
        }));
    };

    const handleSubmit = (e) => {
        // Lógica para enviar el formulario
        e.preventDefault();
        if (!isViewMode) {
            onSave(formData);
        }
        console.log("Datos del formulario enviados:", formData);
    };

    return (

        <form className="form-container">
            <TextInput label="Nombre del Producto" name="nombre" value={formData.nombre_producto} onChange={handleChange} disabled={isViewMode}/>
            <TextArea label="Descripción" name="descripcion" value={formData.descripcion_producto} onChange={handleChange} disabled={isViewMode} />
            <TextInput label="Categoría" name="categoria" value={formData.categoria_producto} onChange={handleChange} disabled={isViewMode}/>
            <TextInput label="Precio" name="precio" value={formData.precio} onChange={handleChange} disabled={isViewMode}/>
            <TextInput label="Disponible" name="disponible" value={formData.disponible} onChange={handleChange} disabled={isViewMode}/>

            <LogoUploader logo={formData.imagen} onUpload={handleLogoUpload} />
            {isViewMode ? (
                <Button 
                    variant="primary" 
                    onClick={handleEditClick}
                >
                    Editar producto
                </Button>
            ) : (
                <SubmitButton onClick={handleSubmit} />
            )}
        </form>
    );
};

export default ProductForm;
