
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBookings() {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please log in to view your bookings.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          API_URL + "/api/bookings/my",
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );

        const data = response.data;
        const bookingList = Array.isArray(data)
          ? data
          : Array.isArray(data.bookings)
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
    }

    fetchBookings();
  }, []);

  function formatDate(date) {
    if (!date) return "Not available";

    return new Date(date).toLocaleDateString("en-IN", {
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
      </section>
    );
  }

  return (
    <section className="my-bookings">
      <h2>My Bookings</h2>

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
                  Total amount: {formatAmount(booking.totalAmount)}
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
