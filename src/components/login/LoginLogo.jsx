import imgLogo from "../../assets/images/img_logo.png";

export default function LoginLogo() {
    return (
        <div className="login-logo">
            <img src={imgLogo} alt="Logo Clínica Dental" />
            <p>Clinica Dental</p>
        </div>
    );
}
