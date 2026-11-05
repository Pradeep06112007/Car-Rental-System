
import { useState } from "react";
import axios from "axios";

// Backend API configuration
const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const API_URL = `${API_BASE_URL}/api/bookings`;

// Get today's local date in YYYY-MM-DD format
const getTodayDate = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export default function BookingForm({ car, token, onClose }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const today = getTodayDate();

  const submitBooking = async (event) => {
    event.preventDefault();

    setMessage("");

    // Check login
    if (!token) {
      setMessage("Please log in before booking a car.");
      return;
    }

    // Check dates
    if (!startDate || !endDate) {
      setMessage("Please select both dates.");
      return;
    }

    if (startDate < today) {
      setMessage("Pick-up date cannot be in the past.");
      return;
    }

    if (endDate <= startDate) {
      setMessage(
        "Return date must be after the pick-up date."
      );
      return;
    }

    setSubmitting(true);

    try {
      const response = await axios.post(
        API_URL,
        {
          carId: car._id,
          startDate,
          endDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Booking response:", response.data);

      const booking = response.data?.booking;

      if (!booking) {
        setMessage(
          "Booking was created, but the server response is invalid."
        );
        return;
      }

      const totalAmount = Number(booking.totalAmount);

      setBookingSuccess(true);

      setMessage(
        `Booking created successfully! Total: ₹${totalAmount.toLocaleString(
          "en-IN"
        )}`
      );

    } catch (error) {
      console.error(
        "Booking error:",
        error.response?.data || error.message
      );

      // Handle expired login session
      if (error.response?.status === 401) {
        setMessage(
          "Your login session has expired. Please login again."
        );

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Refresh app state so the login page appears again
        setTimeout(() => {
          window.location.reload();
        }, 1500);

        return;
      }

      // Handle unavailable booking dates
      if (error.response?.status === 409) {
        setMessage(
          "This car is already booked for the selected dates. Please choose different dates."
        );
        return;
      }

      setMessage(
        error.response?.data?.message ||
          "Booking failed. Please try again."
      );

    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="booking-overlay">
      <form
        className="booking-form"
        onSubmit={submitBooking}
      >
        <button
          type="button"
          className="booking-close"
          onClick={onClose}
        >
          Close
        </button>

        <h2>Book {car.name}</h2>

        <p>
          Rental price: ₹
          {Number(car.pricePerDay).toLocaleString("en-IN")}
          {" "}per day
        </p>

        <label htmlFor="startDate">
          Pick-up date
        </label>

        <input
          id="startDate"
          type="date"
          min={today}
          value={startDate}
          onChange={(event) => {
            const value = event.target.value;

            setStartDate(value);
            setMessage("");
            setBookingSuccess(false);

            if (endDate && endDate <= value) {
              setEndDate("");
            }
          }}
          required
        />

        <label htmlFor="endDate">
          Return date
        </label>

        <input
          id="endDate"
          type="date"
          min={startDate || today}
          value={endDate}
          onChange={(event) => {
            setEndDate(event.target.value);
            setMessage("");
            setBookingSuccess(false);
          }}
          required
        />

        {message && (
          <p
            role="status"
            aria-live="polite"
            className={
              bookingSuccess
                ? "booking-success"
                : "booking-error"
            }
          >
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting || bookingSuccess}
        >
          {submitting
            ? "Booking..."
            : bookingSuccess
            ? "Booking Confirmed"
            : "Confirm Booking"}
        </button>
      </form>
    </div>
  );
}
