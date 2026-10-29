
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import BookingForm from "./BookingForm";

const API_URL = "http://localhost:5000/api/cars";

export default function CarList({ token }) {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCar, setSelectedCar] = useState(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [transmission, setTransmission] = useState("All");
  const [fuelType, setFuelType] = useState("All");
  const [maxPrice, setMaxPrice] = useState(10000);
  const [sort, setSort] = useState("recommended");

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(API_URL);
        const data = response.data;

        setCars(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load cars:", err);

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

  const filteredCars = useMemo(() => {
    let result = cars.filter((car) => {
      const text = [
        car.name,
        car.brand,
        car.model,
        car.category,
        car.fuelType,
        car.transmission,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        text.includes(search.toLowerCase().trim()) &&
        (category === "All" || car.category === category) &&
        (transmission === "All" ||
          car.transmission === transmission) &&
        (fuelType === "All" || car.fuelType === fuelType) &&
        Number(car.pricePerDay || 0) <= maxPrice
      );
    });

    if (sort === "price-low") {
      result.sort(
        (a, b) => a.pricePerDay - b.pricePerDay
      );
    } else if (sort === "price-high") {
      result.sort(
        (a, b) => b.pricePerDay - a.pricePerDay
      );
    }

    return result;
  }, [
    cars,
    search,
    category,
    transmission,
    fuelType,
    maxPrice,
    sort,
  ]);

  const resetFilters = () => {
    setSearch("");
    setCategory("All");
    setTransmission("All");
    setFuelType("All");
    setMaxPrice(10000);
    setSort("recommended");
  };

  const handleBookNow = (car) => {
    if (!token) {
      alert("Please log in before booking a car.");
      return;
    }

    setSelectedCar(car);
  };

  return (
    <section className="rental-dashboard">
      <aside className="rental-filters">
        <div className="filter-heading">
          <div>
            <span className="filter-eyebrow">DISCOVER</span>
            <h2>Filter cars</h2>
          </div>

          <button
            type="button"
            className="reset-filters"
            onClick={resetFilters}
          >
            Reset
          </button>
        </div>

        <label className="filter-label" htmlFor="car-search">
          Search vehicles
        </label>

        <input
          id="car-search"
          className="filter-input"
          type="search"
          placeholder="Brand or model..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="filter-divider" />

        <label className="filter-label" htmlFor="car-category">
          Vehicle category
        </label>

        <select
          id="car-category"
          className="filter-input"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="All">All categories</option>
          <option value="Hatchback">Hatchback</option>
          <option value="Sedan">Sedan</option>
          <option value="SUV">SUV</option>
          <option value="Luxury">Luxury</option>
          <option value="Electric">Electric</option>
        </select>

        <div className="filter-divider" />

        <div className="filter-label">
          Maximum price per day
        </div>

        <div className="price-range-value">
          <span>₹0</span>
          <strong>
            ₹{Number(maxPrice).toLocaleString("en-IN")}
          </strong>
        </div>

        <input
          className="price-slider"
          type="range"
          min="500"
          max="10000"
          step="500"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          aria-label="Maximum price per day"
        />

        <div className="filter-divider" />

        <label className="filter-label" htmlFor="car-transmission">
          Transmission
        </label>

        <select
          id="car-transmission"
          className="filter-input"
          value={transmission}
          onChange={(e) => setTransmission(e.target.value)}
        >
          <option value="All">Any transmission</option>
          <option value="Manual">Manual</option>
          <option value="Automatic">Automatic</option>
        </select>

        <div className="filter-divider" />

        <label className="filter-label" htmlFor="car-fuel">
          Fuel type
        </label>

        <select
          id="car-fuel"
          className="filter-input"
          value={fuelType}
          onChange={(e) => setFuelType(e.target.value)}
        >
          <option value="All">Any fuel type</option>
          <option value="Petrol">Petrol</option>
          <option value="Diesel">Diesel</option>
          <option value="Electric">Electric</option>
          <option value="Hybrid">Hybrid</option>
          <option value="CNG">CNG</option>
        </select>

        <div className="filter-note">
          <span>✓</span>
          <p>Compare available vehicles and choose the right ride for your journey.</p>
        </div>
      </aside>

      <div className="rental-results">
        <div className="results-toolbar">
          <div>
            <span className="filter-eyebrow">
              YOUR NEXT JOURNEY
            </span>

            <h2>Find your perfect car</h2>

            <p>
              {loading
                ? "Finding vehicles..."
                : `${filteredCars.length} ${
                    filteredCars.length === 1
                      ? "vehicle"
                      : "vehicles"
                  } found`}
            </p>
          </div>

          <label className="sort-control">
            <span>Sort by</span>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sort vehicles"
            >
              <option value="recommended">Recommended</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
            </select>
          </label>
        </div>

        {loading ? (
          <div className="rental-state">
            <div className="loading-spinner" />
            <h3>Finding your next ride</h3>
            <p>Loading vehicles from our collection...</p>
          </div>
        ) : error ? (
          <div className="rental-state rental-error" role="alert">
            <h3>Unable to load vehicles</h3>
            <p>{error}</p>
            <button
              type="button"
              className="rental-primary-button"
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          </div>
        ) : filteredCars.length === 0 ? (
          <div className="rental-state">
            <div className="empty-car-icon">⌕</div>
            <h3>No matching cars found</h3>
            <p>Try changing your filters or search terms.</p>
            <button
              type="button"
              className="rental-primary-button"
              onClick={resetFilters}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="rental-car-grid">
            {filteredCars.map((car) => (
              <article className="rental-car-card" key={car._id}>
                <div className="rental-car-image">
                  {car.image ? (
                    <img
                      src={car.image}
                      alt={`${car.brand || ""} ${car.model || car.name}`}
                    />
                  ) : (
                    <div className="car-image-placeholder">
                      <span>🚘</span>
                      <small>Vehicle photo unavailable</small>
                    </div>
                  )}

                  <span className="availability-tag">
                    <span className="availability-dot" />
                    Listed vehicle
                  </span>
                </div>

                <div className="rental-car-content">
                  <div className="rental-car-title">
                    <div>
                      <h3>{car.name}</h3>
                      <p>
                        {[car.brand, car.model, car.year]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>
                  </div>

                  <div className="rental-car-specs">
                    {car.category && (
                      <span>▦ {car.category}</span>
                    )}

                    {car.transmission && (
                      <span>⚙ {car.transmission}</span>
                    )}

                    {car.fuelType && (
                      <span>⛽ {car.fuelType}</span>
                    )}

                    {car.seats && (
                      <span>♙ {car.seats} seats</span>
                    )}
                  </div>

                  <div className="rental-car-bottom">
                    <div className="rental-price">
                      <strong>
                        ₹
                        {Number(car.pricePerDay).toLocaleString(
                          "en-IN"
                        )}
                      </strong>
                      <span>/ day</span>
                    </div>

                    <button
                      type="button"
                      className="rental-primary-button"
                      onClick={() => handleBookNow(car)}
                    >
                      View & book <span>→</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

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
