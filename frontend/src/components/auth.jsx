
import { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export default function Auth({ onLogin, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const endpoint = isLogin ? "/login" : "/register";

      const payload = isLogin
        ? { email, password }
        : { name, email, password, phone };

      const response = await axios.post(`${API_URL}${endpoint}`, payload);

      if (isLogin) {
        const { token, user } = response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        setMessage("Login successful!");

        if (onLogin) {
          onLogin(token, user);
        }
      } else {
        setMessage("Registration successful! You can now log in.");
        setIsLogin(true);
        setPassword("");
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Authentication failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-overlay">
      <form className="booking-form" onSubmit={handleSubmit}>
        {onClose && (
          <button
            type="button"
            className="booking-close"
            onClick={onClose}
          >
            Close
          </button>
        )}

        <h2>{isLogin ? "Login" : "Create Account"}</h2>

        <p>
          {isLogin
            ? "Log in to book your favourite car."
            : "Register to start renting cars."}
        </p>

        {!isLogin && (
          <>
            <label htmlFor="auth-name">Full name</label>
            <input
              id="auth-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />

            <label htmlFor="auth-phone">Phone number (optional)</label>
            <input
              id="auth-phone"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          </>
        )}

        <label htmlFor="auth-email">Email</label>
        <input
          id="auth-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label htmlFor="auth-password">Password</label>
        <input
          id="auth-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          minLength={8}
          required
        />

        {message && <p role="status">{message}</p>}

        <button type="submit" disabled={loading}>
          {loading
            ? "Please wait..."
            : isLogin
              ? "Login"
              : "Register"}
        </button>

        <button
          type="button"
          onClick={() => {
            setIsLogin(!isLogin);
            setMessage("");
          }}
        >
          {isLogin
            ? "Need an account? Register"
            : "Already registered? Login"}
        </button>
      </form>
    </div>
  );
}
