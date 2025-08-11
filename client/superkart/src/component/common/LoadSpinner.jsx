import React from "react";
import { Spinner } from "react-bootstrap";
import "./LoadSpinner.css";

const LoadSpinner = ({ 
  variant = "primary", 
  size = "lg", 
  message = "Loading...",
  fullScreen = false 
}) => {
  return (
    <div
      className={`loading-spinner-container ${fullScreen ? 'fullscreen' : ''}`}
    >
      <div className="spinner-content">
        <Spinner 
          animation='border' 
          variant={variant} 
          size={size}
          className="custom-spinner"
        />
        {message && <p className="loading-message">{message}</p>}
      </div>
    </div>
  );
};

export default LoadSpinner;
