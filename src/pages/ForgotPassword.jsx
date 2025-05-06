import React, { useState } from "react";
import "../styles/login.css";
import "../styles/forgot-password.css";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../utiles/messages";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError(ERROR_MESSAGES.FILL_FIELDS);
      return;
    } 

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || ERROR_MESSAGES.UNKNOWN);
      } else {
        setMessage(SUCCESS_MESSAGES.PASSWORD_RESET_SENT);
      }
    } catch (err) {
      if (err.message === "Failed to fetch") {
        setError(ERROR_MESSAGES.FETCH_FAIL);
      } else {
        setError(ERROR_MESSAGES.UNKNOWN);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth">
      {/* Branding à gauche */}
      <div className="auth-left">
        <div className="branding">
          <div className="logo-text-wrapper" tabIndex="-1">
          <img
          src="/images/armoirie.png"
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

      {/* Formulaire à droite */}
      <div className="auth-right">
        <div className="form-container">
          <h4>Mot de passe oublié</h4>
          <p style={{ marginBottom: "1rem", fontSize: "1rem", color: "#555" }}>
            Un lien de réinitialisation vous sera envoyé si un compte est associé à cette adresse.
          </p>

          {error && <p className="error-text">{error}</p>}
          {message && <p className="success-text">{message}</p>}

          <form onSubmit={handleSubmit}>
            <div className="input-icon-wrapper">
              <label htmlFor="email" className="sr-only">Email</label>
              <span className="input-icon">
                <Icon icon="mdi:email-outline" />
              </span>
              <input
                type="email"
                id="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="reset-btn"
                disabled={loading || email === ""}
              >
                {loading ? (
                  <>
                    <span className="loader"></span> Envoi en cours...
                  </>
                ) : (
                  "Réinitialiser le mot de passe"
                )}
              </button>

              <span className="signin-text">
                ou <Link to="/" className="signin-link">Se connecter</Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
