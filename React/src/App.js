import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Agenda from "./pages/Agenda";
import Register from "./pages/Register";
import Groups from "./pages/Groups";
import Priorities from "./pages/Priorities";
import EstadosTareas from "./pages/EstadosTareas";
import ParticipantesTarea from "./pages/ParticipantesTarea";
import ChatsTarea from "./pages/ChatsTarea";
import ListTareas from "./pages/ListTareas";
import EditTarea from "./pages/EditTarea";
import ListAvisos from "./pages/ListAvisos";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login"                  element={<Login />} />
        <Route path="/register"               element={<Register />} />
        <Route path="/groups"                 element={<Groups />} />
        <Route path="/agenda"                 element={<Agenda />} />
        <Route path="/listTareas/:clean"      element={<ListTareas />}/>
        <Route path="/editTarea/:id"          element={<EditTarea />}/>
        <Route path="/priorities"             element={<Priorities />}/>
        <Route path="/estadosTareas"          element={<EstadosTareas />}/>
        <Route path="/participantesTarea/:id" element={<ParticipantesTarea />}/>
        <Route path="/chatsTarea/:id"         element={<ChatsTarea />}/>
        <Route path="/avisos"                 element={<ListAvisos />}/>


        {/* Página por defecto si no coincide ninguna ruta */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
