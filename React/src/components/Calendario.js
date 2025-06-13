import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/calendario.css";

const Calendario = ({ onFechaSeleccionada }) => {
  const [fecha, setFecha] = useState(new Date());

  const handleChange = (date) => {
    setFecha(date);
    onFechaSeleccionada(date);
  };

  return (
    <div className="calendario-container">
      <h2 className="calendario-title">Selecciona un día</h2>
      <Calendar
        onChange={handleChange}
        value={fecha}
        locale="es-ES"
        className="calendario"
      />
    </div>
  );
};

export default Calendario;
