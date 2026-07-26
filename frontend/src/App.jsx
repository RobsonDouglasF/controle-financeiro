import { useState } from "react";
import Navbar from "../components/Navbar";
import Dashboard from "../pages/Dashboard";
import "./App.css";
import { Navigate, BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import PaginaDebitos from "../pages/Debitos";
import PaginaProventos from "../pages/Proventos";
import PaginaRelatorios from "../pages/Relatorio";

function RotaPrivada({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

function LayoutInterno({ children, mesSelecionado, setMesSelecionado }) {
  return (
    <div className="h-screen flex flex-col">
      <Navbar
        mesSelecionado={mesSelecionado}
        setMesSelecionado={setMesSelecionado}
      />
      <div className="flex overflow-auto">{children}</div>
    </div>
  );
}

export default function App() {
  const [mesSelecionado, setMesSelecionado] = useState({
    mes: new Date().getMonth() + 1,
    ano: new Date().getFullYear(),
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route
          path="dashboard"
          element={
            <RotaPrivada>
              <LayoutInterno
                mesSelecionado={mesSelecionado}
                setMesSelecionado={setMesSelecionado}
              >
                <Dashboard mesSelecionado={mesSelecionado} />
              </LayoutInterno>
            </RotaPrivada>
          }
        />
        <Route
          path="debitos"
          element={
            <RotaPrivada>
              <LayoutInterno
                mesSelecionado={mesSelecionado}
                setMesSelecionado={setMesSelecionado}
              >
                <PaginaDebitos mesSelecionado={mesSelecionado} />
              </LayoutInterno>
            </RotaPrivada>
          }
        />
        <Route
          path="proventos"
          element={
            <RotaPrivada>
              <LayoutInterno
                mesSelecionado={mesSelecionado}
                setMesSelecionado={setMesSelecionado}
              >
                <PaginaProventos mesSelecionado={mesSelecionado} />
              </LayoutInterno>
            </RotaPrivada>
          }
        />
        <Route
          path="relatorio"
          element={
            <RotaPrivada>
              <LayoutInterno
                mesSelecionado={mesSelecionado}
                setMesSelecionado={setMesSelecionado}
              >
                <PaginaRelatorios mesSelecionado={mesSelecionado} />
              </LayoutInterno>
            </RotaPrivada>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}
