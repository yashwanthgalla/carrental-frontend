import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CarDetailModal.css";

const indianLocations = [
  "Delhi", "Mumbai", "Bengaluru", "Hyderabad", "Ahmedabad",
  "Chennai", "Kolkata", "Pune", "Jaipur", "Lucknow",
  "Bhopal", "Chandigarh", "Goa", "Nagpur", "Indore", "Vijayawada", "Guntur"
];

const todayDate = "2025-05-10"; // Set this dynamically in production

const CarDetailModal = ({ car, onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState("hourly");
  const [pickupLocation, setPickupLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [numberOfDays, setNumberOfDays] = useState("1");
  const [dropoffTime, setDropoffTime] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  if (!car) return null;

  // Calculate total hours based on days and time difference
  const calculateTotalHours = () => {
    if (!pickupTime || !dropoffTime || !numberOfDays) return 0;
    
    const [pickupHour, pickupMin] = pickupTime.split(':').map(Number);
    const [dropoffHour, dropoffMin] = dropoffTime.split(':').map(Number);
    
    const pickupMinutes = pickupHour * 60 + pickupMin;
    const dropoffMinutes = dropoffHour * 60 + dropoffMin;
    
    // Calculate time difference in minutes
    let timeDiffMinutes = dropoffMinutes - pickupMinutes;
    
    // Convert days to hours and add time difference
    const daysInHours = parseInt(numberOfDays) * 24;
    const totalMinutes = daysInHours * 60 + timeDiffMinutes;
    const totalHours = Math.ceil(totalMinutes / 60);
    
    return totalHours;
  };

  const totalHours = calculateTotalHours();
  const hourlyRate = parseFloat(car.hourlyRate?.replace(/[₹,]/g, '') || 0);
  const calculatedPrice = totalHours > 0 ? `₹${(hourlyRate * totalHours).toLocaleString()}` : car.hourlyRate;

  const handlePickUp = async () => {
    if (!pickupLocation || !pickupDate || !pickupTime || !dropoffTime) {
      setError("Please fill all required fields.");
      return;
    }

    if (totalHours < 3) {
      setError("Minimum rental duration must be at least 3 hours.");
      return;
    }

    setError("");

    const tripDetails = {
      pickupLocation,
      pickupDate,
      pickupTime,
      dropoffTime,
      numberOfDays: numberOfDays,
      duration: `${numberOfDays} day${numberOfDays > 1 ? 's' : ''} (${totalHours} hours)`,
      totalHours: totalHours
    };

    // Navigate to payment page
    navigate("/payment", {
      state: {
        car,
        selectedPlan: "hourly",
        price: calculatedPrice,
        tripDetails: tripDetails,
        totalHours: totalHours
      }
    });
    
    onClose(); // Close the modal
  };

  return (
    <div className="car-modal-overlay">
      <div className="car-modal-horizontal">
        <div className="left-section">
          <img className="modal-car-image" src={car.image} alt={car.name} />
        </div>

        <div className="right-section">
          <div className="modal-header">
            <button className="modal-back" onClick={onClose}>←</button>
            <button className="modal-fav">♡</button>
          </div>

          <h2 className="car-title">{car.name}</h2>
          <p className="rating">⭐ 4.9 <span className="muted">(230 Reviews)</span></p>

          <div className="specs-row">
            <div className="spec">
              <p className="label">Power</p>
              <p className="value">{car.power}</p>
            </div>
            <div className="spec">
              <p className="label">Max Speed</p>
              <p className="value">{car.speed}</p>
            </div>
            <div className="spec">
              <p className="label">Acceleration</p>
              <p className="value">{car.acceleration}</p>
            </div>
            <div>
              <p className="attribute-label">Available</p>
              <p className="attribute-value">{car.available || "5"}</p>
            </div>
          </div>

          {/* Trip Booking Form */}
          <div className="trip-booking-form">
            <div className="form-header">
              <svg className="form-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" fill="#dc143c"/>
              </svg>
              <h3 className="form-title">Trip Details</h3>
              <span className="form-subtitle">Complete your booking information</span>
            </div>
            
            <div className="form-grid">
              <div className="form-group">
                <label className="modern-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#dc143c"/>
                  </svg>
                  <span>Pick-up Location</span>
                </label>
                <div className="input-wrapper">
                  <select 
                    className="modern-input"
                    value={pickupLocation} 
                    onChange={(e) => setPickupLocation(e.target.value)}
                  >
                    <option value="">Choose your location</option>
                    {indianLocations.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                  <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M7 10l5 5 5-5z" fill="#666"/>
                  </svg>
                </div>
              </div>

              <div className="form-group">
                <label className="modern-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="4" width="18" height="18" rx="2" stroke="#dc143c" strokeWidth="2" fill="none"/>
                    <path d="M16 2v4M8 2v4M3 10h18" stroke="#dc143c" strokeWidth="2"/>
                  </svg>
                  <span>Pick-up Date</span>
                </label>
                <div className="input-wrapper">
                  <input
                    className="modern-input"
                    type="date"
                    min={todayDate}
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="modern-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="#dc143c" strokeWidth="2" fill="none"/>
                    <path d="M12 6v6l4 2" stroke="#dc143c" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span>Pick-up Time</span>
                </label>
                <div className="input-wrapper">
                  <input
                    className="modern-input"
                    type="time"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="modern-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="4" width="18" height="18" rx="2" stroke="#dc143c" strokeWidth="2" fill="none"/>
                    <path d="M16 2v4M8 2v4M3 10h18" stroke="#dc143c" strokeWidth="2"/>
                    <circle cx="12" cy="14" r="2" fill="#dc143c"/>
                  </svg>
                  <span>Number of Days</span>
                </label>
                <div className="input-wrapper">
                  <select 
                    className="modern-input"
                    value={numberOfDays} 
                    onChange={(e) => setNumberOfDays(e.target.value)}
                  >
                    {[...Array(30).keys()].map(day => (
                      <option key={day + 1} value={day + 1}>{day + 1} {day + 1 === 1 ? 'day' : 'days'}</option>
                    ))}
                  </select>
                  <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M7 10l5 5 5-5z" fill="#666"/>
                  </svg>
                </div>
              </div>

              <div className="form-group">
                <label className="modern-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="#dc143c" strokeWidth="2" fill="none"/>
                    <path d="M12 6v6l4 2" stroke="#dc143c" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M16 8l3-3M16 16l3 3" stroke="#dc143c" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <span>Drop-off Time</span>
                </label>
                <div className="input-wrapper">
                  <input
                    className="modern-input"
                    type="time"
                    value={dropoffTime}
                    onChange={(e) => setDropoffTime(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {totalHours > 0 && (
              <div className="rental-summary">
                <div className="summary-item">
                  <span className="summary-label">Total Duration:</span>
                  <span className="summary-value">{totalHours} hours</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Hourly Rate:</span>
                  <span className="summary-value">{car.hourlyRate}</span>
                </div>
                <div className="summary-item total">
                  <span className="summary-label">Total Cost:</span>
                  <span className="summary-value">{calculatedPrice}</span>
                </div>
              </div>
            )}

            {error && (
              <div className="error-alert">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#dc143c"/>
                  <path d="M12 8v4M12 16h.01" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="location">
            <p className="label">Location</p>
            <p className="value">📍 {car.location}</p>
          </div>

          <div className="modal-footer">
            <div className="price-section">
              <h3 className="price">{totalHours > 0 ? calculatedPrice : car.hourlyRate}</h3>
              <span className="price-label">{totalHours > 0 ? `for ${totalHours} hours` : 'per hour'}</span>
            </div>
            <button className="pickup-btn" onClick={handlePickUp}>
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetailModal;
