import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <img className="footer-logo-img" src="\logo\ferrari-logo.png" alt="Ferrari Rentals" />
          <span className="footer-logo-text">Ferrari Rentals</span>
        </div>
        
        <div className="footer-section">
          <h3 className="footer-title">Quick Links</h3>
          <a href="#services" className="footer-link" onClick={(e) => { e.preventDefault(); document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }); }}>Services</a>
          <a href="#cars" className="footer-link" onClick={(e) => { e.preventDefault(); document.getElementById('cars')?.scrollIntoView({ behavior: 'smooth' }); }}>Find Your Car</a>
          <a href="#testimonials" className="footer-link" onClick={(e) => { e.preventDefault(); document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' }); }}>Testimonials</a>
          <a href="#contact" className="footer-link" onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}>Contact Us</a>
        </div>
        
        <div className="footer-section">
          <h3 className="footer-title">Car Categories</h3>
          <a href="#cars" className="footer-link" onClick={(e) => { e.preventDefault(); document.getElementById('cars')?.scrollIntoView({ behavior: 'smooth' }); }}>Premium Cars</a>
          <a href="#cars" className="footer-link" onClick={(e) => { e.preventDefault(); document.getElementById('cars')?.scrollIntoView({ behavior: 'smooth' }); }}>Sports Cars</a>
          <a href="#cars" className="footer-link" onClick={(e) => { e.preventDefault(); document.getElementById('cars')?.scrollIntoView({ behavior: 'smooth' }); }}>Formula One Cars</a>
          <a href="#cars" className="footer-link" onClick={(e) => { e.preventDefault(); document.getElementById('cars')?.scrollIntoView({ behavior: 'smooth' }); }}>Electric Cars</a>
        </div>
        
        <div className="footer-section">
          <h3 className="footer-title">Contact Info</h3>
          <div className="footer-contact-info">
            <span className="footer-contact-icon"><FaMapMarkerAlt /></span>
            <p>Vijayawada, Andhra Pradesh, India</p>
          </div>
          <div className="footer-contact-info">
            <span className="footer-contact-icon"><FaPhoneAlt /></span>
            <p>+91 8897143689</p>
          </div>
          <div className="footer-contact-info">
            <span className="footer-contact-icon"><FaEnvelope /></span>
            <p>ferrarirentalsinfos@gmail.com</p>
          </div>
          
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="YouTube">
              <FaYoutube />
            </a>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Ferrari Rentals. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;