import React, { useEffect } from "react";
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedinIn,
  FaEnvelope,
  FaPhone,
  FaClock,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaShippingFast,
  FaUndo,
  FaCreditCard,
  FaHeart
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { getAllCategories } from "../../store/features/categorySlice";
import { useDispatch, useSelector } from "react-redux";
import "./Footer.css";

const Footer = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.category.categories);

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  return (
    <footer className='enhanced-footer'>
      {/* Trust Indicators Section */}
      <div className='footer-trust-section'>
        <div className='container'>
          <div className='trust-indicators'>
            <div className='trust-item'>
              <FaShippingFast className='trust-icon' />
              <div className='trust-content'>
                <h6>Free Shipping</h6>
                <p>On orders over ₹999</p>
              </div>
            </div>
            <div className='trust-item'>
              <FaShieldAlt className='trust-icon' />
              <div className='trust-content'>
                <h6>Secure Payment</h6>
                <p>100% protected transactions</p>
              </div>
            </div>
            <div className='trust-item'>
              <FaUndo className='trust-icon' />
              <div className='trust-content'>
                <h6>Easy Returns</h6>
                <p>30-day return policy</p>
              </div>
            </div>
            <div className='trust-item'>
              <FaPhone className='trust-icon' />
              <div className='trust-content'>
                <h6>24/7 Support</h6>
                <p>Always here to help</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className='footer-main'>
        <div className='container'>
          <div className='footer-grid'>
            {/* Company Info */}
            <div className='footer-section company-section'>
              <div className='footer-logo'>
                <h3>🛒 SuperKart</h3>
                <p className='tagline'>Your Shopping Paradise</p>
              </div>
              <p className='footer-description'>
                SuperKart brings you premium quality products with exceptional value. 
                Experience seamless shopping with our curated collection, fast delivery, 
                and outstanding customer service.
              </p>
              <div className='social-section'>
                <h6>Follow Us</h6>
                <div className='social-icons'>
                  <a href='#' className='social-link facebook' aria-label="Facebook">
                    <FaFacebookF />
                  </a>
                  <a href='#' className='social-link twitter' aria-label="Twitter">
                    <FaTwitter />
                  </a>
                  <a href='#' className='social-link instagram' aria-label="Instagram">
                    <FaInstagram />
                  </a>
                  <a href='#' className='social-link linkedin' aria-label="LinkedIn">
                    <FaLinkedinIn />
                  </a>
                </div>
              </div>
            </div>

            {/* Customer Service */}
            <div className='footer-section'>
              <h5 className='footer-title'>Customer Care</h5>
              <ul className='footer-links'>
                <li><Link to="/help" className='footer-link'>Help Center</Link></li>
                <li><Link to="/track-order" className='footer-link'>Track Your Order</Link></li>
                <li><Link to="/shipping" className='footer-link'>Shipping Information</Link></li>
                <li><Link to="/returns" className='footer-link'>Returns & Exchanges</Link></li>
                <li><Link to="/size-guide" className='footer-link'>Size Guide</Link></li>
                <li><Link to="/bulk-orders" className='footer-link'>Bulk Orders</Link></li>
              </ul>
            </div>

            {/* Contact Information */}
            <div className='footer-section contact-section'>
              <h5 className='footer-title'>Stay Connected</h5>
              <div className='contact-info'>
                <div className='contact-item'>
                  <FaEnvelope className='contact-icon' />
                  <span>support@superkart.com</span>
                </div>
                <div className='contact-item'>
                  <FaPhone className='contact-icon' />
                  <span>1800-123-KART (5278)</span>
                </div>
                <div className='contact-item'>
                  <FaClock className='contact-icon' />
                  <span>Mon-Sun: 24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className='footer-bottom'>
        <div className='container'>
          <div className='footer-bottom-content'>
            <div className='copyright-section'>
              <p>&copy; {new Date().getFullYear()} SuperKart. All rights reserved.</p>
              <div className='legal-links'>
                <Link to="/privacy" className='legal-link'>Privacy Policy</Link>
                <Link to="/terms" className='legal-link'>Terms of Service</Link>
                <Link to="/cookies" className='legal-link'>Cookie Policy</Link>
              </div>
            </div>
            
            <div className='payment-section'>
              <span className='payment-label'>We Accept:</span>
              <div className='payment-methods'>
                <div className='payment-icon'><FaCreditCard /></div>
                <span className='payment-text'>All Major Cards</span>
                <span className='payment-text'>•</span>
                <span className='payment-text'>Cash on Delivery</span>
                <span className='payment-text'>•</span>
                <span className='payment-text'>UPI</span>
              </div>
            </div>
          </div>
          
          <div className='footer-love'>
            <p>Made with <FaHeart className='heart-icon' /> for amazing shopping experience</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
