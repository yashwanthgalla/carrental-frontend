import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LogoCarousel.css';

const LogoCarousel = () => {
  const navigate = useNavigate();

  const carBrands = [
    { name: 'Ferrari', logo: '/Car Brand Logos/ferrari-logo.png', path: '/brand/Ferrari' },
    { name: 'Lamborghini', logo: '/Car Brand Logos/lamborghini-logo.png', path: '/brand/Lamborghini' },
    { name: 'Porsche', logo: '/Car Brand Logos/porsche-logo.png', path: '/brand/Porsche' },
    { name: 'Mercedes', logo: '/Car Brand Logos/Mercedes-Benz-logo.png', path: '/brand/Mercedes' },
    { name: 'BMW', logo: '/Car Brand Logos/bmw-logo.png', path: '/brand/BMW' },
    { name: 'Audi', logo: '/Car Brand Logos/audi-logo.png', path: '/brand/Audi' },
    { name: 'Bentley', logo: '/Car Brand Logos/bentley-logo.png', path: '/brand/Bentley' },
    { name: 'Rolls-Royce', logo: '/Car Brand Logos/Rolls-Royce-logo.png', path: '/brand/Rolls-Royce' },
    { name: 'McLaren', logo: '/Car Brand Logos/McLaren-logo.png', path: '/brand/McLaren' },
    { name: 'Aston Martin', logo: '/Car Brand Logos/Aston-Martin-logo.png', path: '/brand/Aston Martin' },
    { name: 'Maserati', logo: '/Car Brand Logos/maserati-logo.png', path: '/brand/Maserati' },
    { name: 'Bugatti', logo: '/Car Brand Logos/Bugatti-logo.png', path: '/brand/Bugatti' },
    { name: 'F1', logo: '/Car Brand Logos/F1-Logo.png', path: '/brand/F1' },
  ];

  const handleBrandClick = (brandPath) => {
    navigate(brandPath);
  };

  // Duplicate the array for seamless loop
  const duplicatedBrands = [...carBrands, ...carBrands];

  return (
    <section className="logo-carousel-section">
      <div className="logo-carousel-container">
        <h2 className="logo-carousel-title">Explore Premium Brands</h2>
        <div className="logo-carousel-wrapper">
          <div className="logo-carousel-track">
            {duplicatedBrands.map((brand, index) => (
              <div
                key={`${brand.name}-${index}`}
                className="logo-carousel-item"
                onClick={() => handleBrandClick(brand.path)}
              >
                <div className="logo-carousel-image-wrapper">
                  <img
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    className="logo-carousel-image"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100"%3E%3Crect fill="%23f0f0f0" width="200" height="100"/%3E%3Ctext x="50%25" y="50%25" font-family="Arial" font-size="16" fill="%23999" text-anchor="middle" dominant-baseline="middle"%3E' + brand.name + '%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
                <p className="logo-carousel-brand-name">{brand.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LogoCarousel;
