import { useState } from "react";
import "../css/LoginPage.css";
import imgConsultorio from "../assets/images/img_consultorio.png";
import LoginLogo from "../components/login/LoginLogo";
import WelcomeMessage from "../components/login/WelcomeMessage";
import InputField from "../components/login/InputField";
import RememberForgot from "../components/login/RememberForgot";
import Button from "../components/login/Button";
import Divider from "../components/login/Divider";
import SocialButton from "../components/login/SocialButton";
import RegisterLink from "../components/login/RegisterLink";

function LoginPage({ onLogin }) {
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [recordarme, setRecordarme] = useState(false);
    const [error, setError] = useState("");

    function manejarSubmit(e) {
        e.preventDefault();
        if (!correo.trim() || !password.trim()) {
            setError("Completa todos los campos");
            return;
        }
        setError("");
        onLogin({ nombre: correo.split("@")[0], correo, recordarme });
    }

    return (
        <div className="login-page">
            <div className="login-imagen">
                <img src={imgConsultorio} alt="Consultorio dental" />
            </div>

            <div className="login-derecha">
                <form className="login-form" onSubmit={manejarSubmit}>
                    <div className="login-superior">
                        <LoginLogo />
                        <WelcomeMessage />
                    </div>

                    <div className="login-campos">
                        <InputField
                            label="Correo electrónico"
                            type="email"
                            icon="mail"
                            placeholder="ejemplo@gmail.com"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                        />
                        <InputField
                            label="Contraseña"
                            type="password"
                            icon="lock"
                            placeholder="● ● ● ● ● ●"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <RememberForgot
                        checked={recordarme}
                        onChange={(e) => setRecordarme(e.target.checked)}
                    />

                    {error && <p className="login-error">{error}</p>}

                    <Button type="submit">Iniciar sesión</Button>

                    <Divider />

                    <div className="login-sociales">
                        <SocialButton platform="google" />
                        <SocialButton platform="facebook" />
                    </div>

                    <RegisterLink />
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
