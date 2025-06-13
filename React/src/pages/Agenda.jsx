import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Calendario from "../components/Calendario";
import "../styles/agenda.css";  

const Agenda = () => {
  const navigate = useNavigate();

  // Funcion que se llama al seleccionar una fecha en el calendario
  const handleFechaSeleccionada = (fecha) => {
    // Formateo del dia, mes y anio
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();

    // Se crean dos strings con el inicio y fin del dia
    const fechaInicio = anio + "-" + mes + "-" + dia + "T00:00:00";
    const fechaFin = anio + "-" + mes + "-" + dia + "T23:59:59";
    
    // Se recuperan filtros guardados desde localStorage
    let jsonFiltros = localStorage.getItem("filtrosTareas");
    let filtros = JSON.parse(jsonFiltros);

    // Se actualizan los filtros con la nueva fecha
    filtros = {...filtros, fechaInicio: fechaInicio, fechaFin: fechaFin};

    // Se guardan nuevamente los filtros en localStorage
    localStorage.setItem("filtrosTareas", JSON.stringify(filtros));

    // Se redirige a la lista de tareas con el nuevo filtro aplicado
    navigate(`/ListTareas/false`);
  };

  return (
    <Layout>
      <div className="agenda-container">
        <div className="calendario">
          {/* Componente del calendario que ejecuta la funcion cuando se elige una fecha */}
          <Calendario onFechaSeleccionada={handleFechaSeleccionada} />
        </div>
      </div>
    </Layout>
  );
};

export default Agenda;
