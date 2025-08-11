import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { privateApi } from '../services/api';
import { Container, Card, Button, Alert } from 'react-bootstrap';

const AuthTest = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [authTestResult, setAuthTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testCartEndpoint = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("productId", "1");
      params.append("quantity", "1");
      
      const response = await privateApi.post("/cartItems/item/add", params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      setAuthTestResult({ success: true, data: response.data });
    } catch (error) {
      console.error('Cart test error:', error);
      setAuthTestResult({ 
        success: false, 
        error: error.response?.data?.message || error.message,
        status: error.response?.status 
      });
    } finally {
      setLoading(false);
    }
  };

  const testAuthEndpoint = async () => {
    setLoading(true);
    try {
      const response = await privateApi.get("/users/me"); // This would be a protected endpoint to test auth
      setAuthTestResult({ success: true, data: response.data });
    } catch (error) {
      console.error('Auth test error:', error);
      setAuthTestResult({ 
        success: false, 
        error: error.response?.data?.message || error.message,
        status: error.response?.status 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Card>
        <Card.Header>
          <h3>Authentication Test</h3>
        </Card.Header>
        <Card.Body>
          <div className="mb-3">
            <strong>Redux Auth State:</strong> {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
          </div>
          <div className="mb-3">
            <strong>Token in localStorage:</strong> {localStorage.getItem('authToken') ? 'Present' : 'Not Present'}
          </div>
          <div className="mb-3">
            <strong>User ID in localStorage:</strong> {localStorage.getItem('userId') || 'Not Present'}
          </div>
          
          <div className="d-flex gap-2 mb-3">
            <Button onClick={testCartEndpoint} disabled={loading}>
              Test Cart Endpoint
            </Button>
            <Button onClick={testAuthEndpoint} disabled={loading} variant="secondary">
              Test Auth Endpoint
            </Button>
          </div>

          {authTestResult && (
            <Alert variant={authTestResult.success ? 'success' : 'danger'}>
              <strong>Result:</strong>
              {authTestResult.success ? (
                <div>✅ Success: {JSON.stringify(authTestResult.data, null, 2)}</div>
              ) : (
                <div>
                  ❌ Error (Status: {authTestResult.status}): {authTestResult.error}
                </div>
              )}
            </Alert>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AuthTest;
