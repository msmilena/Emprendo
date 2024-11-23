// ModalComponent.jsx
import React from "react";
import "./CSS/Modal.css";
import Button from "../components/Button";

const Modal = ({ isOpen, onClose, onConfirm, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
        <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        {children}
        <div className="modal-buttons">
            <Button 
              variant="secondary" 
              onClick={() => alert("Botón presionado")}
            >
              Cancelar
            </Button>
            <Button 
              variant="danger" 
              onClick={() => alert("Botón presionado")}
            >
              Eliminar
            </Button>
        </div>
        </div>
    </div>
  );
};

export default Modal;
