import React, { useState, useEffect } from "react";

const ProductImage = ({ productId, className = "product-image", alt = "Product Image" }) => {
  const [productImg, setProductImg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProductImage = async (id) => {
      try {
        setLoading(true);
        setError(false);
        const response = await fetch(
          `http://localhost:9090/api/v1/images/image/download/${id}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch image');
        }
        
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          setProductImg(reader.result);
          setLoading(false);
        };
        reader.onerror = () => {
          setError(true);
          setLoading(false);
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error("Error fetching image:", error);
        setError(true);
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductImage(productId);
    } else {
      setLoading(false);
      setError(true);
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="image-loading-placeholder">
        <div className="loading-spinner"></div>
        <span>Loading...</span>
      </div>
    );
  }

  if (error || !productImg) {
    return (
      <div className="image-error-placeholder">
        <span>📷</span>
        <span>No Image</span>
      </div>
    );
  }

  return (
    <img 
      src={productImg} 
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setError(true)}
    />
  );
};

export default ProductImage;
