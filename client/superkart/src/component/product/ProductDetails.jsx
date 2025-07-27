import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProductById, setQuantity } from "../../store/features/productSlice";
import { useSelector, useDispatch } from "react-redux";
import ImageZoomify from "../common/ImageZoomify";
import QuantityUpdater from "../utils/QuantityUpdater";
import { FaShoppingCart } from "react-icons/fa";
import { addToCart } from "../../store/features/cartSlice";
import { toast, ToastContainer } from "react-toastify";
import StockStatus from "../utils/StockStatus";

const ProductDetails = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  const { product, quantity } = useSelector((state) => state.product);
  const successMessage = useSelector((state) => state.cart.successMessage);
  const errorMessage = useSelector((state) => state.cart.errorMessage);
  const productOutOfStock = product?.inventory <= 0;

  useEffect(() => {
    dispatch(getProductById(productId));
  }, [dispatch, productId]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("You need to be logged in to add items to the cart.");
      return;
    }
    try {
      await dispatch(addToCart({ productId, quantity })).unwrap();
      toast.success(successMessage);
    } catch (error) {     
      toast.error(errorMessage);
    }
  };

  const handleIncreaseQuantity = () => {
    dispatch(setQuantity(quantity + 1));
  };

  const handleDecreaseQuantity = () => {
    dispatch(setQuantity(quantity - 1, 1));
  };

  return (
    <div className='container mt-4 mb-4'>
      <ToastContainer />
      {product ? (
        <div className='row product-details'>
          <div className='col-md-2'>
            {product.images.map((img) => (
              <div key={img.id} className='image-container'>
                <ImageZoomify productId={img.id} />
              </div>
            ))}
          </div>
          <div className='col-md-8 details-container'>
            <h1 className='product-name'>{product.name}</h1>
            <h4 className='price'>${product.price}</h4>
            <p className='product-description'>{product.description}</p>
            <p className='product-name'>Brand: {product.brand}</p>
            <p className='product-name'>
              Rating: <span className='rating'>some stars</span>
            </p>

            <StockStatus inventory={product.inventory} />

            <p>Quantity:</p>
            <QuantityUpdater
              quantity={quantity}
              onDecrease={handleDecreaseQuantity}
              onIncrease={handleIncreaseQuantity}
              disabled={productOutOfStock}
            />
            <div className='d-flex gap-2 mt-3'>
              <button
                className='add-to-cart-button'
                onClick={handleAddToCart}
                disabled={productOutOfStock}>
                {" "}
                <FaShoppingCart /> Add to cart
              </button>
              <button className='buy-now-button' disabled={productOutOfStock}>
                Buy now
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p>No product</p>
      )}
    </div>
  );
};

export default ProductDetails;
