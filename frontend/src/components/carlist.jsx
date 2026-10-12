
import { useEffect, useState } from "react";
import axios from "axios";
import Auth from "./Auth";
import BookingForm from "./BookingForm";

const API_URL = "http://localhost:5000/api/cars";

export default function CarList() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCar, setSelectedCar] = useState(null);
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || ""
  );
  const [showAuth, setShowAuth] = useState(false);

  // Load cars from the backend
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get(API_URL);
        setCars(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load cars. Check the backend and database connection."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  // Loading state
  if (loading) {
    return <p>Loading cars...</p>;
  }

  // Error state
  if (error) {
    return <p role="alert">{error}</p>;
  }

  // Empty state
  if (cars.length === 0) {
    return <p>No cars available yet. Add a car to get started.</p>;
  }

  // Handle Book Now
  const handleBookNow = (car) => {
    console.log("BOOK BUTTON CLICKED");

    const savedToken = localStorage.getItem("token") || "";
    console.log("Saved token exists:", Boolean(savedToken));

    setToken(savedToken);

    if (!savedToken) {
      console.log("Opening authentication popup");
      setSelectedCar(null);
      setShowAuth(true);
    } else {
      console.log("Opening booking form");
      setShowAuth(false);
      setSelectedCar(car);
    }
  };

  // Handle successful login
  const handleLogin = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setShowAuth(false);
    setSelectedCar(null);
  };

  return (
    <section className="car-list">
      <h2>Available Cars</h2>

      <div className="car-grid">
        {cars.map((car) => (
          <article className="car-card" key={car._id}>
            {car.image && (
              <img
                src={car.image}
                alt={`${car.brand} ${car.model}`}
                className="car-image"
              />
            )}

            <div className="car-info">
              <h3>{car.name}</h3>

              <p>
                {car.brand} {car.model} · {car.year}
              </p>

              <p>
                {car.seats} seats · {car.transmission}
              </p>

              <p>{car.fuelType}</p>

              <p className="car-price">
                ₹{car.pricePerDay} <span>/ day</span>
              </p>

              <button
                type="button"
                onClick={() => handleBookNow(car)}
              >
                Book Now
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Login and registration popup */}
      {showAuth && (
        <Auth
          onLogin={handleLogin}
          onClose={() => setShowAuth(false)}
        />
      )}

      {/* Booking form */}
      {selectedCar && (
        <BookingForm
          car={selectedCar}
          token={token}
          onClose={() => setSelectedCar(null)}
        />
      )}
    </section>
  );
}
