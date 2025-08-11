import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import HeroSlider from "./HeroSlider";
import { Link } from "react-router-dom";
import { FaShoppingBag, FaArrowRight } from "react-icons/fa";

const Hero = () => {
  const [currentSlide] = useState(0);

  return (
    <div className='hero'>
      <div className='hero-header'>
        <Container>
          <Row className="justify-content-center text-center py-4">
            <Col lg={8} md={10} xs={12}>
              <h1 className="hero-title mb-3">
                Welcome to <span className='hero-brand'>SuperKart</span>
              </h1>
              <p className="hero-subtitle mb-4">
                Discover amazing products at unbeatable prices
              </p>
            </Col>
          </Row>
        </Container>
      </div>
      <HeroSlider setCurrentSlide={currentSlide} />
    </div>
  );
};

export default Hero;
