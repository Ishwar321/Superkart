import React from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';

// Error boundary component
class ProductsErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Products component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container className="mt-5">
          <Alert variant="danger">
            <Alert.Heading>Something went wrong!</Alert.Heading>
            <p>
              There was an error loading the products page. Please try refreshing the page.
            </p>
            <p><strong>Error:</strong> {this.state.error?.message}</p>
          </Alert>
        </Container>
      );
    }

    return this.props.children;
  }
}

// Products component with enhanced error handling
const ProductsComponent = () => {
  // Defensive React hooks usage
  let useState, useEffect, useDispatch, useSelector;
  
  try {
    useState = React.useState;
    useEffect = React.useEffect;
    
    // Import hooks dynamically to catch import errors
    const { useDispatch: reduxUseDispatch, useSelector: reduxUseSelector } = require('react-redux');
    useDispatch = reduxUseDispatch;
    useSelector = reduxUseSelector;
    
    const { useParams, useLocation } = require('react-router-dom');
    
    if (!useState || !useEffect || !useDispatch || !useSelector) {
      throw new Error('React hooks are not available');
    }
  } catch (error) {
    console.error('Error importing hooks:', error);
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <Alert.Heading>React Hooks Error</Alert.Heading>
          <p>There was an error importing React hooks. This might be due to:</p>
          <ul>
            <li>Multiple React instances</li>
            <li>Incorrect React version</li>
            <li>Import path issues</li>
          </ul>
          <p><strong>Error:</strong> {error.message}</p>
        </Alert>
      </Container>
    );
  }

  // Local state
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Products component mounted successfully');
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <h1>Products Page</h1>
          <p>React hooks are working correctly!</p>
          <p>Filtered products count: {filteredProducts.length}</p>
        </Col>
      </Row>
    </Container>
  );
};

// Main Products component wrapped with error boundary
const Products = () => {
  return (
    <ProductsErrorBoundary>
      <ProductsComponent />
    </ProductsErrorBoundary>
  );
};

export default Products;
