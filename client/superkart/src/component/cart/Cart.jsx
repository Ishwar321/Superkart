import React, { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCart,
  getUserCart,
  updateQuantity,
  removeItemFromCart,
} from "../../store/features/cartSlice";
import { Card, Container, Row, Col, Button, Badge, Alert } from "react-bootstrap";
import ProductImage from "../utils/ProductImage";
import QuantityUpdater from "../utils/QuantityUpdater";
import LoadSpinner from "../common/LoadSpinner";
import { toast, ToastContainer } from "react-toastify";
import { 
  FaShoppingCart, 
  FaTrash, 
  FaCreditCard, 
  FaArrowLeft,
  FaTag,
  FaShippingFast
} from "react-icons/fa";
import "./Cart.css";

const Cart = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const cartId = useSelector((state) => state.cart.cartId);
  const isLoading = useSelector((state) => state.cart.isLoading);
  const { successMessage, errorMessage } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getUserCart(userId));
  }, [dispatch, userId]);

  const handleIncreaseQuantity = (itemId) => {
    const item = cart.items.find((item) => item.product.id === itemId);
    if (item && cartId) {
      dispatch(
        updateQuantity({
          cartId,
          itemId,
          newQuantity: item.quantity + 1,
        })
      );
    }
  };

  const handleDecreaseQuantity = (itemId) => {
    const item = cart.items.find((item) => item.product.id === itemId);
    if (item && item.quantity > 1) {
      dispatch(
        updateQuantity({
          cartId,
          itemId,
          newQuantity: item.quantity - 1,
        })
      );
    }
  };

  const handleRemoveItem = (itemId) => {
    try {
      dispatch(removeItemFromCart({ cartId, itemId }));
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handlePlaceOrder = () => {
    navigate(`/checkout/${userId}/checkout`);
  };

  if (isLoading) {
    return <LoadSpinner />;
  }

  return (
    <Container className="cart-container">
      <ToastContainer />
      
      {/* Cart Header */}
      <div className="cart-header text-center mb-4">
        <div className="d-flex align-items-center justify-content-center mb-3">
          <FaShoppingCart className="text-primary me-3" size={32} />
          <h2 className="fw-bold text-dark mb-0">Shopping Cart</h2>
        </div>
        <p className="text-muted">
          {cart.items.length > 0 
            ? `You have ${cart.items.length} item${cart.items.length > 1 ? 's' : ''} in your cart`
            : 'Your cart is waiting to be filled'
          }
        </p>
      </div>

      {cart.items.length === 0 ? (
        /* Empty Cart */
        <div className="empty-cart-container">
          <Card className="empty-cart-card text-center p-5">
            <div className="empty-cart-icon mb-4">
              <FaShoppingCart size={80} className="text-muted" />
            </div>
            <h4 className="mb-3 text-dark">Your cart is empty</h4>
            <p className="text-muted mb-4">
              Looks like you haven't added anything to your cart yet. 
              Start shopping to fill it up!
            </p>
            <Button 
              as={Link} 
              to="/products" 
              variant="primary" 
              size="lg"
              className="continue-shopping-btn"
            >
              <FaArrowLeft className="me-2" />
              Continue Shopping
            </Button>
          </Card>
        </div>
      ) : (
        <Row>
          {/* Cart Items */}
          <Col lg={8} md={12}>
            <div className="cart-items-section">
              <div className="section-header mb-4">
                <h5 className="fw-semibold text-dark">
                  Cart Items ({cart.items.length})
                </h5>
              </div>

              {cart.items.map((item, index) => (
                <Card key={index} className="cart-item-card mb-3 shadow-sm">
                  <Card.Body>
                    <Row className="align-items-center">
                      {/* Product Image */}
                      <Col xs={3} md={2}>
                        <div className="cart-item-image">
                          {item.product?.images?.length > 0 && (
                            <ProductImage productId={item.product?.images[0].id} />
                          )}
                        </div>
                      </Col>

                      {/* Product Details */}
                      <Col xs={9} md={4}>
                        <div className="cart-item-details">
                          <h6 className="product-name mb-1">{item.product?.name}</h6>
                          <p className="product-brand text-muted mb-1">{item.product?.brand}</p>
                          <div className="d-flex align-items-center">
                            <Badge bg="success" className="me-2">In Stock</Badge>
                            <small className="text-success">
                              <FaShippingFast className="me-1" />
                              Free Shipping
                            </small>
                          </div>
                        </div>
                      </Col>

                      {/* Quantity Controls */}
                      <Col xs={6} md={2}>
                        <div className="quantity-section text-center">
                          <label className="form-label small text-muted">Quantity</label>
                          <QuantityUpdater
                            quantity={item.quantity}
                            onDecrease={() => handleDecreaseQuantity(item.product.id)}
                            onIncrease={() => handleIncreaseQuantity(item.product.id)}
                          />
                        </div>
                      </Col>

                      {/* Price */}
                      <Col xs={3} md={2}>
                        <div className="price-section text-center">
                          <label className="form-label small text-muted">Price</label>
                          <div className="item-price">₹{item.product?.price?.toFixed(2)}</div>
                        </div>
                      </Col>

                      {/* Total & Actions */}
                      <Col xs={3} md={2}>
                        <div className="item-actions text-end">
                          <div className="item-total fw-bold text-primary mb-2">
                            ₹{item.totalPrice?.toFixed(2)}
                          </div>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleRemoveItem(item.product.id)}
                            className="remove-btn"
                          >
                            <FaTrash className="me-1" />
                            Remove
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </Col>

          {/* Order Summary */}
          <Col lg={4} md={12}>
            <div className="order-summary-section sticky-top">
              <Card className="order-summary-card shadow-sm">
                <Card.Header className="bg-primary text-white">
                  <h6 className="mb-0 fw-semibold">
                    <FaTag className="me-2" />
                    Order Summary
                  </h6>
                </Card.Header>
                <Card.Body>
                  {/* Price Breakdown */}
                  <div className="price-breakdown">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Subtotal ({cart.items.length} items):</span>
                      <span>₹{cart.totalAmount?.toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Shipping:</span>
                      <span className="text-success fw-semibold">FREE</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Tax:</span>
                      <span>₹0.00</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between fw-bold text-primary">
                      <span>Total Amount:</span>
                      <span className="h5">₹{cart.totalAmount?.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Savings Alert */}
                  <Alert variant="success" className="savings-alert mt-3">
                    <small>
                      🎉 You're saving ₹{(cart.totalAmount * 0.1).toFixed(2)} on this order!
                    </small>
                  </Alert>

                  {/* Action Buttons */}
                  <div className="cart-actions mt-4">
                    <div className="d-grid mb-3">
                      <Button
                        variant="primary"
                        size="lg"
                        onClick={handlePlaceOrder}
                        className="checkout-btn fw-semibold"
                      >
                        <FaCreditCard className="me-2" />
                        Proceed to Checkout
                      </Button>
                    </div>
                    
                    <div className="d-grid">
                      <Button
                        as={Link}
                        to="/products"
                        variant="outline-primary"
                        className="continue-shopping-btn"
                      >
                        <FaArrowLeft className="me-2" />
                        Continue Shopping
                      </Button>
                    </div>
                  </div>

                  {/* Security Info */}
                  <div className="security-info mt-3 text-center">
                    <small className="text-muted">
                      🔒 Secure checkout guaranteed
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Cart;
