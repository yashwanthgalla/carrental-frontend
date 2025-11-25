import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PaymentPage.css";

const PaymentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { car, selectedPlan, price, tripDetails } = state || {};
  const [paymentMode, setPaymentMode] = useState("card");
  const [showSuccess, setShowSuccess] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [upiId, setUpiId] = useState("");
  const [processing, setProcessing] = useState(false);

  if (!car) {
    return <p style={{ textAlign: "center", marginTop: "50px" }}>
      No car selected. Please go back and try again.
    </p>;
  }

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted;
  };

  const formatExpiryDate = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\s/g, '');
    if (value.length <= 16 && /^\d*$/.test(value)) {
      setCardNumber(formatCardNumber(value));
    }
  };

  const handleExpiryChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setExpiryDate(formatExpiryDate(value));
    }
  };

  const handleCvvChange = (e) => {
    const value = e.target.value;
    if (value.length <= 3 && /^\d*$/.test(value)) {
      setCvv(value);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);

    const userEmail = localStorage.getItem("email");
    if (!userEmail) {
      alert("Please login to complete the booking");
      setProcessing(false);
      return;
    }

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    setShowSuccess(false);
    
    const bookingData = {
      email: userEmail,
      carName: car.name,
      carImage: car.image,
      tripType: "Hourly",
      pickupLocation: tripDetails?.pickupLocation || "Default Location",
      pickupDateTime: `${tripDetails?.pickupDate || new Date().toISOString().split('T')[0]}T${tripDetails?.pickupTime || "10:00"}:00`,
      durationHours: parseInt(tripDetails?.totalHours || "3"),
      paymentMethod: paymentMode,
      paymentIdentifier: `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      price: parseFloat(price.replace(/[₹,]/g, '')),
      carLocation: car.location,
      dropoffTime: tripDetails?.dropoffTime || "",
      numberOfDays: parseInt(tripDetails?.numberOfDays || "1")
    };

    try {
      const response = await fetch("http://localhost:8082/api/bookings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bookingData)
      });

      if (response.ok) {
        const result = await response.json();
        
        const existingBookings = JSON.parse(localStorage.getItem("myBookings")) || [];
        const localBooking = { 
          ...bookingData, 
          id: result.id,
          createdAt: new Date().toISOString()
        };
        localStorage.setItem("myBookings", JSON.stringify([...existingBookings, localBooking]));
        
        setShowSuccess(true);
        setProcessing(false);
      } else {
        const errorText = await response.text();
        let errorMessage = errorText;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorJson.error || errorText;
        } catch (e) {}
        
        alert(`❌ Booking failed: ${errorMessage}`);
        setProcessing(false);
      }
    } catch (error) {
      alert(`❌ Connection failed: ${error.message}`);
      setProcessing(false);
    }
  };

  return (
    <div className="payment-page">
      <div className="payment-wrapper">
        <div className="payment-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12.5 5L7.5 10L12.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </button>
          <h1 className="payment-page-title">Complete Payment</h1>
        </div>

        <div className="payment-layout">
          {/* Left Side - Payment Form */}
          <div className="payment-form-section">
            <div className="payment-card-container">
              <div className="secure-badge">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1L3 3V7C3 10.5 5.5 13.5 8 14.5C10.5 13.5 13 10.5 13 7V3L8 1Z" fill="#10b981" stroke="#10b981" strokeWidth="1.5"/>
                  <path d="M6 8L7.5 9.5L10.5 6.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Secure Payment
              </div>

              <div className="payment-method-tabs">
                <button
                  className={`method-tab ${paymentMode === "card" ? "active" : ""}`}
                  onClick={() => setPaymentMode("card")}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <path d="M3 10H21" stroke="currentColor" strokeWidth="2"/>
                    <path d="M7 14H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Card
                </button>
                <button
                  className={`method-tab ${paymentMode === "upi" ? "active" : ""}`}
                  onClick={() => setPaymentMode("upi")}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor"/>
                    <path d="M12 7v5l3.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  UPI
                </button>
              </div>

              <form className="modern-payment-form" onSubmit={handlePayment}>
                {paymentMode === "card" ? (
                  <>
                    <div className="form-group">
                      <label className="form-label">Card Number</label>
                      <div className="input-wrapper">
                        <input
                          type="text"
                          className="form-input"
                          placeholder="1234 5678 9012 3456"
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          required
                        />
                        <div className="card-logos">
                          <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" className="card-logo" />
                          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="card-logo" />
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Cardholder Name</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="JOHN DOE"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value.toUpperCase())}
                        required
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Expiry Date</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="MM/YY"
                          value={expiryDate}
                          onChange={handleExpiryChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">CVV</label>
                        <input
                          type="password"
                          className="form-input"
                          placeholder="123"
                          value={cvv}
                          onChange={handleCvvChange}
                          maxLength="3"
                          required
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="form-group">
                    <label className="form-label">UPI ID</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="username@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      required
                    />
                    <p className="input-hint">Enter your UPI ID (e.g., yourname@paytm, yourname@gpay)</p>
                  </div>
                )}

                <button type="submit" className="pay-button" disabled={processing}>
                  {processing ? (
                    <>
                      <span className="spinner"></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 1L3 3V7C3 11.5 6 15.5 10 16.5C14 15.5 17 11.5 17 7V3L10 1Z" fill="white"/>
                        <path d="M7 9L9 11L13 7" stroke="#DC143C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Pay {price}
                    </>
                  )}
                </button>

                <div className="payment-security-info">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 14A6 6 0 108 2a6 6 0 000 12z" stroke="#6b7280" strokeWidth="1.5"/>
                    <path d="M8 6v4M8 10h.01" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  Your payment information is encrypted and secure
                </div>
              </form>
            </div>
          </div>

          {/* Right Side - Order Summary */}
          <div className="order-summary-section">
            <div className="order-summary-card">
              <h2 className="summary-title">Order Summary</h2>
              
              <div className="car-preview">
                <img src={car.image} alt={car.name} className="car-preview-img" />
                <div className="car-preview-info">
                  <h3 className="car-preview-name">{car.name}</h3>
                  <p className="car-preview-location">📍 {car.location}</p>
                </div>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-details">
                <div className="summary-row">
                  <span className="summary-label">Pickup Location</span>
                  <span className="summary-value">{tripDetails?.pickupLocation || "Not Provided"}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Pickup Date & Time</span>
                  <span className="summary-value">
                    {tripDetails?.pickupDate || "Not Provided"} at {tripDetails?.pickupTime || "N/A"}
                  </span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Drop-off Time</span>
                  <span className="summary-value">{tripDetails?.dropoffTime || "Not Provided"}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Number of Days</span>
                  <span className="summary-value">{tripDetails?.numberOfDays || "1"} {tripDetails?.numberOfDays > 1 ? 'days' : 'day'}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Total Duration</span>
                  <span className="summary-value">{tripDetails?.totalHours || "N/A"} hours</span>
                </div>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-pricing">
                <div className="summary-row">
                  <span className="summary-label">Subtotal</span>
                  <span className="summary-value">{price}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Service Fee</span>
                  <span className="summary-value">₹0</span>
                </div>
                <div className="summary-row total-row">
                  <span className="summary-label">Total</span>
                  <span className="summary-value total-value">{price}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showSuccess && (
        <div className="success-modal-overlay">
          <div className="success-modal">
            <div className="success-icon">
              <svg viewBox="0 0 52 52" className="success-checkmark">
                <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                <path className="checkmark-check" fill="none" d="M14 27l8 8 16-18"/>
              </svg>
            </div>
            <h2 className="success-title">Payment Successful!</h2>
            <p className="success-message">Your booking has been confirmed</p>
            <div className="success-amount">{price}</div>
            <div className="success-info">
              Booking ID: PAY_{Date.now().toString().slice(-8)}
            </div>
            <div className="success-actions">
              <button className="success-btn primary" onClick={() => navigate("/mybookings")}>
                View Booking
              </button>
              <button className="success-btn secondary" onClick={() => navigate("/")}>
                Back to Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;