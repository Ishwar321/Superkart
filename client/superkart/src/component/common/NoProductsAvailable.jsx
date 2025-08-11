import React from 'react';
import { Container, Row, Col, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaSearch, FaHome, FaShoppingBag } from 'react-icons/fa';
import "./NoProductsAvailable.css";

const NoProductsAvailable = ({ message = "No products available at the moment." }) => {
  return (
    <div className="no-products-container">
      <div className="no-products-content">
        <div className="no-products-icon">
          <FaSearch size={64} />
        </div>
        <h3 className="no-products-title">No Products Found</h3>
        <p className="no-products-message">{message}</p>
        
        <div className="no-products-suggestions">
          <h6>Here's what you can try:</h6>
          <ul>
            <li>Check your spelling and try again</li>
            <li>Use different or more general keywords</li>
            <li>Browse our categories for inspiration</li>
            <li>Check back later for new arrivals</li>
          </ul>
        </div>

        <div className="no-products-actions">
          <Button 
            as={Link} 
            to="/products" 
            variant="primary" 
            size="lg"
            className="me-3"
          >
            <FaShoppingBag className="me-2" />
            Browse All Products
          </Button>
          <Button 
            as={Link} 
            to="/" 
            variant="outline-primary" 
            size="lg"
          >
            <FaHome className="me-2" />
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NoProductsAvailable;