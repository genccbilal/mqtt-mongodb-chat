import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { userService } from "../services/api";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await userService.login(formData);
      localStorage.setItem("user", JSON.stringify(response.user));
      navigate("/select-user");
    } catch (error) {
      setError(error.message || "Giriş yapılırken bir hata oluştu");
    }
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <h2>Giriş Yap</h2>
        {error && <div className="message-box message-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Kullanıcı Adı:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Kullanıcı adınızı girin"
              autoComplete="username"
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
              autoComplete="current-password"
              placeholder="Şifrenizi girin"
            />
          </div>

          <button type="submit" className="btn btn-primary login-button">
            Giriş Yap
          </button>
        </form>

        <div className="register-link text-center">
          <p className="text-secondary mb-4">Hesabınız yok mu?</p>
          <Link to="/register" className="btn btn-primary register-button">
            Kayıt Ol
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
