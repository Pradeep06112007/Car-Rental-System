
import { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000";

export default function BookingForm({ car, token, onClose }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const today = new Date().toLocaleDateString("en-CA");

  const submitBooking = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!token) {
      setMessage("Please log in before booking a car.");
      return;
    }

    if (!startDate || !endDate || endDate <= startDate) {
      setMessage("Choose a return date after the pick-up date.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/bookings",
        {
          carId: car._id,
          startDate: startDate,
          endDate: endDate,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      console.log("Booking API response:", response.data);

      const booking = response.data?.booking;
      const totalAmount = booking?.totalAmount;

      console.log("Full booking response:", response.data);
      console.log("Extracted total amount:", totalAmount);

      if (response.status === 201 && booking) {
        setBookingSuccess(true);

        if (totalAmount !== undefined && totalAmount !== null) {
          setMessage(
            "Booking created successfully! Total: ₹" +
              Number(totalAmount).toLocaleString("en-IN")
          );
        } else {
          setMessage(
            "Booking created successfully, but the total amount is missing from the server response."
          );
        }
      } else {
        setMessage("The server response could not be verified.");
      }
    } catch (error) {
      console.error(
        "Booking error:",
        error.response?.data || error.message
      );

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
      <form className="booking-form" onSubmit={submitBooking}>
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
          {Number(car.pricePerDay).toLocaleString("en-IN")} per day
        </p>

        <label htmlFor="startDate">Pick-up date</label>
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

            if (endDate && value && endDate <= value) {
              setEndDate("");
            }
          }}
          required
        />

        <label htmlFor="endDate">Return date</label>
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
            style={{
              color: bookingSuccess ? "green" : "inherit",
              overflowWrap: "anywhere",
            }}
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