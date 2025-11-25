import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CarDetailModal from "./CarDetailModal";
import { premiumCars, sportsCars, electricCars, sedanCars, f1Cars } from "../data/carsData";
import "./Cars.css";

const Cars = () => {
  const navigate = useNavigate();
  const [bookingLoading, setBookingLoading] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleRentNow = (car) => {
    setSelectedCar(car);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCar(null);
  };

  // Render a section with horizontal scroll
  const renderSection = (title, cars) => (
    <div className="cars-section-wrapper">
      <h2>{title}</h2>
      <div className="cars-scroll-container">
        {cars.map(car => (
          <div key={car.id} className="car-card" data-tag={car.tag}>
            <div className="car-tag">{car.tag}</div>
            <img src={car.image} alt={car.name} className="car-image" />
            <div className="car-content">
              <h3 className="car-name">{car.name}</h3>
              <p className="car-price">Price: {car.price}</p>
              <p className="car-features">Features: {car.features.join(", ")}</p>
              <button 
                className="view-details-btn" 
                onClick={() => handleRentNow(car)} 
                disabled={bookingLoading}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div id="cars" className="cars-main-section">
      {renderSection("Premium Cars", premiumCars)}
      {renderSection("Sports Cars", sportsCars)}
      {renderSection("Formula 1 Cars", f1Cars)}
      {renderSection("Electric Cars", electricCars)}
      {renderSection("Sedan Cars", sedanCars)}
      
      {showModal && selectedCar && (
        <CarDetailModal
          car={selectedCar}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Cars;
