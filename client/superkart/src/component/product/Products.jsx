import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useSearchParams, useLocation } from 'react-router-dom';
import { Container, Row, Col, Button, Dropdown, Badge } from 'react-bootstrap';
import ProductCard from './ProductCard';
import SideBar from '../common/SideBar';
import Paginator from '../common/Paginator';
import NoProductsAvailable from '../common/NoProductsAvailable';
import LoadSpinner from '../common/LoadSpinner';
import { getAllProducts, getProductsByCategory, getDistinctProductsByName } from '../../store/features/productSlice';
import { setInitialSearchQuery } from '../../store/features/searchSlice';
import { FaThLarge, FaList, FaFilter, FaSort } from 'react-icons/fa';
import './Products.css';

const Products = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { name, categoryId } = useParams();
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);
  
  const {
    products,
    isLoading,
    errorMessage,
    distinctProducts
  } = useSelector((state) => state.product);

  const { searchQuery } = useSelector((state) => state.search);

  useEffect(() => {
    console.log('Products component - Route params:', { name, categoryId });
    console.log('Products component - Current path:', location.pathname);
    
    if (name) {
      // Handle /products/:name route - search by product name
      console.log('Searching for products with name:', name);
      dispatch(setInitialSearchQuery(decodeURIComponent(name)));
      dispatch(getAllProducts()); // Get all products first, then filter by name
    } else if (categoryId) {
      // Handle /products/category/:categoryId/products/ route
      console.log('Getting products for category:', categoryId);
      dispatch(getProductsByCategory(categoryId));
    } else {
      // Handle /products route - get all products
      console.log('Getting all products');
      dispatch(getAllProducts());
    }
  }, [dispatch, name, categoryId, location.pathname]);

  if (isLoading) {
    return <LoadSpinner message="Loading products..." />;
  }

  if (errorMessage) {
    return (
      <Container className="mt-5">
        <div className="alert alert-danger">
          Error loading products: {errorMessage}
        </div>
      </Container>
    );
  }

  // Filter and sort products
  let displayProducts = products || [];
  let pageTitle = 'All Products';
  let pageSubtitle = 'Discover our complete collection of quality products';

  if (name) {
    const searchTerm = decodeURIComponent(name).toLowerCase();
    displayProducts = products.filter(product => 
      product.name && product.name.toLowerCase().includes(searchTerm)
    );
    pageTitle = `Search Results`;
    pageSubtitle = `Found ${displayProducts.length} products for "${decodeURIComponent(name)}"`;
  } else if (categoryId) {
    pageTitle = 'Category Products';
    pageSubtitle = `Explore products in this category`;
  }

  // Sort products
  const sortProducts = (products, sortBy) => {
    const sorted = [...products];
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      default:
        return sorted;
    }
  };

  displayProducts = sortProducts(displayProducts, sortBy);

  return (
    <div className="products-page">
      {/* Page Header */}
      <div className="products-header">
        <Container>
          <div className="header-content">
            <div className="header-text">
              <h1 className="page-title">{pageTitle}</h1>
              <p className="page-subtitle">{pageSubtitle}</p>
            </div>
            <div className="header-stats">
              <Badge bg="primary" className="product-count">
                {displayProducts.length} Products
              </Badge>
            </div>
          </div>
        </Container>
      </div>

      <Container fluid className="products-content">
        <Row>
          {/* Sidebar */}
          <Col lg={3} md={4} className={`sidebar-col ${showFilters ? 'show-mobile' : ''}`}>
            <div className="products-sidebar">
              <div className="sidebar-header">
                <h5>
                  <FaFilter className="me-2" />
                  Filters
                </h5>
                <Button 
                  variant="outline-secondary" 
                  size="sm"
                  className="d-md-none"
                  onClick={() => setShowFilters(false)}
                >
                  ✕
                </Button>
              </div>
              <SideBar />
            </div>
          </Col>

          {/* Main Content */}
          <Col lg={9} md={8}>
            <div className="products-main">
              {/* Toolbar */}
              <div className="products-toolbar">
                <div className="toolbar-left">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="d-md-none filter-toggle"
                    onClick={() => setShowFilters(true)}
                  >
                    <FaFilter className="me-2" />
                    Filters
                  </Button>
                  
                  <div className="view-controls d-none d-md-flex">
                    <Button
                      variant={viewMode === 'grid' ? 'primary' : 'outline-secondary'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                    >
                      <FaThLarge />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'primary' : 'outline-secondary'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                    >
                      <FaList />
                    </Button>
                  </div>
                </div>

                <div className="toolbar-right">
                  <Dropdown>
                    <Dropdown.Toggle variant="outline-secondary" size="sm">
                      <FaSort className="me-2" />
                      Sort by: {sortBy === 'relevance' ? 'Relevance' : 
                               sortBy === 'price-low' ? 'Price: Low to High' :
                               sortBy === 'price-high' ? 'Price: High to Low' :
                               sortBy === 'name' ? 'Name' : 'Newest First'}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => setSortBy('relevance')}>
                        Relevance
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => setSortBy('price-low')}>
                        Price: Low to High
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => setSortBy('price-high')}>
                        Price: High to Low
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => setSortBy('name')}>
                        Name A-Z
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => setSortBy('newest')}>
                        Newest First
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>

              {/* Products Grid */}
              <div className="products-container">
                {isLoading ? (
                  <div className="loading-container">
                    <LoadSpinner message="Loading amazing products..." />
                  </div>
                ) : errorMessage ? (
                  <div className="error-container">
                    <div className="alert alert-danger">
                      <h5>Oops! Something went wrong</h5>
                      <p>Error loading products: {errorMessage}</p>
                      <Button variant="primary" onClick={() => window.location.reload()}>
                        Try Again
                      </Button>
                    </div>
                  </div>
                ) : displayProducts && displayProducts.length > 0 ? (
                  <div className={`products-view ${viewMode}-view`}>
                    <ProductCard products={displayProducts} />
                  </div>
                ) : (
                  <div className="no-products-container">
                    <NoProductsAvailable 
                      message={
                        name 
                          ? `No products found for "${decodeURIComponent(name)}". Try different keywords or browse our categories.`
                          : categoryId 
                            ? "No products found in this category. Check back soon for new arrivals!"
                            : "No products available at the moment. Our team is working to add more amazing products!"
                      } 
                    />
                  </div>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Mobile Filter Overlay */}
      {showFilters && (
        <div className="mobile-filter-overlay" onClick={() => setShowFilters(false)} />
      )}
    </div>
  );
};

export default Products;
