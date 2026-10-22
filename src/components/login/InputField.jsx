import "../../css/InputField.css";

const iconos = {
    mail: <path d="M2 5.5l8 5.5 8-5.5M3.5 4h13A1.5 1.5 0 0118 5.5v9a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 012 14.5v-9A1.5 1.5 0 013.5 4z" />,
    lock: <path d="M6 9V6.5a4 4 0 118 0V9M5.5 9h9a1.5 1.5 0 011.5 1.5v5a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 014 15.5v-5A1.5 1.5 0 015.5 9z" />,
};

export default function InputField({ label, type = "text", icon, placeholder, value, onChange }) {
    return (
        <label className="input-field">
            <span className="input-label">{label}</span>
            <span className="input-caja">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#667085"
                    strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round">
                    {iconos[icon]}
                </svg>
                <input type={type} placeholder={placeholder} value={value} onChange={onChange} />
            </span>
        </label>
    );
}
