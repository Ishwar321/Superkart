import React, { useState } from 'react';
import { Container, Row, Col, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { FaEnvelope, FaCheck, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import './Newsletter.css';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle form submission
  const handleSubscribe = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call - replace with actual newsletter API
      await simulateNewsletterSubscription(email);
      
      setIsSubscribed(true);
      setEmail('');
      toast.success('🎉 Successfully subscribed to our newsletter!');
      
      // Reset success state after 3 seconds
      setTimeout(() => {
        setIsSubscribed(false);
      }, 3000);
      
    } catch (error) {
      setError('Failed to subscribe. Please try again.');
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate newsletter subscription API call
  const simulateNewsletterSubscription = (email) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate random success/failure for demo
        if (Math.random() > 0.1) { // 90% success rate
          resolve({ success: true, message: 'Subscribed successfully' });
        } else {
          reject(new Error('Subscription failed'));
        }
      }, 1500);
    });
  };

  return (
    <section className="newsletter-section py-5">
      <Container>
        <Row className="align-items-center">
          <Col lg={6} md={6} className="mb-4 mb-md-0">
            <div className="newsletter-content">
              <div className="newsletter-icon mb-3">
                <FaEnvelope size={48} className="text-primary" />
              </div>
              <h3 className="fw-bold mb-3 text-white">Stay Updated!</h3>
              <p className="mb-0 text-light fs-5">
                Subscribe to get special offers, exclusive deals, and the latest news about our products.
              </p>
              <div className="newsletter-benefits mt-3">
                <div className="benefit-item d-flex align-items-center mb-2">
                  <FaCheck className="text-success me-2" />
                  <small className="text-light">Exclusive discounts and offers</small>
                </div>
                <div className="benefit-item d-flex align-items-center mb-2">
                  <FaCheck className="text-success me-2" />
                  <small className="text-light">Latest product updates</small>
                </div>
                <div className="benefit-item d-flex align-items-center">
                  <FaCheck className="text-success me-2" />
                  <small className="text-light">No spam, unsubscribe anytime</small>
                </div>
              </div>
            </div>
          </Col>
          
          <Col lg={6} md={6}>
            <div className="newsletter-form">
              {isSubscribed ? (
                <Alert variant="success" className="d-flex align-items-center">
                  <FaCheck className="me-2" />
                  <span>Thank you for subscribing! Check your email for confirmation.</span>
                </Alert>
              ) : (
                <Form onSubmit={handleSubscribe} className="newsletter-input-group">
                  <div className="input-group-container">
                    <div className="d-flex gap-2 mb-3">
                      <Form.Control
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="newsletter-email-input"
                        disabled={isLoading}
                        isInvalid={!!error}
                      />
                      <Button
                        type="submit"
                        variant="light"
                        className="newsletter-submit-btn"
                        disabled={isLoading || !email.trim()}
                      >
                        {isLoading ? (
                          <>
                            <Spinner animation="border" size="sm" className="me-2" />
                            Subscribing...
                          </>
                        ) : (
                          <>
                            <FaEnvelope className="me-2" />
                            Subscribe
                          </>
                        )}
                      </Button>
                    </div>
                    
                    {error && (
                      <Alert variant="danger" className="d-flex align-items-center mb-0">
                        <FaTimes className="me-2" />
                        <span>{error}</span>
                      </Alert>
                    )}
                  </div>
                  
                  <small className="text-light d-block mt-2">
                    By subscribing, you agree to our{' '}
                    <a href="/privacy" className="text-warning text-decoration-none">
                      Privacy Policy
                    </a>{' '}
                    and{' '}
                    <a href="/terms" className="text-warning text-decoration-none">
                      Terms of Service
                    </a>
                  </small>
                </Form>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Newsletter;
