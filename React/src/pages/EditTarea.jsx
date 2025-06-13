import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import "../styles/editTarea.css";  

let timer = null;

const EditTarea = () => {
  const { id } = useParams(); // Obtiene el id desde la URL
  const navigate = useNavigate(); // Para redirigir al usuario

  // Estados principales
  const [elemento, setElemento] = useState({});
  const [mensaje, setMensaje] = useState("");
  const [title, setTitle] = useState("");

  // Desplegables para selects
  const [desplegableGrupos, setDesplegableGrupos] = useState([]);
  const [desplegableEstados, setDesplegableEstados] = useState([]);
  const [desplegablePrioridades, setDesplegablePrioridades] = useState([]);

  // ------------------------------------------------------------
  // Al cargar el componente
  useEffect(() => {
    if (id == 0) {
      document.title = "Nueva Tarea";
      setTitle("Creacion de Tarea");
      // Si es nueva, se inicializa un objeto vacio
      setElemento({
        id: null,
        nombre: "",
        descripcion: "",
        fechaInicio: "",
        fechaFin: "",
        fidGrupo: "",
        fidPrioridad: "",
        fidEstado: "",
        fidUsuario: ""
      });
    } else {
      document.title = "Edicion de Tarea";
      setTitle("Edicion de Tarea");
      getElemento(); // Trae los datos para editar
    }

    getDesplegables(); // Carga opciones para los selects
  }, []);

  // ------------------------------------------------------------
  // Trae una tarea por id
  const getElemento = () => {
    const formData = new FormData();
    formData.append("id", id);

    fetch("http://localhost/PHP/Prueba/tareas/findById.php", {
      credentials: "include",
      method: "POST",
      body: formData
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          setElemento(data.elemento);
        } else {
          alert("❌ " + data.mensaje);
        }
      })
      .catch((error) => {
        alert(error);
        console.error(error);
      });
  };

  // ------------------------------------------------------------
  // Carga los datos para los desplegables
  const getDesplegables = () => {
    fetch("http://localhost/PHP/Prueba/tareas/desplegables.php", {
      credentials: "include",
      method: "POST"
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          setDesplegableEstados(data.estados);
          setDesplegableGrupos(data.grupos);
          setDesplegablePrioridades(data.prioridades);
        } else {
          alert("❌ " + data.mensaje);
        }
      })
      .catch((error) => {
        alert(error);
        console.error(error);
      });
  };

  // ------------------------------------------------------------
  // Validaciones antes de guardar
  function validaciones() {
    setMensaje("");

    if (elemento.nombre.trim() === "") {
      setMensajeAndClean("❌ El campo nombre no puede estar vacio");
      return false;
    }
    if (elemento.descripcion.trim() === "") {
      setMensajeAndClean("❌ El campo descripcion no puede estar vacio");
      return false;
    }
    if (elemento.fechaInicio.trim() === "") {
      setMensajeAndClean("❌ El campo fecha inicio no puede estar vacio");
      return false;
    }

    if (elemento.fechaFin?.trim()) {
      let fi = new Date(elemento.fechaInicio);
      let ff = new Date(elemento.fechaFin);
      if (ff < fi) {
        setMensajeAndClean("❌ La fecha de fin no puede ser menor que la de inicio");
        return false;
      }
    }

    if (elemento.fidGrupo === "") {
      setMensajeAndClean("❌ El campo grupo no puede estar vacio");
      return false;
    }

    if (elemento.fidPrioridad === "") {
      setMensajeAndClean("❌ El campo prioridad no puede estar vacio");
      return false;
    }

    if (elemento.fidEstado === "") {
      setMensajeAndClean("❌ El campo estado no puede estar vacio");
      return false;
    }

    return true;
  }

  // ------------------------------------------------------------
  // Guardar o actualizar tarea
  function save() {
    if (!validaciones()) return;

    const formData = new FormData();
    formData.append("elemento", JSON.stringify(elemento));

    fetch("http://localhost/PHP/Prueba/tareas/save.php", {
      method: "POST",
      body: formData,
      credentials: "include"
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          setMensajeAndClean("✅ " + data.mensaje);
          setTimeout(() => navigate("/listTareas/false"), 3000);
        } else {
          setMensajeAndClean("❌ " + data.mensaje);
        }
      })
      .catch((err) => {
        console.error(err);
        setMensajeAndClean("❌ Error al conectar con el servidor");
      });
  }

  // ------------------------------------------------------------
  function cancel() {
    navigate("/listTareas/false");
  }

  // ------------------------------------------------------------
  // Muestra mensajes flotantes temporales
  const setMensajeAndClean = (message) => {
    setMensaje(message);
    if (timer != null) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => setMensaje(""), 3000);
  };

  // ------------------------------------------------------------
  // Render
  return (
    <Layout>
      <div className="edit-tarea-container">
        <h1>{title}</h1>
        {mensaje && <p className="message">{mensaje}</p>}

        <label>Nombre:</label>
        <input
          type="text"
          value={elemento.nombre}
          onChange={(e) => setElemento({ ...elemento, nombre: e.target.value })}
          maxLength={100}
          disabled={elemento.soloConsulta}
        />

        <label>Descripcion:</label>
        <textarea
          value={elemento.descripcion}
          onChange={(e) => setElemento({ ...elemento, descripcion: e.target.value })}
          disabled={elemento.soloConsulta}
        />

        <div className="edit-tarea-fechas">
          <div className="fecha-field">
            <label>Fecha Inicio:</label>
            <input
              type="datetime-local"
              value={elemento.fechaInicio}
              onChange={(e) => setElemento({ ...elemento, fechaInicio: e.target.value })}
              disabled={elemento.soloConsulta}
            />
          </div>
          <div className="fecha-field">
            <label>Fecha Fin:</label>
            <input
              type="datetime-local"
              value={elemento.fechaFin}
              onChange={(e) => setElemento({ ...elemento, fechaFin: e.target.value })}
              disabled={elemento.soloConsulta}
            />
          </div>
        </div>

        <div className="edit-tarea-selects">
          <div className="select-field">
            <label>Grupo:</label>
            <select
              value={elemento.fidGrupo}
              onChange={(e) => setElemento({ ...elemento, fidGrupo: e.target.value })}
              disabled={elemento.soloConsulta}
            >
              <option value="">...</option>
              {desplegableGrupos.map((e) => (
                <option key={e.id} value={e.id}>{e.nombre}</option>
              ))}
            </select>
          </div>

          <div className="select-field">
            <label>Prioridad:</label>
            <select
              value={elemento.fidPrioridad}
              onChange={(e) => setElemento({ ...elemento, fidPrioridad: e.target.value })}
              disabled={elemento.soloConsulta}
            >
              <option value="">...</option>
              {desplegablePrioridades.map((e) => (
                <option key={e.id} value={e.id}>{e.nombre}</option>
              ))}
            </select>
          </div>

          <div className="select-field">
            <label>Estado:</label>
            <select
              value={elemento.fidEstado}
              onChange={(e) => setElemento({ ...elemento, fidEstado: e.target.value })}
              disabled={elemento.soloConsulta}
            >
              <option value="">...</option>
              {desplegableEstados.map((e) => (
                <option key={e.id} value={e.id}>{e.nombre}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="edit-tarea-buttons">
          {!elemento.soloConsulta && <button onClick={save}>Guardar</button>}
          <button onClick={cancel}>Cancelar</button>
        </div>
      </div>
    </Layout>
  );
};

export default EditTarea;
