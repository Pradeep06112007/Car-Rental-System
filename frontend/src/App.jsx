
import { useState } from "react";
import CarList from "./components/CarList";
import MyBookings from "./components/MyBookings";

function App() {
  const [showBookings, setShowBookings] = useState(false);

  return (
    <main>
      <header>
        <h1>Car Rental System</h1>
        <p>Find the right car for your next journey.</p>

        <nav style={{ margin: "20px 0" }}>
          <button
            type="button"
            onClick={() => setShowBookings(false)}
            style={{
              padding: "10px 18px",
              marginRight: "10px",
              cursor: "pointer",
            }}
          >
            Browse Cars
          </button>

          <button
            type="button"
            onClick={() => setShowBookings(true)}
            style={{
              padding: "10px 18px",
              cursor: "pointer",
            }}
          >
            My Bookings
          </button>
        </nav>
      </header>

      {showBookings ? <MyBookings /> : <CarList />}
    </main>
  );
}

export default App;
