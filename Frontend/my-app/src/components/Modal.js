// ModalComponent.jsx
import React from "react";
import "./CSS/Modal.css";
import Button from "../components/Button";

const Modal = ({ isOpen, onConfirm, onCancel, onDelete, children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
            <button className="modal-close" onClick={onCancel}>
            &times;
            </button>
            {children}
            <div className="modal-buttons">
                <Button 
                    variant="secondary" 
                    onClick={onCancel}
                >
                    Cancelar
                </Button>
                <Button 
                    variant="danger" 
                    onClick={onDelete}
                >
                    Eliminar
                </Button>
            </div>
            </div>
        </div>
    );
};

export default Modal;
