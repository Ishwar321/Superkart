import React from 'react';
import { Container } from 'react-bootstrap';

const TestComponent = () => {
  console.log('TestComponent rendering - React:', typeof React, React.version);
  console.log('React.useState available:', typeof React.useState);
  
  // Test if useState works
  const [count, setCount] = React.useState(0);
  
  return (
    <Container className="mt-5 text-center">
      <h1>React Test Component</h1>
      <p>Count: {count}</p>
      <button 
        className="btn btn-primary"
        onClick={() => setCount(count + 1)}
      >
        Increment
      </button>
      <p className="mt-3 text-success">React hooks are working!</p>
    </Container>
  );
};

export default TestComponent;
