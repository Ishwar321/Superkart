import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById, setQuantity } from "../../store/features/productSlice";
import { useSelector, useDispatch } from "react-redux";
import ImageZoomify from "../common/ImageZoomify";
import QuantityUpdater from "../utils/QuantityUpdater";
import { 
  FaShoppingCart, 
  FaStar, 
  FaHeart, 
  FaShare, 
  FaShippingFast,
  FaUndo,
  FaShieldAlt,
  FaTag,
  FaCheck,
  FaTruck,
  FaHeadset,
  FaCertificate,
  FaThumbsUp
} from "react-icons/fa";
import { addToCart } from "../../store/features/cartSlice";
import { toast, ToastContainer } from "react-toastify";
import StockStatus from "../utils/StockStatus";
import { Container, Row, Col, Card, Button, Badge, Alert, Tab, Tabs } from "react-bootstrap";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { product, quantity } = useSelector((state) => state.product);
  const successMessage = useSelector((state) => state.cart.successMessage);
  const errorMessage = useSelector((state) => state.cart.errorMessage);

  const productOutOfStock = product?.inventory <= 0;

  useEffect(() => {
    dispatch(getProductById(productId));
    dispatch(setQuantity(1));
  }, [dispatch, productId]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("You need to be logged in to add items to the cart.");
      return;
    }
    try {
      await dispatch(addToCart({ productId, quantity })).unwrap();
      toast.success(successMessage || "Item added to cart successfully!");
    } catch (error) {
      toast.error(errorMessage || "Failed to add to cart.");
    }
  };

  const handleIncreaseQuantity = () => {
    dispatch(setQuantity(quantity + 1));
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      dispatch(setQuantity(quantity - 1));
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar 
        key={i} 
        className={i < rating ? "text-warning" : "text-muted"} 
        size={16}
      />
    ));
  };

  return (
    <div className="product-details-modern">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <Container fluid className="px-4">
        {/* Breadcrumb */}
        <nav className="breadcrumb-modern mb-4">
          <span className="breadcrumb-item">Home</span>
          <span className="breadcrumb-divider">/</span>
          <span className="breadcrumb-item">Products</span>
          <span className="breadcrumb-divider">/</span>
          <span className="breadcrumb-item active">{product?.name}</span>
        </nav>

        {product ? (
          <>
            {/* Main Product Section */}
            <Row className="product-main-section g-4 mb-5">
              {/* Product Images */}
              <Col lg={6}>
                <div className="product-gallery">
                  {/* Main Image */}
                  <div className="main-image-wrapper">
                    {product.images.length > 0 && (
                      <div className="main-image-container">
                        <ImageZoomify productId={product.images[selectedImageIndex]?.id || product.images[0].id} />
                        
                        {/* Quick Action Buttons */}
                        <div className="image-overlay-actions">
                          <button className="overlay-btn wishlist-btn" title="Add to Wishlist">
                            <FaHeart />
                          </button>
                          <button className="overlay-btn share-btn" title="Share Product">
                            <FaShare />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Images */}
                  {product.images.length > 1 && (
                    <div className="thumbnail-gallery">
                      {product.images.map((img, index) => (
                        <div 
                          key={img.id} 
                          className={`thumbnail-item ${index === selectedImageIndex ? 'active' : ''}`}
                          onClick={() => setSelectedImageIndex(index)}
                        >
                          <ImageZoomify productId={img.id} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Col>

              {/* Product Information */}
              <Col lg={6}>
                <div className="product-info-modern">
                  {/* Product Header */}
                  <div className="product-header-modern">
                    <div className="product-brand">
                      {typeof product.brand === 'object' ? product.brand.name : product.brand}
                    </div>
                    <h1 className="product-title-modern">{product.name}</h1>
                    
                    {/* Rating */}
                    <div className="product-rating-modern">
                      <div className="stars-wrapper">
                        {renderStars(4)}
                        <span className="rating-number">4.2</span>
                      </div>
                      <span className="reviews-count">(12 reviews)</span>
                    </div>
                  </div>

                  {/* Price Section */}
                  <div className="price-section-modern">
                    <div className="price-main">
                      <span className="current-price">
                        {new Intl.NumberFormat("en-IN", {
                          style: "currency",
                          currency: "INR",
                          maximumFractionDigits: 0,
                        }).format(product.price)}
                      </span>
                    </div>
                  </div>

                  {/* Stock Status */}
                  <div className="stock-status-modern">
                    <StockStatus inventory={product.inventory} />
                    {product.inventory > 0 && product.inventory <= 10 && (
                      <span className="urgency-text">Only {product.inventory} left in stock!</span>
                    )}
                  </div>

                  {/* Quantity and Purchase */}
                  <div className="purchase-section-modern">
                    <div className="quantity-selector">
                      <label>Quantity:</label>
                      <QuantityUpdater
                        quantity={quantity}
                        onDecrease={handleDecreaseQuantity}
                        onIncrease={handleIncreaseQuantity}
                        disabled={productOutOfStock}
                        disableDecrease={quantity <= 1}
                      />
                    </div>

                    <div className="action-buttons-modern">
                      <Button
                        className="add-to-cart-btn-modern"
                        onClick={handleAddToCart}
                        disabled={productOutOfStock}
                        size="lg"
                      >
                        <FaShoppingCart className="me-2" />
                        {productOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                      </Button>
                      
                      <div className="secondary-actions">
                        <Button variant="outline-primary" className="buy-now-btn-modern" disabled={productOutOfStock}>
                          Buy Now
                        </Button>
                        <Button variant="outline-secondary" className="wishlist-btn-modern" disabled={productOutOfStock}>
                          <FaHeart />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Trust Badges */}
                  <div className="trust-badges">
                    <div className="trust-item">
                      <FaShippingFast className="trust-icon" />
                      <div>
                        <strong>Free Shipping</strong>
                        <span>On orders above ₹500</span>
                      </div>
                    </div>
                    <div className="trust-item">
                      <FaUndo className="trust-icon" />
                      <div>
                        <strong>Easy Returns</strong>
                        <span>30-day return policy</span>
                      </div>
                    </div>
                    <div className="trust-item">
                      <FaShieldAlt className="trust-icon" />
                      <div>
                        <strong>1 Year Warranty</strong>
                        <span>Manufacturer warranty</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

            {/* Product Details Tabs */}
            <Row className="product-tabs-section">
              <Col>
                <div className="product-tabs-modern">
                  <Tabs
                    activeKey={activeTab}
                    onSelect={(k) => setActiveTab(k)}
                    className="custom-tabs"
                  >
                    <Tab eventKey="overview" title="Overview">
                      <div className="tab-content-modern">
                        <h5>Product Description</h5>
                        <p className="description-text">{product.description}</p>
                        
                        <div className="specifications">
                          <h6>Specifications:</h6>
                          <div className="spec-grid">
                            <div className="spec-item">
                              <span className="spec-label">Brand:</span>
                              <span className="spec-value">{typeof product.brand === 'object' ? product.brand.name : product.brand}</span>
                            </div>
                            <div className="spec-item">
                              <span className="spec-label">Category:</span>
                              <span className="spec-value">{typeof product.category === 'object' ? product.category.name : product.category || 'Electronics'}</span>
                            </div>
                            <div className="spec-item">
                              <span className="spec-label">Availability:</span>
                              <span className="spec-value">{product.inventory > 0 ? 'In Stock' : 'Out of Stock'}</span>
                            </div>
                            <div className="spec-item">
                              <span className="spec-label">SKU:</span>
                              <span className="spec-value">SKU{product.id}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Tab>
                    
                    <Tab eventKey="reviews" title="Reviews (12)">
                      <div className="tab-content-modern">
                        <div className="reviews-summary">
                          <div className="rating-overview">
                            <div className="average-rating">
                              <span className="rating-number-large">4.2</span>
                              <div className="stars-large">
                                {renderStars(4)}
                              </div>
                              <span className="total-reviews">Based on 12 reviews</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="sample-reviews">
                          <div className="review-item">
                            <div className="review-header">
                              <strong>Verified Customer</strong>
                              <div className="review-rating">{renderStars(4)}</div>
                            </div>
                            <p>"Good quality product. Delivered on time."</p>
                          </div>
                        </div>
                      </div>
                    </Tab>
                    
                    <Tab eventKey="shipping" title="Shipping & Returns">
                      <div className="tab-content-modern">
                        <div className="shipping-info">
                          <div className="info-section">
                            <h6><FaTruck className="me-2" />Shipping Information</h6>
                            <ul>
                              <li>Free shipping on orders above ₹500</li>
                              <li>Standard delivery: 3-5 business days</li>
                              <li>Express delivery: 1-2 business days (additional charges apply)</li>
                              <li>Same day delivery available in select cities</li>
                            </ul>
                          </div>
                          
                          <div className="info-section">
                            <h6><FaUndo className="me-2" />Return Policy</h6>
                            <ul>
                              <li>30-day return policy</li>
                              <li>Items must be in original condition</li>
                              <li>Free return pickup</li>
                              <li>Refund processed within 5-7 business days</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </Tab>
                  </Tabs>
                </div>
              </Col>
            </Row>
          </>
        ) : (
          <div className="product-not-found">
            <div className="not-found-content">
              <h4>Product Not Found</h4>
              <p>The product you're looking for doesn't exist or has been removed.</p>
              <Button variant="primary" href="/products">Browse Products</Button>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default ProductDetails;
