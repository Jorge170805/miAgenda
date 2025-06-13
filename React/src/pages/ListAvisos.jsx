import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout";
import "../styles/groups.css";

const ListAvisos = () => {
  // Estado para guardar la lista de avisos/tareas
  const [listado, setListado] = useState([]);
  
  // Hook para navegación programática en react-router
  const navigate = useNavigate();

  // Al montar el componente, se establece el título y se carga la lista de avisos
  useEffect(() => {
    document.title = "Avisos de Tareas";
    getListado();
  }, []);

  // Obtiene el listado de avisos desde el backend
  const getListado = () => {  
    fetch("http://localhost/PHP/Prueba/tareas/avisos/list.php", {
      credentials: "include",
      method: "POST", // se usa POST según backend
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ok") {
          setListado(data.listado);
        } else {
          alert("❌ " + data.mensaje);
        }
      })
      .catch((error) => {
        alert(error);
        console.error(error);
      });
  };

  // Función para navegar a la página de edición de una tarea
  const editar = (id) => {
    navigate("/editTarea/" + id);
  };

  // Renderiza una fila de la tabla para cada tarea/aviso
  const rowTarea = (e) => {
    // Si la tarea es propia, pone el texto en negrita
    const estilo = e.propias == 1 ? { fontWeight: "bold" } : null;

    return (
      <tr className="fila" style={estilo} key={e.id}>
        <td>{e.tarea}</td>
        <td>
          {e.fechaInicio}
          <br />
          {e.fechaFin}
        </td>
        <td style={{ backgroundColor: e.colorFondo, color: e.colorTexto }}>
          {e.grupo}
        </td>
        <td>{e.estado}</td>
        <td>{e.prioridad}</td>
        <td>{e.propias == 0 && e.propietario}</td>
        <td className="td-borrar">
          <button
            className="btn-icon"
            title="editar"
            onClick={() => editar(e.idTarea)}
          >
            ✏️
          </button>
        </td>
      </tr>
    );
  };

  return (
    <Layout>
      <div className="container">
        <h1>Avisos</h1>
        <br />
        <div className="list">
          <div className="encabezado-tareas">
            {/* Muestra la cantidad de tareas listadas */}
            <p>Tareas ({listado.length})</p>
          </div>
          <hr />
          <table className="tabla">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Fechas</th>
                <th>Grupo</th>
                <th>Estado</th>
                <th>Prioridad</th>
                <th>Propietario</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>{listado.map(rowTarea)}</tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default ListAvisos;
