import "../../css/Button.css";

export default function Button({ children, type = "button", onClick }) {
    return (
        <button type={type} className="btn-primario" onClick={onClick}>
            {children}
        </button>
    );
}
