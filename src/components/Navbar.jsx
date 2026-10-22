export default function Navbar({ titulo, cerrarSesion }) {
    return (
        <header>
            <span>{titulo}</span>
            <button onClick={cerrarSesion}>Cerrar sesión</button>
        </header>
    );
}