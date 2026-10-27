import React from 'react';
import './Sidebar.css';
import imgLogo from '../assets/images/img_logo.png';

export default function Sidebar({ vistaActual, cambiarVista, cerrarSesion }) {
    const menuItems = [
        { id: 'citas', label: 'Citas' },
        { id: 'productos', label: 'Productos (CRUD)' },
        { id: 'pacientes', label: 'Pacientes' },
        { id: 'odontologos', label: 'Odontologos' },
        { id: 'tratamientos', label: 'Tratamientos' }
    ];

    return (
        <aside className="sidebar-container">
            <div className="sidebar-brand">
                <span className="brand-title">Clinica Dental</span>
                <img src={imgLogo} alt="Logo Clínica Dental" className="brand-logo-img" />
            </div>

            <nav className="sidebar-menu">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        className={`sidebar-btn ${vistaActual === item.id ? 'active' : ''}`}
                        onClick={() => cambiarVista(item.id)}
                    >
                        {item.label}
                    </button>
                ))}
            </nav>

            <div className="sidebar-bottom">
                <button className="sidebar-logout" onClick={cerrarSesion}>
                    Cerrar Sesión
                </button>
            </div>
        </aside>
    );
}