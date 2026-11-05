
import { useEffect, useState } from "react";
import axios from "axios";

// Backend API configuration
const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const API_URL = `${API_BASE_URL}/api/bookings/my`;

export default function MyBookings({ token, onBack }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBookings = async () => {
    if (!token) {
      setError("Please log in to view your bookings.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;

      const bookingList = Array.isArray(data)
        ? data
        : Array.isArray(data?.bookings)
        ? data.bookings
        : [];

      setBookings(bookingList);

    } catch (err) {
      console.error(
        "Fetch bookings error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Unable to load bookings. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [token]);

  function formatDate(date) {
    if (!date) return "Not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not available";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function formatAmount(amount) {
    if (amount === undefined || amount === null) {
      return "Not available";
    }

    return (
      "₹" + Number(amount).toLocaleString("en-IN")
    );
  }

  if (loading) {
    return (
      <section className="my-bookings">
        <h2>My Bookings</h2>
        <p>Loading your bookings...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="my-bookings">
        <h2>My Bookings</h2>

        <p role="alert">{error}</p>

        <button type="button" onClick={fetchBookings}>
          Try Again
        </button>

        {onBack && (
          <button type="button" onClick={onBack}>
            Back to Cars
          </button>
        )}
      </section>
    );
  }

  return (
    <section className="my-bookings">
      <h2>My Bookings</h2>

      {onBack && (
        <button type="button" onClick={onBack}>
          ← Back to Cars
        </button>
      )}

      {bookings.length === 0 ? (
        <p>You haven't booked any cars yet.</p>
      ) : (
        <div className="my-bookings-list">
          {bookings.map((booking) => {
            const car =
              booking.car &&
              typeof booking.car === "object"
                ? booking.car
                : null;

            return (
              <article
                className="my-booking-card"
                key={booking._id}
              >
                <h3>{car?.name || "Car booking"}</h3>

                {car?.brand && (
                  <p>Brand: {car.brand}</p>
                )}

                <p>
                  Pick-up: {formatDate(booking.startDate)}
                </p>

                <p>
                  Return: {formatDate(booking.endDate)}
                </p>

                <p>
                  Total amount:{" "}
                  {formatAmount(booking.totalAmount)}
                </p>

                <p>
                  Booking status:{" "}
                  <strong>
                    {booking.bookingStatus || "Pending"}
                  </strong>
                </p>

                <p>
                  Payment status:{" "}
                  <strong>
                    {booking.paymentStatus || "Pending"}
                  </strong>
                </p>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
