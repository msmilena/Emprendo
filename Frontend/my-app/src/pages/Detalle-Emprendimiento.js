import React, { useState, useEffect } from 'react';
import Nav from "../components/Nav";
import Footer2 from "../components/Footer2";
import Rating from 'react-rating-stars-component';
import { useParams } from 'react-router-dom';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const DetalleEmprendimiento = () => {
  const { id } = useParams();
  const [emprendimiento, setEmprendimiento] = useState(null);
  const [rating, setRating] = useState(0);
  const userId = localStorage.getItem('userId'); // Obtener el userId de la variable local


  useEffect(() => {
    // Fetch the emprendimiento details from the API
    fetch(`https://emprendo-emprendimiento-service-26932749356.us-west1.run.app/emprendimiento/emprendimientoInfo?idEmprendimiento=${id}`)
      .then(response => response.json())
      .then(data => setEmprendimiento(data.emprendimientoData))
      .catch(error => console.error('Error fetching data:', error));
  }, [id]);
  // haz un console.log de emprendimiento para ver que datos trae
    console.log(emprendimiento);

    const handleRatingChange = (newRating) => {
        console.log('New rating:', newRating); // Ver el valor del rating antes de enviarlo
        setRating(newRating);
      };
    
      const handleSubmitRating = () => {
        // Optionally, send the rating to the server
        fetch(`https://emprendo-valoracion-service-26932749356.us-west1.run.app/valoracion/guardarValoracion?idUsuario=${userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ idEmprendimiento: id, valor: rating }),
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
        <h1>{emprendimiento.nombreComercial}</h1>
        <Carousel responsive={responsive}>
          <div>
            <img src={emprendimiento.imgURL} alt={emprendimiento.nombreComercial} />
          </div>
        </Carousel>
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
        <p>Total Ratings: {emprendimiento.valoracion.totalesValoracion}</p>
        <div>
          <h2>Rate this emprendimiento</h2>
          <Rating
            count={5}
            value={rating}
            onChange={handleRatingChange}
            size={24}
            activeColor="#ffd700"
          />
          <button onClick={handleSubmitRating}>Calificar</button>
        </div>
      </div>
      <Footer2 />
    </div>
  );
};

export default DetalleEmprendimiento;