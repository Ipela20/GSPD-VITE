import React, { useState } from "react";
import "../styles/login.css";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../utiles/messages";

const SignIn = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    if (!email || !password) {
      setError(ERROR_MESSAGES.FILL_FIELDS);
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || ERROR_MESSAGES.LOGIN_FAIL);
      }

      localStorage.setItem("token", data.token);
      setSuccess(SUCCESS_MESSAGES.LOGIN_SUCCESS);

      await new Promise((resolve) => setTimeout(resolve, 800));
      navigate("/dashboard");
    } catch (err) {
      if (err.message === "Failed to fetch") {
        setError(ERROR_MESSAGES.FETCH_FAIL);
      } else {
        setError(err.message || ERROR_MESSAGES.DEFAULT);
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth">
      {/* Partie gauche */}
      <div className="auth-left">
        <div className="branding">
          <div className="logo-text-wrapper" tabIndex="-1">
          <img
          src="/images/ArmoiriesOK.png"
          alt="Logo Présidence du Faso"
          className="presidence-logo"
          tabIndex="-1"
          />
            <div className="presidence-text">PRÉSIDENCE DU FASO</div>
          </div>
          <h1 className="gspd">GSPD</h1>
          <p className="auth-message">
            Bienvenue sur<br />
            votre plateforme de<br />
            Gestion et Suivi des Dépenses
          </p>
        </div>
      </div>

      {/* Partie droite */}
      <div className="auth-right">
        <div className="form-container">
          <h4>Identifiez-vous</h4>

          {error && <p className="error-text">{error}</p>}
          {success && <p className="success-text">{success}</p>}

          <form onSubmit={handleSubmit}>
            {/* Champ Email */}
            <div className="input-icon-wrapper">
              <label htmlFor="email" className="sr-only">Email</label>
              <span className="input-icon">
                <Icon icon="mdi:email-outline" />
              </span>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                autoFocus
                required
              />
            </div>

            {/* Champ Mot de passe */}
            <div className="input-icon-wrapper">
              <label htmlFor="password" className="sr-only">Mot de passe</label>
              <span className="input-icon">
                <Icon icon="mdi:lock-outline" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Mot de passe"
                value={formData.password}
                onChange={handleChange}
                style={{ paddingLeft: "2.2rem", paddingRight: "2.5rem" }}
                required
              />
              <span className="toggle-eye" onClick={() => setShowPassword(!showPassword)}>
                <Icon icon={showPassword ? "mdi:eye-off" : "mdi:eye"} />
              </span>
            </div>

            {/* Lien mot de passe oublié */}
            <div className="forgot-password">
              <Link to="/mot-de-passe-oublie" className="forgot-link">
                Mot de passe oublié ?
              </Link>
            </div>

            {/* Bouton connexion */}
            <button type="submit"disabled={loading || !formData.email || !formData.password}>
              {loading ? (
                <>
                  <span className="loader"></span> Connexion en cours...
                </>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignIn;
