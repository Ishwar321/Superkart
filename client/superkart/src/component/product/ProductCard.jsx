import React from "react";
import { Card, Badge, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import ProductImage from "../utils/ProductImage";
import StockStatus from "../utils/StockStatus";
import { deleteProduct } from "../../store/features/productSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaEdit, FaTrash, FaShoppingCart, FaStar, FaHeart } from "react-icons/fa";
import "./ProductCard.css";

const ProductCard = ({ products }) => {
  const dispatch = useDispatch();
  const userRoles = useSelector((state) => state.auth.roles);
  const isAdmin = userRoles.includes("ROLE_ADMIN");

  // Format price in INR
  const formatPriceInINR = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleDelete = async (productId) => {
    try {
      const result = await dispatch(deleteProduct(productId)).unwrap();
      toast.success(result.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Helper function to check if product is out of stock
  const isOutOfStock = (product) => {
    // Handle various falsy inventory values
    if (product.inventory === null || product.inventory === undefined || product.inventory === '' || product.inventory === '0') {
      return true;
    }
    return parseInt(product.inventory, 10) <= 0;
  };

  // Helper function to get inventory value
  const getInventoryValue = (product) => {
    if (product.inventory === null || product.inventory === undefined || product.inventory === '') {
      return 0;
    }
    const parsed = parseInt(product.inventory, 10);
    return isNaN(parsed) ? 0 : parsed;
  };

  return (
    <div className="products-grid">
      {products.map((product) => {
        const inventory = getInventoryValue(product);
        const outOfStock = isOutOfStock(product);
        
        // If no valid inventory data is available, assume product is in stock
        const hasValidInventoryData = product.inventory !== null && product.inventory !== undefined && product.inventory !== '';
        const shouldShowOutOfStock = hasValidInventoryData && outOfStock;
        
        return (
        <div key={product.id} className="product-card-container">
          <Card className="product-card h-100 shadow-sm">
            {/* Product Badge */}
            {hasValidInventoryData && !outOfStock && inventory > 0 && inventory < 10 && (
              <Badge bg="warning" className="product-badge">
                Only {inventory} left!
              </Badge>
            )}
            {shouldShowOutOfStock && (
              <Badge bg="danger" className="product-badge">
                Out of Stock
              </Badge>
            )}

            {/* Wishlist Button */}
            <div className="wishlist-btn">
              <FaHeart className="text-muted" />
            </div>

            {/* Product Image */}
            <Link to={`/product/${product.id}/details`} className="product-image-link">
              <div className="product-image-container">
                {product.images.length > 0 ? (
                  <ProductImage productId={product.images[0].id} />
                ) : (
                  <div className="no-image-placeholder">
                    <span>No Image</span>
                  </div>
                )}
              </div>
            </Link>

            <Card.Body className="d-flex flex-column">
              {/* Product Info */}
              <div className="product-info flex-grow-1">
                <Link to={`/product/${product.id}/details`} className="product-title-link">
                  <h6 className="product-title">{product.name}</h6>
                </Link>
                
                <p className="product-description text-muted">
                  {product.description.length > 60 
                    ? `${product.description.substring(0, 60)}...` 
                    : product.description
                  }
                </p>

                {/* Rating */}
                <div className="product-rating mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar 
                      key={i} 
                      className={i < 4 ? "text-warning" : "text-muted"} 
                      size={12}
                    />
                  ))}
                  <span className="rating-text ms-1">4.0 (128)</span>
                </div>

                {/* Price */}
                <div className="product-price mb-2">
                  <span className="current-price">{formatPriceInINR(product.price)}</span>
                  <span className="original-price ms-2">₹{(product.price * 1.2).toFixed(2)}</span>
                  <Badge bg="success" className="discount-badge ms-2">20% OFF</Badge>
                </div>

                {/* Stock Status */}
                <div className="stock-status mb-3">
                  {hasValidInventoryData ? (
                    <StockStatus inventory={inventory} />
                  ) : (
                    <p><span className='text-success'>Available</span></p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="product-actions">
                {/* Admin Actions */}
                {isAdmin && (
                  <div className="admin-actions mb-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      as={Link}
                      to={`/update-product/${product.id}/update`}
                      className="me-2"
                    >
                      <FaEdit className="me-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                    >
                      <FaTrash className="me-1" />
                      Delete
                    </Button>
                  </div>
                )}

                {/* Add to Cart Button */}
                <div className="d-grid">
                  <Button
                    variant="primary"
                    as={Link}
                    to={`/product/${product.id}/details`}
                    className="add-to-cart-btn"
                    disabled={shouldShowOutOfStock}
                  >
                    <FaShoppingCart className="me-2" />
                    {shouldShowOutOfStock ? "Out of Stock" : "View Details"}
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
        );
      })}
    </div>
  );
};

export default ProductCard;
