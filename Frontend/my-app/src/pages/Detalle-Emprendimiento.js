import React, { useState, useEffect } from 'react';
import Nav from "../components/Nav";
import Footer2 from "../components/Footer2";
import Rating from 'react-rating-stars-component';
import { useParams, Link } from 'react-router-dom';
import 'react-multi-carousel/lib/styles.css';
import tiendaImg from '../assets/tienda.png'; // Importar la imagen por defecto
import './CSS/Detalle-Emprendimiento.css';

const DetalleEmprendimiento = () => {
  const { id } = useParams();
  const [emprendimiento, setEmprendimiento] = useState(null);
  const [rating, setRating] = useState(0);
  const [existingRating, setExistingRating] = useState(false); // Nuevo estado para verificar si ya existe una valoración
  const userId = localStorage.getItem('userId'); // Obtener el userId de la variable local
  const isLoggedIn = !!userId;

  useEffect(() => {
    // Fetch the emprendimiento details from the API
    fetch(`https://emprendo-emprendimiento-service-26932749356.us-west1.run.app/emprendimiento/emprendimientoInfo?idEmprendimiento=${id}`)
      .then(response => response.json())
      .then(data => setEmprendimiento(data.emprendimientoData))
      .catch(error => console.error('Error fetching data:', error));

    // Fetch the user's ratings if logged in
    if (isLoggedIn) {
      fetch(`https://emprendo-valoracion-service-26932749356.us-west1.run.app/valoracion/getValoraciones/usuario?idUsuario=${userId}`)
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            const valoracion = data.valoraciones.find(v => v.idEmprendimiento === id);
            if (valoracion) {
              setRating(valoracion.valoracion);
              setExistingRating(true); // Marcar que ya existe una valoración
            }
          }
        })
        .catch(error => console.error('Error fetching ratings:', error));
    }
  }, [id, isLoggedIn, userId]);
  

  const handleRatingChange = (newRating) => {
    //console.log('New rating:', newRating); // Ver el valor del rating antes de enviarlo
    setRating(newRating);
    handleSubmitRating(newRating); // Llamar a handleSubmitRating después de actualizar el estado
  };
    
  const handleSubmitRating = (newRating) => {
    const url = existingRating
      ? `https://emprendo-valoracion-service-26932749356.us-west1.run.app/valoracion/uptValoraciones?idUsuario=${userId}`
      : `https://emprendo-valoracion-service-26932749356.us-west1.run.app/valoracion/guardarValoracion?idUsuario=${userId}`;
    const method = existingRating ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idEmprendimiento: id, valor: newRating }),
    })
      .then(response => response.json())
      .then(data => console.log('Rating submitted:', data))
      .catch(error => console.error('Error submitting rating:', error));
  };

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };

  if (!emprendimiento) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Nav />
      <div className="emprendimiento-detail">
        <div className="emprendimiento-content">
          <div className='seccion-superior'>
            <nav className="breadcrumb">
              <Link to="/emprendimientos">Emprendimientos</Link> &gt; <span>{emprendimiento.nombreComercial}</span>
            </nav>
            <h1 className='subtitulo'>Información</h1>
          </div>
          
          <div className="emprendimiento-container">
            <div className="emprendimiento-column image-column">
              <h2>{emprendimiento.nombreComercial}</h2>
              <img src={tiendaImg} alt="Emprendimiento" />
              <div className="average-rating">
                <Rating
                  count={5}
                  value={emprendimiento.valoracion.promedioValoracion}
                  size={24}
                  activeColor="#ffd700"
                  edit={false}
                  isHalf={true}
                />
                <span>{emprendimiento.valoracion.promedioValoracion.toFixed(1)}</span>
              </div>
            </div>
            <div className="emprendimiento-column info-column">
              <p>{emprendimiento.descripcion}</p>
              <p>Category: {emprendimiento.categoria}</p>
              <p>Subcategory: {emprendimiento.subcategoria}</p>
              <p>RUC: {emprendimiento.ruc}</p>
              <p>Location: {emprendimiento.localizacion.latitude}, {emprendimiento.localizacion.longitude}</p>
              <p>Social Media:</p>
              <ul>
                <li><a href={emprendimiento.redesSociales.facebook} target="_blank" rel="noopener noreferrer">Facebook</a></li>
                <li><a href={emprendimiento.redesSociales.instagram} target="_blank" rel="noopener noreferrer">Instagram</a></li>
                <li><a href={emprendimiento.redesSociales.twitter} target="_blank" rel="noopener noreferrer">Twitter</a></li>
              </ul>
              <p>Tags: {emprendimiento.tags.join(', ')}</p>
              <p>Average Rating: {emprendimiento.valoracion.promedioValoracion}</p>
              {isLoggedIn && (
                <div className="rating-section">
                  <h5>Califica este emprendimiento</h5>
                  <Rating
                    count={5}
                    value={rating}
                    onChange={handleRatingChange}
                    size={24}
                    activeColor="#ffd700"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer2 />
    </div>
  );
};

export default DetalleEmprendimiento;