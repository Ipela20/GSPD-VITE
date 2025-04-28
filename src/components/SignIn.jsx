import React, { useState } from "react";
import "../styles/login.css";
import { Link, useNavigate } from "react-router-dom"; // ✅ useNavigate au lieu de window.location
import { Icon } from "@iconify/react";
import LogoSVG from "./LogoSVG"; //Composant logo SVG
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../utiles/messages";


const SignIn = () => {
  // États pour les champs, erreurs et loading
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState("");

  const navigate = useNavigate(); // pour la redirection SPA

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
  
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
          "Accept": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
    
      const data = await response.json();
    
      if (!response.ok) {
        throw new Error(data.message || ERROR_MESSAGES.LOGIN_FAIL);
      }
    
      localStorage.setItem("token", data.token);
      setSuccess(SUCCESS_MESSAGES.LOGIN_SUCCESS);
    
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      if (err.message === "Failed to fetch") {
        setError(ERROR_MESSAGES.FETCH_FAIL);
      } else {
        setError(err.message || ERROR_MESSAGES.DEFAULT);
      }
      console.error(err);
    }
     finally {
      setLoading(false);
    }
  };  

  return (
    <section className="auth">
      {/*Branding côté gauche */}
      <div className="auth-left">
        <div className="branding">
          <h1 className="gspd">GSPD</h1>
          <div className="yellow-line"></div>
          <p className="subtitle">
            Bienvenue sur votre Plateforme de Gestion <br />
            et Suivi des Dépenses
          </p>
          <LogoSVG />
        </div>
      </div>

      {/*Formulaire côté droit */}
      <div className="auth-right">
        <div className="form-container">
          <h4>Identifiez-vous</h4>

      {/*Messages d’erreur ou succès */}
          {error && <p className="error-text">{error}</p>}
          {success && <p className="success-text">{success}</p>}

          <form onSubmit={handleSubmit}>
            {/*Champ Email avec icône */}
            <div className="input-icon-wrapper">
              <span className="input-icon">
                <Icon icon="mdi:email-outline" />
              </span>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                required
              />
            </div>

            {/* Champ Mot de passe avec œil */}
            <div className="input-icon-wrapper">
              <span className="input-icon">
                <Icon icon="mdi:lock-outline" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: "2.2rem", paddingRight: "2.5rem" }}
                required
              />
              <span className="toggle-eye" onClick={() => setShowPassword(!showPassword)}>
                <Icon icon={showPassword ? "mdi:eye-off" : "mdi:eye"} />
              </span>
            </div>

            {/*Mot de passe oublié */}
            <div className="forgot-password">
              <Link to="/mot-de-passe-oublie" className="forgot-link">
                Mot de passe oublié ?
              </Link>
            </div>

            {/* Bouton avec loader */}
            <button type="submit" disabled={loading}>
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
