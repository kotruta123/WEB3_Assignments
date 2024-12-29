import { Route, Routes } from "react-router-dom";
import Login from "./Views/Login";
import Game from "./Views/Game";
import Lobby from "./Views/Lobby";
import Pending from "./Views/Pending";
import Nav from "./components/Nav";

function App() {
  return (
    <div className="max-w-screen-2xl mx-auto bg-slate-800 h-screen">
      <div className="bg-white">
        <Routes>
          <Route
            path="/"
            element={
              <Nav>
                <Lobby />
              </Nav>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route
            path="/pending/:id"
            element={
              <Nav>
                <Pending />
              </Nav>
            }
          />
          <Route
            path="/game/:id"
            element={
              <Nav>
                <Game />
              </Nav>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
