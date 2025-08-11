import React, { useEffect } from "react";
import { Container, Navbar, Nav, NavDropdown, Badge, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUser, FaSearch, FaHome, FaCog, FaFire, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getUserCart } from "../../store/features/cartSlice";
import { logoutUser } from "../services/AuthService";
import SearchBar from "../search/SearchBar";

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userRoles = useSelector((state) => state.auth.roles);
  const userId = localStorage.getItem("userId");
  const cart = useSelector((state) => state.cart);

  const handleLogout = () => {
    logoutUser();
  };

  useEffect(() => {
    if (userId) {
      dispatch(getUserCart(userId));
    }
  }, [dispatch, userId]);

  return (
    <>
      {/* Top Bar */}
      <div className="top-bar bg-light border-bottom">
        <Container>
          <div className="d-flex justify-content-between align-items-center py-2">
            <div className="d-flex align-items-center">
              <small className="text-muted me-3">
                <span>📞</span> Customer Care: 1800-XXX-XXXX
              </small>
              <small className="text-muted">
                <span>📧</span> support@superkart.com
              </small>
            </div>
            <div className="d-flex align-items-center">
              <small className="text-muted me-2">
                <span>🚚</span> Free Shipping on Orders Above ₹999
              </small>
              <small className="text-muted">
                <span>⚡</span> 24/7 Support
              </small>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Navigation */}
      <Navbar 
        expand='lg' 
        sticky='top' 
        className='main-navbar shadow-sm'
        style={{
          background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
          padding: '1rem 0'
        }}
      >
        <Container>
          <Navbar.Brand to={"/"} as={Link} className="brand-logo">
            <div className='d-flex align-items-center'>
              <div className="logo-icon me-2">
                🛒
              </div>
              <div>
                <div className='brand-name'>SuperKart</div>
                <small className='brand-tagline'>Your Shopping Paradise</small>
              </div>
            </div>
          </Navbar.Brand>

          <Navbar.Toggle className="custom-toggler" aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav">{/* Responsive Search Bar */}
            <div className="search-container mx-auto d-lg-block d-none" style={{ maxWidth: '600px', width: '100%' }}>
              <SearchBar />
            </div>

            <Nav className='ms-auto d-flex align-items-center'>
              {/* Mobile Search Bar */}
              <div className="search-container d-lg-none w-100 mb-3">
                <SearchBar />
              </div>

              {/* Navigation Links */}
              <Nav.Link to={"/"} as={Link} className="nav-item-custom me-2">
                <FaHome className="me-1" />
                <span className="d-none d-md-inline">Home</span>
              </Nav.Link>
              
              <Nav.Link to={"/products"} as={Link} className="nav-item-custom me-2">
                <FaSearch className="me-1" />
                <span className="d-none d-md-inline">Products</span>
              </Nav.Link>

              {/* Admin Panel */}
              {userRoles.includes("ROLE_ADMIN") && (
                <>
                  <Nav.Link to={"/add-product"} as={Link} className="nav-item-custom me-2">
                    <FaCog className="me-1" />
                    <span className="d-none d-md-inline">Manage Products</span>
                  </Nav.Link>
                  <Nav.Link to={"/admin/orders"} as={Link} className="nav-item-custom me-2">
                    <FaCog className="me-1" />
                    <span className="d-none d-md-inline">View Orders</span>
                  </Nav.Link>
                </>
              )}

              {/* Spacer to push content to right */}
              <div className="ms-auto"></div>

              {/* Shopping Cart */}
              {userId && (
                <Link
                  to={`/user/${userId}/my-cart`}
                  className='nav-link cart-link position-relative me-3'
                  style={{ textDecoration: 'none' }}
                >
                  <div className="cart-icon-container">
                    <FaShoppingCart className='shopping-cart-icon' size={20} />
                    {cart.items && cart.items.length > 0 && (
                      <Badge 
                        bg="danger" 
                        className="cart-badge position-absolute"
                        style={{
                          top: '-8px',
                          right: '-8px',
                          fontSize: '0.75rem',
                          minWidth: '20px',
                          borderRadius: '50%'
                        }}
                      >
                        {cart.items.length}
                      </Badge>
                    )}
                  </div>
                  <small className="d-none d-lg-block text-white mt-1">Cart</small>
                </Link>
              )}

              {/* Account Dropdown */}
              <NavDropdown 
                title={
                  <span className="account-dropdown">
                    <FaUser className="me-1" />
                    <span className="d-none d-md-inline">Account</span>
                  </span>
                }
                className="account-dropdown-container"
                align="end"
              >
                {userId ? (
                  <>
                    <NavDropdown.Item
                      to={`/user-profile/${userId}/profile`}
                      as={Link}
                      className="dropdown-item-custom"
                    >
                      <FaUser className="me-2" />
                      My Profile
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item 
                      href="#"
                      onClick={handleLogout}
                      className="dropdown-item-custom logout-item"
                    >
                      🚪 Logout
                    </NavDropdown.Item>
                  </>
                ) : (
                  <>
                    <NavDropdown.Item to={"/register"} as={Link} className="dropdown-item-custom">
                      <FaUserPlus className="me-2" />
                      Sign Up
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item to={"/login"} as={Link} className="dropdown-item-custom">
                      <FaSignInAlt className="me-2" />
                      Sign In
                    </NavDropdown.Item>
                  </>
                )}
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default NavBar;
