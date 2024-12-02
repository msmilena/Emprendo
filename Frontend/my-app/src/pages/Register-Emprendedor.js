// src/components/Register.js
import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Button from "../components/Button";
import FormControl from "../components/FormControl";
import "./CSS/Register-Emprendedor.css"; // Importa el archivo CSS específico
import LeftSide from "../components/leftSide";
import ProgressSteps from "../components/ProgressStep"; // Importa el nuevo componente
import LogoUpload from "../components/LogoUpload";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";

function RegisterEmprendedor() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [ruc, setRuc] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [nameStore, setNameStore] = useState("");
  const [logo, setLogo] = useState(null);
  const navigate = useNavigate();  
  const [errors, setErrors] = useState({});  // Añade este estado para manejar errores
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          
          // Almacena las coordenadas en localStorage para acceso futuro
          localStorage.setItem("latitude", latitude);
          localStorage.setItem("longitude", longitude);
          
          console.log("Ubicación obtenida con alta precisión");
        },
        (error) => {
          console.error("No se pudo obtener la ubicación. Por favor, permite el acceso a la ubicación en tu navegador.");
          console.error(`Código de error: ${error.code}, Mensaje: ${error.message}`);
          //console.error(Código de error: ${error.code}, Mensaje: ${error.message});
        },
        {
          enableHighAccuracy: true, // Solicita alta precisión, puede usar GPS en móviles
          timeout: 20000, // Aumenta el tiempo de espera a 20 segundos para mayor precisión
          maximumAge: 0 // No usar datos de ubicación en caché para obtener datos actualizados
        }
      );
    } else {
      console.error("La geolocalización no es compatible con este navegador.");
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  const validateStep1 = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "El nombre es requerido";
    if (!email.trim()) newErrors.email = "El correo es requerido";
    if (!password.trim()) newErrors.password = "La contraseña es requerida";
    return newErrors;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!nameStore.trim()) newErrors.nameStore = "El nombre del emprendimiento es requerido";
    if (!ubicacion.trim() && location.latitude === 0 && location.longitude === 0) newErrors.ubicacion = "La ubicación es requerida";
    if (!ruc.trim()) newErrors.ruc = "El RUC es requerido";
    return newErrors;
  };

  const handleNextStep = () => {
    let stepErrors = {};
    
    if (currentStep === 1) {
      stepErrors = validateStep1();
    } else if (currentStep === 2) {
      stepErrors = validateStep2();
    }

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return; // No avanza si hay errores
    }

    setErrors({}); // Limpia errores si todo está bien
    setCurrentStep(currentStep + 1);
  };
  const handleBackStep = () => {
    setCurrentStep(currentStep - 1);
  };
  const handleLogoChange = (event) => {
    setLogo(event.target.files[0]);
  };
  const handleRegister = async () => {
    // Validate email availability
    const checkResponse = await fetch(`https://emprendo-usuario-service-26932749356.us-west1.run.app/auth/check_email?email=${email}`);
    const checkData = await checkResponse.json();
    if (!checkData.success) {
      alert(checkData.message);
      return;
    }

    // Register user with Firebase Authentication
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User registered:", user);

      // Prepare form data for user registration
      const userData = {
        id: user.uid,
        nombre: name,
        email: email,
        password: password,
        tipo: "emprendedor",
        tipoAuth: 0
      };

      // Register user
      const userResponse = await fetch("https://emprendo-usuario-service-26932749356.us-west1.run.appauth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
      });

      const userResult = await userResponse.json();
      if (!userResult.success) {
        alert(userResult.message);
        return;
      }

      // Get user ID
      const userIdResponse = await fetch(`https://emprendo-usuario-service-26932749356.us-west1.run.app/auth/get_user_id?email=${email}`);
      const userIdResult = await userIdResponse.json();
      if (!userIdResult.success) {
        alert(userIdResult.message);
        return;
      }

      const userId = userIdResult.user_id;

      // Prepare form data for emprendimiento registration
      const formData = new FormData();
      formData.append("idEmprendedor", userId);
      formData.append("nombreComercial", nameStore);
      formData.append("ruc", ruc);
      formData.append("localizacion_latitud", location.latitude);
      formData.append("localizacion_longitud", location.longitude);
      if (logo) {
        formData.append("file", logo);
      }

      // Register emprendimiento
      const emprendimientoResponse = await fetch("https://emprendo-emprendimiento-service-26932749356.us-west1.run.app/emprendimiento/guardarEmprendimiento", {
        method: "POST",
        body: formData
      });

      const emprendimientoResult = await emprendimientoResponse.json();
      if (emprendimientoResult.success) {
        alert("Usuario y emprendimiento registrados exitosamente");
        navigate("/");
      } else {
        alert(emprendimientoResult.message);
      }
    } catch (error) {
      console.error("Error registering user:", error);
      alert("Error al registrar usuario y emprendimiento");
    }
  };

  const renderStepContent = () => {
    if (currentStep === 1) {
      return (
        <>
          <h1>Registro</h1>
          <p className="textIngreso">
            Completa tus datos personales y del emprendimiento
          </p>
          <FormControl
            controlId="formBasicName"
            type="text"
            placeholder="Ingresa nombre completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            label="Nombre Completo"
            error={errors.name} // Añade esta prop
          />

          <FormControl
            controlId="formBasicEmail"
            type="email"
            placeholder="Ingresa tu correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Correo electrónico"
            error={errors.email}
          />

          <FormControl
            controlId="formBasicPassword"
            type="password"
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Contraseña"
            error={errors.password}
          />
          <Button variant="orange" onClick={handleNextStep}>
            Siguiente
          </Button>
        </>
      );
    } else if (currentStep === 2) {
      return (
        <>
          <h1>Registro</h1>
          <p className="textIngreso">
            Completa tus datos personales y del emprendimiento
          </p>
          <FormControl
            controlId="formBasicNameStore"
            type="text"
            placeholder="Ingresa nombre del emprendimiento"
            value={nameStore}
            onChange={(e) => setNameStore(e.target.value)}
            label="Nombre del Emprendimiento"
            error={errors.nameStore}
          />

          <FormControl
            controlId="formBasicUbicacion"
            type="text"
            placeholder="Ingresa la ubicación del emprendimiento"
            value={`Lat: ${location.latitude}, Lng: ${location.longitude}`}
            onChange={(e) => setUbicacion(e.target.value)}
            label="Ubicación del Emprendimiento"
            error={errors.ubicacion}
          />

          <FormControl
            controlId="formBasicRuc"
            type="text"
            placeholder="Ingresa el Registro Único de Contribuyente"
            value={ruc}
            onChange={(e) => {
              const valor = e.target.value;
              if ((/^\d*$/.test(valor)) && (valor.length <= 11)) {
                setRuc(valor);
              }
            }}
            error={errors.ruc}
            label="RUC"
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button variant="secondary" onClick={handleBackStep}>
              Atrás
            </Button>
            <Button variant="orange" onClick={handleNextStep}>
              Siguiente
            </Button>
          </div>
        </>
      );
    } else if (currentStep === 3) {
      return (
        <>
          <h1>Registro</h1>
          <p className="textIngreso">
            Completa tus datos personales y del emprendimiento
          </p>
          <LogoUpload onLogoChange={handleLogoChange} />
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button variant="secondary" onClick={handleBackStep}>
              Atrás
            </Button>
            <Button variant="orange" onClick={handleRegister}>
              Registrar
            </Button>
          </div>
        </>
      );
    }
  };

  return (
    <Container fluid className="">
      <Row>
        <Col xs={6} className="left-side">
          <LeftSide />
        </Col>
        <Col xs={6} className="right-side">
          <ProgressSteps currentStep={currentStep} />
          <form>{renderStepContent()}</form>
        </Col>
      </Row>
    </Container>
  );
}

export default RegisterEmprendedor;