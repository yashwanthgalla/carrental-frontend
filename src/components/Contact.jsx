import React, { useState } from "react";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowError(false);

    try {
      const response = await fetch("http://localhost:8082/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowSuccess(true);
        
        // Reset form
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: ""
        });

        // Hide success message after 3 seconds
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      } else {
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <section id="contact" className="contact">
      <h2 className="contact-title">Contact Us</h2>
      <div className="contact-container">
        <div className="contact-info">
          <div className="info-item">
            <div className="info-icon">📍</div>
            <div className="info-content">
              <h3 className="info-title">Our Location</h3>
              <p className="info-text">Vijayawada, Andhra Pradesh, India</p>
            </div>
          </div>
          <div className="info-item">
            <div className="info-icon">📞</div>
            <div className="info-content">
              <h3 className="info-title">Call Us</h3>
              <p className="info-text">+91 8897143689</p>
            </div>
          </div>
          <div className="info-item">
            <div className="info-icon">✉️</div>
            <div className="info-content">
              <h3 className="info-title">Email Us</h3>
              <p className="info-text">ferrarirentalsinfos@gmail.com</p>
            </div>
          </div>
          <div className="info-item">
            <div className="info-icon">⏰</div>
            <div className="info-content">
              <h3 className="info-title">Working Hours</h3>
              <p className="info-text">Monday-Friday: 9am - 7pm<br />Saturday-Sunday: 10am - 5pm</p>
            </div>
          </div>
        </div>
        <div className="contact-form">
          {showSuccess && (
            <div className="success-message">
              ✅ Message sent successfully! We'll get back to you soon.
            </div>
          )}
          
          {showError && (
            <div className="error-message">
              ❌ Failed to send message. Please try again.
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Your Name</label>
              <input 
                type="text" 
                name="name"
                className="form-control" 
                placeholder="Name" 
                value={formData.name}
                onChange={handleInputChange}
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Your Email</label>
              <input 
                type="email" 
                name="email"
                className="form-control" 
                placeholder="abc@example.com" 
                value={formData.email}
                onChange={handleInputChange}
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Subject</label>
              <input 
                type="text" 
                name="subject"
                className="form-control" 
                placeholder="Rental Inquiry" 
                value={formData.subject}
                onChange={handleInputChange}
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Your Message</label>
              <textarea 
                name="message"
                className="form-control" 
                placeholder="Tell us about your rental needs..." 
                value={formData.message}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>
            <button 
              type="submit" 
              className="submit-btn" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;