import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaStar, FaShoppingCart, FaEye, FaHeart, FaTruck, FaShieldAlt, FaHeadset, FaUndoAlt } from "react-icons/fa";
import Hero from "../hero/Hero";
import ProductImage from "../utils/ProductImage";
import Newsletter from "../common/Newsletter";
import { useSelector, useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { getDistinctProductsByName } from "../../store/features/productSlice";
import LoadSpinner from "../common/LoadSpinner";
import StockStatus from "../utils/StockStatus";

const Home = () => {
  const dispatch = useDispatch();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const products = useSelector((state) => state.product.distinctProducts);
  const isLoading = useSelector((state) => state.product.isLoading);

  useEffect(() => {
    dispatch(getDistinctProductsByName());
  }, [dispatch]);

  useEffect(() => {
    // Get first 8 products as featured
    if (products && products.length > 0) {
      setFeaturedProducts(products.slice(0, 8));
    }
  }, [products]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return <LoadSpinner message="Loading amazing products for you..." />;
  }

  return (
    <>
      <ToastContainer position="top-right" />
      
      {/* Hero Section */}
      <Hero />

      {/* Featured Products Section */}
      <section className="featured-products py-5">
        <Container>
          <div className="section-header text-center mb-5">
            <h2 className="display-5 fw-bold text-dark">Featured Products</h2>
            <p className="lead text-muted">Discover our handpicked selection of amazing products</p>
          </div>

          <Row className="g-4">
            {featuredProducts.map((product) => (
              <Col key={product.id} lg={3} md={4} sm={6} xs={12}>
                <Card className="product-card h-100 shadow-sm border-0">
                  <div className="product-image-container position-relative">
                    <Link to={`/products/${product.name}`} className="text-decoration-none">
                      <div className="product-image-wrapper">
                        {product.images && product.images.length > 0 ? (
                          <ProductImage 
                            productId={product.images[0].id} 
                            className="product-image"
                          />
                        ) : (
                          <div className="placeholder-image d-flex align-items-center justify-content-center">
                            <span className="text-muted">No Image</span>
                          </div>
                        )}
                      </div>
                    </Link>
                    
                    {/* Product badges */}
                    <div className="product-badges position-absolute top-0 start-0 p-2">
                      {product.inventory < 5 && product.inventory > 0 && (
                        <Badge bg="warning" className="me-1">Low Stock</Badge>
                      )}
                      {product.inventory === 0 && (
                        <Badge bg="danger" className="me-1">Out of Stock</Badge>
                      )}
                    </div>

                    {/* Quick action buttons */}
                    <div className="product-actions position-absolute top-0 end-0 p-2">
                      <div className="d-flex flex-column gap-1">
                        <Button
                          variant="light"
                          size="sm"
                          className="rounded-circle p-2 action-btn"
                          title="Add to Wishlist"
                        >
                          <FaHeart />
                        </Button>
                        <Link
                          to={`/product/${product.id}/details`}
                          className="btn btn-light btn-sm rounded-circle p-2 action-btn"
                          title="Quick View"
                        >
                          <FaEye />
                        </Link>
                      </div>
                    </div>
                  </div>

                  <Card.Body className="d-flex flex-column">
                    <div className="mb-2">
                      <Link 
                        to={`/products/${product.name}`} 
                        className="text-decoration-none"
                      >
                        <h6 className="product-title text-dark fw-semibold mb-1">
                          {product.name}
                        </h6>
                      </Link>
                      <p className="product-description text-muted small mb-2">
                        {product.description && product.description.length > 60
                          ? `${product.description.substring(0, 60)}...`
                          : product.description}
                      </p>
                    </div>

                    <div className="mb-2">
                      <div className="d-flex align-items-center mb-1">
                        <div className="text-warning me-1">
                          {[...Array(5)].map((_, i) => (
                            <FaStar 
                              key={i} 
                              className={i < 4 ? "text-warning" : "text-muted"} 
                              size={12}
                            />
                          ))}
                        </div>
                        <small className="text-muted">(4.0)</small>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div>
                          <h5 className="price text-primary fw-bold mb-0">
                            {formatPrice(product.price)}
                          </h5>
                          <small className="text-muted text-decoration-line-through">
                            {formatPrice(product.price * 1.2)}
                          </small>
                        </div>
                        <StockStatus inventory={product.inventory} />
                      </div>

                      <div className="d-grid gap-2">
                        <Link
                          to={`/products/${product.name}`}
                          className="btn btn-primary btn-sm"
                        >
                          <FaShoppingCart className="me-2" />
                          Shop Now
                        </Link>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <div className="text-center mt-5">
            <Link to="/products" className="btn btn-outline-primary btn-lg">
              View All Products
            </Link>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section py-5 bg-light">
        <Container>
          <Row className="g-4">
            <Col md={3} sm={6}>
              <div className="feature-card text-center p-4">
                <FaTruck className="feature-icon text-primary mb-3" size={48} />
                <h5>Free Shipping</h5>
                <p className="text-muted mb-0">On orders above ₹999</p>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="feature-card text-center p-4">
                <FaShieldAlt className="feature-icon text-success mb-3" size={48} />
                <h5>Secure Payment</h5>
                <p className="text-muted mb-0">100% secure transactions</p>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="feature-card text-center p-4">
                <FaHeadset className="feature-icon text-info mb-3" size={48} />
                <h5>24/7 Support</h5>
                <p className="text-muted mb-0">Always here to help</p>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="feature-card text-center p-4">
                <FaUndoAlt className="feature-icon text-warning mb-3" size={48} />
                <h5>Easy Returns</h5>
                <p className="text-muted mb-0">30-day return policy</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Newsletter Section */}
      <Newsletter />
    </>
  );
};

export default Home;
