
import { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export default function Auth({ onLogin }) {
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

      const response = await axios.post(
        `${API_URL}${endpoint}`,
        payload
      );

      if (isLogin) {
        const { token, user } = response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        onLogin(token, user);
      } else {
        setMessage(
          "Registration successful! Please login."
        );

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
    <div className="login-page">
      {/* LEFT SIDE: DODGE CHALLENGER HERO */}

      <section className="login-left">
        <div
          className="login-hero-background"
          aria-hidden="true"
        >
          <img
            src="/dodge-challenger.png"
            alt=""
            className="login-dodge-image"
          />
        </div>

        <div className="login-left-content">
          <div className="login-logo">
            CarRental<span>■</span>
          </div>

          <div className="login-small-title">
            YOUR JOURNEY STARTS HERE
          </div>

          <h1 className="login-main-title">
            Find the right car
            <br />
            for your next journey.
          </h1>

          <p className="login-description">
            Book reliable cars quickly and easily.
            Manage your bookings from one place.
          </p>

          <div className="login-steps">
            <div className="login-step">
              <strong>01</strong>
              Choose your car
            </div>

            <div className="login-step">
              <strong>02</strong>
              Select your dates
            </div>

            <div className="login-step">
              <strong>03</strong>
              Start your journey
            </div>
          </div>
        </div>
      </section>

      {/* RIGHT SIDE: LOGIN AND REGISTRATION */}

      <section className="login-right">
        <form
          className="login-card"
          onSubmit={handleSubmit}
        >
          <h2>
            {isLogin
              ? "Sign in to your account"
              : "Create your account"}
          </h2>

          <p className="login-card-description">
            {isLogin
              ? "Log in to continue booking your favourite car."
              : "Create an account to start renting cars."}
          </p>

          {!isLogin && (
            <>
              <div className="login-field">
                <label htmlFor="name">
                  Full name
                </label>

                <input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  autoComplete="name"
                  required
                />
              </div>

              <div className="login-field">
                <label htmlFor="phone">
                  Phone number
                </label>

                <input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  autoComplete="tel"
                />
              </div>
            </>
          )}

          <div className="login-field">
            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              autoComplete="email"
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              autoComplete={
                isLogin
                  ? "current-password"
                  : "new-password"
              }
              minLength={8}
              required
            />
          </div>

          {message && (
            <p
              className="login-message"
              role="status"
              aria-live="polite"
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isLogin
              ? "Sign in →"
              : "Create account →"}
          </button>

          <div className="login-divider">
            OR
          </div>

          <button
            type="button"
            className="register-button"
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage("");
            }}
          >
            {isLogin
              ? "Create a free account"
              : "Already have an account? Sign in"}
          </button>

          <p className="login-terms">
            By continuing, you agree to our
            terms and privacy policy.
          </p>
        </form>
      </section>
    </div>
  );
}
