// src/components/FormControl.js
import React from "react";
import { Form } from "react-bootstrap";
import "./CSS/FormControl.css"; // Importa el archivo CSS

const FormControl = ({
  type,
  placeholder,
  value,
  onChange,
  controlId,
  label,
}) => {
  return (
    <Form.Group controlId={controlId}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="custom-form-control" // Aplica la clase CSS
      />
    </Form.Group>
  );
};

export default FormControl;
