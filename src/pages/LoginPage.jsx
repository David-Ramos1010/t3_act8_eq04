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
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [recordarme, setRecordarme] = useState(false);
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);

    async function manejarSubmit(e) {
        e.preventDefault();

        if (!username.trim() || !password.trim()) {
            setError("Completa todos los campos");
            return;
        }

        setError("");
        setCargando(true);

        try {
            const res = await fetch("https://dummyjson.com/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: username.trim(),
                    password,
                    expiresInMins: 60,
                }),
            });
            const data = await res.json();

            if (!res.ok || !data.accessToken) {
                setError(data.message || "Usuario o contraseña incorrectos");
                return;
            }

            onLogin({
                nombre: data.firstName,
                username: data.username,
                token: data.accessToken,
                recordarme,
            });
        } catch {
            setError("Error de conexión. Intenta de nuevo.");
        } finally {
            setCargando(false);
        }
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
                            label="Nombre de usuario"
                            type="text"
                            icon="user"
                            placeholder="jamesd"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <InputField
                            label="Contraseña"
                            type="password"
                            icon="lock"
                            placeholder="jamesdpass"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <RememberForgot
                        checked={recordarme}
                        onChange={(e) => setRecordarme(e.target.checked)}
                    />

                    {error && <p className="login-error">{error}</p>}

                    <Button type="submit" disabled={cargando}>
                        {cargando ? "Entrando..." : "Iniciar sesión"}
                    </Button>

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