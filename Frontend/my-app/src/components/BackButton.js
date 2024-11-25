// BackButton.jsx
import React from 'react';
import { ArrowLeft } from 'lucide-react'; // Usando un icono de lucide-react
import { useNavigate } from 'react-router-dom';
import './CSS/BackButton.css';

const BackButton = ({ to = null }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (to) {
      navigate(to); // Navega al enlace definido
    } else {
      navigate(-1); // Retrocede a la página anterior
    }
  };

  return (
    <button className="back-button" onClick={handleBack}>
      <ArrowLeft size={20} />
      <span>Volver</span>
    </button>
  );
};

export default BackButton;
