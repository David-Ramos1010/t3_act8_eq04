import { useState } from "react";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

function App() {
    const [usuario, setUsuario] = useState(null);
    const [vistaActual, setVistaActual] = useState("dashboard");

    function iniciarSesion(datosUsuario) {
        setUsuario(datosUsuario);
        setVistaActual("dashboard");
    }

    function cerrarSesion() {
        setUsuario(null);
        setVistaActual("dashboard");
    }

    if (!usuario) {
        return <LoginPage onLogin={iniciarSesion} />;
    }

    return (
        <div className="app-layout">
            <Sidebar vistaActual={vistaActual} cambiarVista={setVistaActual} />

            <div className="main-area">
                <Navbar
                    usuario={usuario}
                    titulo={vistaActual === "dashboard" ? "Panel principal" : "Gestión de Productos"}
                    cerrarSesion={cerrarSesion}
                />

                <main className="contenido">
                    {vistaActual === "dashboard" && <DashboardPage cambiarVista={setVistaActual} />}
                    {vistaActual === "productos" && <ProductsPage />}
                </main>
            </div>
        </div>
    );
}

export default App;