import "../../css/Button.css";

export default function Button({ children, type = "button", onClick, disabled }) {
    return (
        <button type={type} className="btn-primario" onClick={onClick} disabled={disabled}>
            {children}
        </button>
    );
}
