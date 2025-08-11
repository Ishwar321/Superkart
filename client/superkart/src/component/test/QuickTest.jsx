import React, { useState } from 'react';
import { Container, Card, Button, Alert, Form } from 'react-bootstrap';
import { api } from '../services/api';

const QuickTest = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const createTestUser = async () => {
    setLoading(true);
    try {
      const testUser = {
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        password: "password123",
        addressList: [{
          country: "India",
          state: "Maharashtra",
          city: "Mumbai",
          street: "123 Test Street",
          mobileNumber: "9876543210",
          addressType: "HOME"
        }]
      };
      
      const response = await api.post("/users/add", testUser);
      setResult({ success: true, data: response.data, action: 'User Created' });
    } catch (error) {
      console.error('User creation error:', error);
      setResult({ 
        success: false, 
        error: error.response?.data?.message || error.message,
        status: error.response?.status,
        action: 'User Creation' 
      });
    } finally {
      setLoading(false);
    }
  };

  const loginTestUser = async () => {
    setLoading(true);
    try {
      const response = await api.post("/auth/login", {
        email: "test@example.com",
        password: "password123"
      });
      
      // Store token like the login component does
      localStorage.setItem("authToken", response.data.accessToken);
      const decodedToken = JSON.parse(atob(response.data.accessToken.split('.')[1]));
      localStorage.setItem("userRoles", JSON.stringify(decodedToken.roles));
      localStorage.setItem("userId", decodedToken.id);
      
      setResult({ success: true, data: response.data, action: 'Login' });
    } catch (error) {
      console.error('Login error:', error);
      setResult({ 
        success: false, 
        error: error.response?.data?.message || error.message,
        status: error.response?.status,
        action: 'Login' 
      });
    } finally {
      setLoading(false);
    }
  };

  const testProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get("/products/all");
      setResult({ success: true, data: response.data, action: 'Get Products' });
    } catch (error) {
      console.error('Products error:', error);
      setResult({ 
        success: false, 
        error: error.response?.data?.message || error.message,
        status: error.response?.status,
        action: 'Get Products' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Card>
        <Card.Header>
          <h3>Quick Database & Auth Test</h3>
        </Card.Header>
        <Card.Body>
          <div className="d-flex flex-wrap gap-2 mb-3">
            <Button onClick={createTestUser} disabled={loading} variant="primary">
              Create Test User
            </Button>
            <Button onClick={loginTestUser} disabled={loading} variant="success">
              Login Test User
            </Button>
            <Button onClick={testProducts} disabled={loading} variant="info">
              Test Products API
            </Button>
          </div>

          {result && (
            <Alert variant={result.success ? 'success' : 'danger'}>
              <strong>{result.action} Result:</strong>
              {result.success ? (
                <div>
                  <div>✅ Success!</div>
                  <pre>{JSON.stringify(result.data, null, 2)}</pre>
                </div>
              ) : (
                <div>
                  ❌ Error (Status: {result.status}): {result.error}
                </div>
              )}
            </Alert>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default QuickTest;
