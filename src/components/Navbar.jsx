import React from 'react';
import './Navbar.css';

export default function Navbar({ usuario, titulo }) {
    const nombreMostrar = usuario?.firstName && usuario?.lastName 
        ? `${usuario.firstName} ${usuario.lastName}` 
        : (usuario?.nombre || usuario?.username || "Nombre_Apellido");

    return (
        <header className="navbar-container">
            <h1 className="navbar-title">{titulo}</h1>

            <div className="navbar-user">
                <div className="user-text">
                    <span className="user-name">Doctora {nombreMostrar}</span>
                    <span className="user-role">Administradora</span>
                </div>
                <img 
                    src={usuario?.image || "https://dummyjson.com/icon/emilys/128"} 
                    alt="Foto de Perfil" 
                    className="user-avatar"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/40"; }}
                />
            </div>
        </header>
    );
}