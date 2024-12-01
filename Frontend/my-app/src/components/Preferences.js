import React, { useState } from "react";
import { Container } from "react-bootstrap";
import "./CSS/Preferences.css"; 

const Preferences = ({ onNext }) => {
  const [selectedPreferences, setSelectedPreferences] = useState([]);

  const preferences = [
    'Tecnologia',
    'Moda',
    'Salud y Bienestar',
    'Deportes',
    'Alimentos',
    'Hogar',
  ];

  const handlePreferenceClick = (preference) => {
    if (selectedPreferences.includes(preference)) {
      setSelectedPreferences(selectedPreferences.filter((p) => p !== preference));
    } else {
      setSelectedPreferences([...selectedPreferences, preference]);
    }
  };

  return (
    <Container className="preferences-container">
      <div className="row">
        {preferences.map((preference) => (
          <div key={preference} className="col-md-4 mb-4">
            <button
              className={`btn btn-lg ${
                selectedPreferences.includes(preference) ? 'btn-primary' : 'btn-secondary'
              }`}
              onClick={() => handlePreferenceClick(preference)}
            >
              {preference}
            </button>
          </div>
        ))}
      </div>
      <div className="text-center mt-5">
        <button className="btn btn-success" onClick={onNext}>Siguiente</button>
      </div>
    </Container>
  );
};

export default Preferences;