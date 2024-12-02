import React, { useState, useEffect } from "react";
import TextInput from "./TextInput";
import TextArea from "./TextArea";
import SelectInput from "./SelectInput";
import SocialLinks from "./SocialLinks";
import LogoUploader from "./LogoUploader";
import SubmitButton from "./SubmitButton";
import "./CSS/FormContainer.css";

const FormContainer = () => {
  const data = JSON.parse(localStorage.getItem("emprendimientoData"));
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubCategorias] = useState([]);
  const [formData, setFormData] = useState({
    emprendimiento: data.nombreComercial || "",
    ruc: data.ruc || "",
    ubicacion: "",
    descripcion: data.descripcion || "",
    categoria: data.categoria || "",
    subCategoria: data.subCategoria || "",
    facebook: data.redesSociales?.facebook || "",
    instagram: data.redesSociales?.instagram || "",
    twitter: data.redesSociales?.twitter || "",
    logo: data.image_url || "",  // URL de la imagen
  });
  const [initialData, setInitialData] = useState({ ...formData });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Fetch categories and subcategories from API
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

    const fetchSubCategorias = async () => {
      try {
        const response = await fetch("https://emprendo-producto-service-26932749356.us-west1.run.app/categorias_subcategorias");
        if (!response.ok) throw new Error("Error al cargar las subcategorías");
        const data = await response.json();

        const subCategorias = Object.keys(data).map((category) => ({
          value: category,
          label: category,
          subcategorias: data[category].map((subCategory) => ({
            value: subCategory,
            label: subCategory
          }))
        }));

        setSubCategorias(subCategorias);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategorias();
    fetchSubCategorias();
  }, []);

  // Function to fetch address from coordinates
  async function getAddressFromCoordinates(latitude, longitude, apiKey) {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
      );
      const data = await response.json();

      if (data.status === "OK" && data.results.length > 0) {
        return data.results[0].formatted_address;
      } else {
        console.error("Error fetching address:", data.status);
        return "Dirección no disponible";
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      return "Error al obtener la dirección";
    }
  }

  useEffect(() => {
    if (data?.localizacion?.latitude && data?.localizacion?.longitude) {
      const fetchAddress = async () => {
        const address = await getAddressFromCoordinates(
          data.localizacion.latitude,
          data.localizacion.longitude,
          "AIzaSyBcYYMGd6XzoGXr3GNobB49cEOJg_7N2wU"
        );
        setFormData((prevData) => ({
          ...prevData,
          ubicacion: address,
        }));
      };
      fetchAddress();
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogoUpload = (file) => {
    // Asumiendo que el LogoUploader puede manejar imágenes y se espera una URL
    const imageUrl = URL.createObjectURL(file);  // O su lógica para obtener URL
    setFormData({ ...formData, logo: imageUrl });
  };

  const handleSubmit = () => {
    // Switch back to view mode after saving
    setIsEditing(false);

    // Update initial data with saved changes
    setInitialData({ ...formData });
  };

  const handleCancel = () => {
    setFormData({ ...initialData });
    setIsEditing(false); // Change to view mode
  };

  const handleButtonClick = () => {
    if (isEditing) {
      handleSubmit(); // Save data if in edit mode
    } else {
      setIsEditing(!isEditing); // Toggle to edit mode
    }
  };

  return (
    <div className="dashboard-content">
      <h2>{!isEditing ? "Información del emprendimiento" : "Actualizar información del emprendimiento"}</h2>
      <div>
        <form className="form-container">
          <TextInput disabled={!isEditing} label="Emprendimiento" name="emprendimiento" value={formData.emprendimiento} onChange={handleChange} />
          <TextInput disabled={!isEditing} label="RUC" name="ruc" value={formData.ruc} onChange={handleChange} />
          <TextInput disabled={!isEditing} label="Ubicación" name="ubicacion" value={formData.ubicacion} onChange={handleChange} />
          <TextArea disabled={!isEditing} label="Descripción" name="descripcion" value={formData.descripcion} onChange={handleChange} />
          <SelectInput disabled={!isEditing} label="Categoría" name="categoria" value={formData.categoria} options={categorias.map((category) => category.value)} onChange={handleChange} />
          <SelectInput disabled={!isEditing} label="Sub Categorías" name="subCategoria" value={formData.subCategoria} options={subcategorias.map((subcategory) => subcategory.value)} onChange={handleChange} />
          <SocialLinks disabled={!isEditing} facebook={formData.facebook} instagram={formData.instagram} twitter={formData.twitter} onChange={handleChange} />
          
          <LogoUploader disabled={!isEditing} logo={formData.logo} onUpload={handleLogoUpload} />
          
          <div className="form-buttons">
            {isEditing && <SubmitButton className="cancelarBtn" nameText="Cancelar" onClick={handleCancel} />}
            <SubmitButton className="guaAgreBtn" nameText={isEditing ? "Guardar cambios" : "Actualizar"} onClick={handleButtonClick} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormContainer;
