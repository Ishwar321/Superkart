import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCart,
  getUserCart,
  updateQuantity,
  removeItemFromCart,
} from "../../store/features/cartSlice";
import { Card } from "react-bootstrap";
import ProductImage from "../utils/ProductImage";
import QuantityUpdater from "../utils/QuantityUpdater";
import LoadSpinner from "../common/LoadSpinner";
import { toast, ToastContainer } from "react-toastify";
import { placeOrder } from "../../store/features/orderSlice";

const Cart = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const cartId = useSelector((state) => state.cart.cartId);
  const isLoading = useSelector((state) => state.cart.isLoading);

  useEffect(() => {
    dispatch(getUserCart(userId));
  }, [dispatch, userId]);

  const handleIncreaseQuantity = (itemId) => {
    const item = cart.items.find((item) => item.product.id === itemId);
    if (item && cartId) {
      dispatch(
        updateQuantity({
          cartId,
          itemId,
          newQuantity: item.quantity + 1,
        })
      );
    }
  };

  const handleDecreaseQuantity = (itemId) => {
    const item = cart.items.find((item) => item.product.id === itemId);
    if (item && item.quantity > 1) {
      dispatch(
        updateQuantity({
          cartId,
          itemId,
          newQuantity: item.quantity - 1,
        })
      );
    }
  };

  const handleRemoveItem = (itemId) => {
    try {
      dispatch(removeItemFromCart({ cartId, itemId }));
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handlePlaceOrder = async () => {
    if (cart.items.length > 0) {
      try {
        const result = await dispatch(placeOrder(userId)).unwrap();
        dispatch(clearCart());
        toast.success(result.message);
      } catch (error) {
        toast.error(error.message);
      }
    } else {
      toast.error("Cannot place order on empty cart");
    }
  };

  if (isLoading) return <LoadSpinner />;

  const formatINR = (amount) =>
    "₹" + (isNaN(amount) ? "0.00" : Number(amount).toFixed(2));

  return (
    <div className='container mt-5 mb-5 p-5'>
      <ToastContainer />

      {cart.items.length === 0 ? (
        <h3 className='mb-4 cart-title'>Your cart is empty</h3>
      ) : (
        <div className='d-flex flex-column'>
          <h3 className='mb-4 cart-title'>My Shopping Cart</h3>

          {cart.items.map((item, index) => {
            const product = item.product;
            const price = Number(product?.price || 0);
            const quantity = Number(item?.quantity || 0);
            const total = price * quantity;

            return (
              <Card key={index} className='mb-4'>
                <Card.Body className='d-flex justify-content-between align-items-center shadow'>
                  <div className='d-flex align-items-center'>
                    <Link to={"#"}>
                      <div className='cart-image-container'>
                        {product.images?.length > 0 ? (
                          <ProductImage productId={product.images[0].id} />
                        ) : (
                          <img src='/placeholder.jpg' alt='No Image' width={60} />
                        )}
                      </div>
                    </Link>
                  </div>

                  <div className='text-center'>{product.name}</div>
                  <div className='text-center'>{product.brand}</div>
                  <div className='text-center'>{formatINR(price)}</div>
                  <div className='text-center'>
                    <QuantityUpdater
                      quantity={quantity}
                      onDecrease={() => handleDecreaseQuantity(product.id)}
                      onIncrease={() => handleIncreaseQuantity(product.id)}
                    />
                  </div>
                  <div className='text-center'>{formatINR(total)}</div>
                  <div>
                    <Link to={"#"} onClick={() => handleRemoveItem(product.id)}>
                      <span className='remove-item'>Remove</span>
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            );
          })}

          <hr />

          <div className='cart-footer d-flex align-items-center mt-4'>
            <h4 className='mb-0 cart-title'>
              Total Cart Amount: {formatINR(cart.totalAmount)}
            </h4>
            <div className='ms-auto checkout-links'>
              <Link to={"/products"} className='me-3'>
                Continue Shopping
              </Link>
              <Link to={"#"} onClick={handlePlaceOrder}>
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
