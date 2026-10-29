import "./App.css";
import { useState } from "react";
import CarList from "./components/CarList";
import Auth from "./components/Auth";
import MyBookings from "./components/MyBookings";

function App() {
  const [token, setToken] = useState(
    localStorage.getItem("token") || ""
  );

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [showBookings, setShowBookings] = useState(false);

  const handleLogin = (newToken, newUser) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));

    setToken(newToken);
    setUser(newUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken("");
    setUser(null);
    setShowBookings(false);
  };

  /* =========================
     FIRST PAGE = LOGIN
  ========================= */

  if (!token) {
    return (
      <Auth
        onLogin={handleLogin}
      />
    );
  }

  /* =========================
     AFTER LOGIN = CAR WEBSITE
  ========================= */

  return (
    <main>
      <header className="site-header">
        <h1>Car Rental System</h1>

        <p>Find the right car for your next journey.</p>

        <div className="nav-buttons">
          <button
            type="button"
            onClick={() => {
              setShowBookings(false);
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
          >
            Browse Cars
          </button>

          <button
            type="button"
            onClick={() => setShowBookings(true)}
          >
            My Bookings
          </button>

          <span className="welcome-user">
            Welcome, {user?.name || "User"}
          </span>

          <button
            type="button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      {showBookings ? (
        <MyBookings
          token={token}
          onBack={() => setShowBookings(false)}
        />
      ) : (
        <CarList token={token} />
      )}
    </main>
  );
}

export default App;