import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getUserCart } from "../../store/features/cartSlice";
import {
  placeOrder,
  createPaymentIntent,
} from "../../store/features/orderSlice";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { Col, Container, FormGroup, Row, Form, Card, Button, Alert } from "react-bootstrap";
import AddressForm from "../common/AddressForm";
import { toast, ToastContainer } from "react-toastify";
import { cardElementOptions } from "../utils/cardElementOptions";
import { ClipLoader } from "react-spinners";
import { FaCreditCard, FaMoneyBillWave, FaTruck } from "react-icons/fa";
import "./Checkout.css";
import "./Checkout.css";

const Checkout = () => {
  const dispatch = useDispatch();
  const { userId } = useParams();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);

  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card"); // "card" or "cod"

  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [billingAddress, setBillingAddress] = useState({
    street: "",
    city: "",
    state: "",
    country: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleAddressChange = (event) => {
    const { name, value } = event.target;
    setBillingAddress({ ...billingAddress, [name]: value });
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setCardError("");
  };

  useEffect(() => {
    dispatch(getUserCart(userId));
  }, [dispatch, userId]);

  const handleCashOnDeliveryOrder = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      // Place order directly without payment processing for COD
      await dispatch(placeOrder({ 
        userId, 
        paymentMethod: "CASH_ON_DELIVERY",
        paymentStatus: "PENDING",
        orderData: {
          customerInfo: userInfo,
          billingAddress: billingAddress,
          paymentMethod: "Cash on Delivery"
        }
      })).unwrap();
      
      toast.success("Order placed successfully! You will pay on delivery.");
      setTimeout(() => {
        navigate(`/user-profile/${userId}/profile`);
      }, 3000);
    } catch (error) {
      toast.error("Error placing order: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCardPaymentAndOrder = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      toast.error("Stripe is not loaded. Please try again.");
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      const { clientSecret } = await dispatch(
        createPaymentIntent({
          amount: cart.totalAmount,
          currency: "inr",
        })
      ).unwrap();

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: `${userInfo.firstName} ${userInfo.lastName}`,
              email: userInfo.email,
              address: {
                line1: billingAddress.street,
                city: billingAddress.city,
                state: billingAddress.state,
                country: billingAddress.country,
                postal_code: billingAddress.postalCode,
              },
            },
          },
        }
      );

      if (error) {
        toast.error(error.message);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        await dispatch(placeOrder({ 
          userId,
          paymentMethod: "CARD",
          paymentStatus: "COMPLETED",
          paymentIntentId: paymentIntent.id
        })).unwrap();
        toast.success("Payment successful! Your order has been placed.");
        setTimeout(() => {
          navigate(`/user-profile/${userId}/profile`);
        }, 3000);
      }
    } catch (error) {
      toast.error("Error processing payment: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitOrder = (event) => {
    if (paymentMethod === "cod") {
      handleCashOnDeliveryOrder(event);
    } else {
      handleCardPaymentAndOrder(event);
    }
  };

  return (
    <Container className='mt-5 mb-5'>
      <ToastContainer />
      <div className='checkout-header text-center mb-4'>
        <h2 className='fw-bold text-dark'>Secure Checkout</h2>
        <p className='text-muted'>Complete your order safely and securely</p>
      </div>
      
      <Row className='justify-content-center'>
        <Col lg={8} md={10}>
          <Form className='checkout-form p-4 border rounded shadow-sm bg-white'>
            {/* Customer Information */}
            <div className='section-header mb-4'>
              <h5 className='fw-semibold text-dark mb-3'>👤 Customer Information</h5>
              <Row>
                <Col md={6}>
                  <FormGroup className='mb-3'>
                    <label htmlFor='firstName' className='form-label fw-semibold'>
                      First Name *
                    </label>
                    <input
                      type='text'
                      className='form-control'
                      id='firstName'
                      name='firstName'
                      value={userInfo.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                </Col>

                <Col md={6}>
                  <FormGroup className='mb-3'>
                    <label htmlFor='lastName' className='form-label fw-semibold'>
                      Last Name *
                    </label>
                    <input
                      type='text'
                      className='form-control'
                      id='lastName'
                      name='lastName'
                      value={userInfo.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                </Col>
              </Row>

              <FormGroup className='mb-4'>
                <label htmlFor='email' className='form-label fw-semibold'>
                  Email Address *
                </label>
                <input
                  type='email'
                  className='form-control'
                  id='email'
                  name='email'
                  value={userInfo.email}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
            </div>

            {/* Billing Address */}
            <div className='section-header mb-4'>
              <h5 className='fw-semibold text-dark mb-3'>🏠 Billing Address</h5>
              <AddressForm
                onChange={handleAddressChange}
                address={billingAddress}
              />
            </div>

            {/* Payment Method Selection */}
            <div className='section-header mb-4'>
              <h5 className='fw-semibold text-dark mb-3'>💳 Payment Method</h5>
              
              <div className='payment-methods'>
                {/* Credit/Debit Card Option */}
                <div 
                  className={`payment-option p-3 border rounded mb-3 ${paymentMethod === 'card' ? 'border-primary bg-light' : ''}`}
                  onClick={() => handlePaymentMethodChange('card')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className='d-flex align-items-center'>
                    <input
                      type='radio'
                      name='paymentMethod'
                      value='card'
                      checked={paymentMethod === 'card'}
                      onChange={() => handlePaymentMethodChange('card')}
                      className='me-3'
                    />
                    <div className='flex-grow-1'>
                      <div className='d-flex align-items-center'>
                        <FaCreditCard className='text-primary me-2' size={20} />
                        <h6 className='mb-0 fw-semibold'>Credit or Debit Card</h6>
                      </div>
                      <small className='text-muted'>Visa, MasterCard, American Express, and more</small>
                    </div>
                  </div>
                  
                  {paymentMethod === 'card' && (
                    <div className='mt-3'>
                      <label className='form-label fw-semibold'>Card Details</label>
                      <div className='card-element-container p-3 border rounded bg-white'>
                        <CardElement
                          options={cardElementOptions}
                          onChange={(event) => {
                            setCardError(event.error ? event.error.message : "");
                          }}
                        />
                      </div>
                      {cardError && <div className='text-danger mt-2 small'>{cardError}</div>}
                    </div>
                  )}
                </div>

                {/* Cash on Delivery Option */}
                <div 
                  className={`payment-option p-3 border rounded mb-3 ${paymentMethod === 'cod' ? 'border-success bg-light' : ''}`}
                  onClick={() => handlePaymentMethodChange('cod')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className='d-flex align-items-center'>
                    <input
                      type='radio'
                      name='paymentMethod'
                      value='cod'
                      checked={paymentMethod === 'cod'}
                      onChange={() => handlePaymentMethodChange('cod')}
                      className='me-3'
                    />
                    <div className='flex-grow-1'>
                      <div className='d-flex align-items-center'>
                        <FaMoneyBillWave className='text-success me-2' size={20} />
                        <h6 className='mb-0 fw-semibold'>Cash on Delivery</h6>
                      </div>
                      <small className='text-muted'>Pay when your order is delivered to your doorstep</small>
                    </div>
                  </div>
                  
                  {paymentMethod === 'cod' && (
                    <Alert variant='info' className='mt-3 mb-0'>
                      <FaTruck className='me-2' />
                      <strong>Pay on Delivery:</strong> You can pay in cash when the product is delivered to you.
                      Please keep the exact amount ready.
                    </Alert>
                  )}
                </div>
              </div>
            </div>
          </Form>
        </Col>

        {/* Order Summary Sidebar */}
        <Col lg={4} md={10} className='mt-4 mt-lg-0'>
          <Card className='order-summary shadow-sm border-0'>
            <Card.Header className='bg-primary text-white'>
              <h6 className='mb-0 fw-semibold'>📋 Order Summary</h6>
            </Card.Header>
            <Card.Body>
              <div className='order-total mb-3'>
                <div className='d-flex justify-content-between mb-2'>
                  <span>Subtotal:</span>
                  <span>₹{cart.totalAmount?.toFixed(2)}</span>
                </div>
                <div className='d-flex justify-content-between mb-2'>
                  <span>Shipping:</span>
                  <span className='text-success'>FREE</span>
                </div>
                <hr />
                <div className='d-flex justify-content-between fw-bold text-primary'>
                  <span>Total Amount:</span>
                  <span>₹{cart.totalAmount?.toFixed(2)}</span>
                </div>
              </div>

              {paymentMethod === 'cod' && (
                <Alert variant='warning' className='mb-3 small'>
                  <strong>COD Charges:</strong> No extra charges for Cash on Delivery
                </Alert>
              )}

              <div className='d-grid'>
                <Button
                  variant={paymentMethod === 'cod' ? 'success' : 'primary'}
                  size='lg'
                  disabled={(!stripe && paymentMethod === 'card') || loading}
                  onClick={handleSubmitOrder}
                  className='fw-semibold'
                >
                  {loading ? (
                    <>
                      <ClipLoader size={20} color={"#ffffff"} className='me-2' />
                      Processing...
                    </>
                  ) : paymentMethod === 'cod' ? (
                    <>
                      <FaTruck className='me-2' />
                      Place Order (COD)
                    </>
                  ) : (
                    <>
                      <FaCreditCard className='me-2' />
                      Pay ₹{cart.totalAmount?.toFixed(2)}
                    </>
                  )}
                </Button>
              </div>
              
              <div className='security-badges mt-3 text-center'>
                <small className='text-muted d-block mb-2'>🔒 Your payment information is secure</small>
                <div className='d-flex justify-content-center gap-2'>
                  <span className='badge bg-light text-dark'>SSL Protected</span>
                  <span className='badge bg-light text-dark'>256-bit Encryption</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Checkout;
