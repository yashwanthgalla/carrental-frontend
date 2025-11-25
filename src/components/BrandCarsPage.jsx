import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import CarDetailModal from './CarDetailModal';
import { getCarsByBrand, allStaticCars } from '../data/carsData';
import './BrandCarsPage.css';
import './Cars.css';

const BrandCarsPage = () => {
  const { brandName } = useParams();
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchBrandCars();
  }, [brandName]);

  const fetchBrandCars = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get static cars by brand using helper function
      const staticBrandCars = getCarsByBrand(brandName);
      
      console.log(`Found ${staticBrandCars.length} static cars for ${brandName}`);
      
      // Try to fetch from backend API as well
      try {
        const response = await axios.get(`http://localhost:8080/api/cars/brand/${brandName}`);
        const backendCars = response.data;
        console.log(`Found ${backendCars.length} backend cars for ${brandName}`);
        
        // Combine both sources
        const combinedCars = [...staticBrandCars, ...backendCars];
        setCars(combinedCars);
      } catch (apiError) {
        // If API fails, just use static cars
        console.log('Backend API unavailable, using static car data only');
        setCars(staticBrandCars);
      }
    } catch (err) {
      console.error('Error in fetchBrandCars:', err);
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (car) => {
    // If it's a static car (from Cars.jsx), show modal
    if (typeof car.id === 'string') {
      setSelectedCar(car);
      setShowModal(true);
    } else {
      // If it's from backend, navigate to booking
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      navigate(`/car-booking/${car.id}`);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCar(null);
  };

  const handleBackToBrands = () => {
    navigate('/#brands');
    setTimeout(() => {
      const brandsSection = document.querySelector('.logo-carousel-section');
      if (brandsSection) {
        brandsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="brand-cars-loading">
          <div className="loading-spinner"></div>
          <p>Loading {brandName} vehicles...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="brand-cars-page">
        <div className="brand-cars-header">
          <button className="back-button" onClick={handleBackToBrands}>
            <span className="back-arrow">←</span> Back to Brands
          </button>
          <h1 className="brand-cars-title">{brandName} Collection</h1>
          <p className="brand-cars-subtitle">
            Discover our exclusive selection of {brandName} vehicles
          </p>
        </div>

        {error && (
          <div className="brand-cars-error">
            <p>{error}</p>
          </div>
        )}

        {!error && cars.length === 0 && (
          <div className="brand-cars-empty">
            <div className="empty-icon">🚗</div>
            <h2>No {brandName} Vehicles Available</h2>
            <p>We currently don't have any {brandName} vehicles in our inventory.</p>
            <button className="browse-all-button" onClick={() => navigate('/#cars')}>
              Browse All Cars
            </button>
          </div>
        )}

        {!error && cars.length > 0 && (
          <div className="brand-cars-grid">
            {cars.map((car) => (
              <div key={car.id} className="car-card" data-tag={car.tag}>
                {car.tag && (
                  <div className="car-tag">{car.tag}</div>
                )}
                <img
                  src={car.image || car.imageUrl || '/assets/images/default-car.jpg'}
                  alt={`${car.brand || car.name} ${car.model || ''}`}
                  className="car-image"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f0f0f0" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" font-family="Arial" font-size="20" fill="%23999" text-anchor="middle" dominant-baseline="middle"%3E' + (car.brand || car.name) + '%3C/text%3E%3C/svg%3E';
                  }}
                />
                <div className="car-content">
                  <h3 className="car-name">{car.model || car.name}</h3>
                  <p className="car-price">Price: {car.price || `₹${car.pricePerDay?.toLocaleString()}/day`}</p>
                  <p className="car-features">
                    Features: {car.features ? car.features.join(", ") : "Premium Features"}
                  </p>
                  <button 
                    className="view-details-btn" 
                    onClick={() => handleBookNow(car)}
                    disabled={!car.available && car.available !== undefined}
                  >
                    {(!car.available && car.available !== undefined) ? 'Unavailable' : 'View Details'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
      
      {showModal && selectedCar && (
        <CarDetailModal
          car={selectedCar}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default BrandCarsPage;
