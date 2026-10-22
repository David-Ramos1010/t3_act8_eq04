import "../../css/RememberForgot.css";

export default function RememberForgot({ checked, onChange }) {
    return (
        <div className="remember-forgot">
            <label className="remember">
                <input type="checkbox" checked={checked} onChange={onChange} />
                <span>Recuérdame</span>
            </label>
            <button type="button" className="link-btn">¿olvidaste tu contraseña?</button>
        </div>
    );
}
