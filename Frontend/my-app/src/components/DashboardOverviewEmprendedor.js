import React, { useEffect, useState } from "react";
import SummaryCard from "./SummaryCardEmprendedor";
import "./CSS/DashboardOverviewEmprendedor.css";

const DashboardOverviewEmprendedor = () => {
  const [data, setData] = useState(null); // Estado para guardar los datos
  const [loading, setLoading] = useState(true); // Estado para mostrar un indicador de carga
  const [error, setError] = useState(null); // Estado para manejar errores

  const idEmprendedor = localStorage.getItem("userId"); // O el ID que necesites

  useEffect(() => {
    const fetchData = async () => {
      if (!idEmprendedor) {
        setError("ID de emprendedor no proporcionado");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://emprendo-emprendimiento-service-26932749356.us-west1.run.app/emprendimiento/resumenDashboardEmprendimiento?idEmprendedor=${idEmprendedor}`
        );
        //console.log(response);
        if (!response.ok) {
          throw new Error("Error al obtener los datos del servidor");
        }
        const result = await response.json();
        if (result.success) {
          // Procesar los datos
          const resumen = result.resumen.reduce(
            (acc, curr) => ({
              promedioValoracion: acc.promedioValoracion + curr.promedioValoracion,
              totalesValoracion: acc.totalesValoracion + curr.totalesValoracion,
              numeroProductos: acc.numeroProductos + curr.numeroProductos,
            }),
            { promedioValoracion: 0, totalesValoracion: 0, numeroProductos: 0 }
          );
          setData(resumen);
        } else {
          setError("No se encontraron datos");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idEmprendedor]); // Se ejecuta cada vez que cambia el idEmprendedor

  if (loading) {
    return <div className="dashboard-overview">Cargando datos...</div>;
  }

  if (error) {
    return <div className="dashboard-overview">Error: {error}</div>;
  }

  return (
    <div className="dashboard-overview">
      <SummaryCard title="Valoración Promedio" value={data.promedioValoracion.toFixed(2)} />
      <SummaryCard title="Total de Interacciones" value={data.totalesValoracion} />
      <SummaryCard title="Cantidad de Productos" value={data.numeroProductos} />
    </div>
  );
};

export default DashboardOverviewEmprendedor;
