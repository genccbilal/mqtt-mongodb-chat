import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { userService } from "../services/api";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await userService.createUser(formData);
      setSuccess("Kayıt başarılı! Sohbet sayfasına yönlendiriliyorsunuz...");

      const loginResponse = await userService.login(formData);
      localStorage.setItem("user", JSON.stringify(loginResponse.user));

      setTimeout(() => {
        navigate("/select-user");
      }, 2000);
    } catch (error) {
      setError(error.message || "Kayıt olurken bir hata oluştu");
    }
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <h2>Kayıt Ol</h2>
        {error && <div className="message-box message-error">{error}</div>}
        {success && (
          <div className="message-box message-success">{success}</div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="username">Kullanıcı Adı:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              minLength="3"
              placeholder="En az 3 karakter"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Şifre:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Şifrenizi girin"
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="btn btn-primary register-button">
            Kayıt Ol
          </button>
        </form>

        <div className="login-link text-center">
          <p className="text-secondary mb-4">Zaten hesabınız var mı?</p>
          <Link to="/" className="btn btn-primary login-button">
            Giriş Yap
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
