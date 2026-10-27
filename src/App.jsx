import { useState } from "react";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage"; // Se importa la página de productos
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

function App() {
    const [usuario, setUsuario] = useState(null);
    const [vistaActual, setVistaActual] = useState("citas"); // Vista inicial 

    function iniciarSesion(datosUsuario) {
        setUsuario(datosUsuario);
        setVistaActual("citas");
    }

    function cerrarSesion() {
        setUsuario(null);
        setVistaActual("citas");
    }

    // Si no ha iniciado sesión, muestra el Login
    if (!usuario) {
        return <LoginPage onLogin={iniciarSesion} />;
    }

    return (
        <div className="app-layout">
            <Sidebar 
                vistaActual={vistaActual} 
                cambiarVista={setVistaActual} 
                cerrarSesion={cerrarSesion} 
            />

            <div className="main-area">
                <Navbar
                    usuario={usuario}
                    titulo={vistaActual === "productos" ? "Gestión de Insumos y Productos" : "Gestión de Citas Odontológicas"}
                />

                <main className="contenido">
                    {vistaActual === "citas" && <DashboardPage cambiarVista={setVistaActual} />}
                    {vistaActual === "productos" && <ProductsPage />}
                </main>
            </div>
        </div>
    );
}

export default App;