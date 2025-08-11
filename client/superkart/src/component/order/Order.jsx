import React, { useEffect } from "react";
import { fetchUserOrders } from "../../store/features/orderSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const Order = () => {
  const dispatch = useDispatch();
  const { userId } = useParams();

  const orders = useSelector((state) => state.order.orders || []);
  const loading = useSelector((state) => state.order.loading);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserOrders(userId));
    }
  }, [dispatch, userId]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className='container mt-5'>
      <ToastContainer />
      <div className='row'>
        <div className='col-4'>
          <h3 className='mb-4 cart-title'>My Order History</h3>
        </div>
      </div>

      {orders.length === 0 ? (
        <p>No orders found at the moment.</p>
      ) : (
        <table className='table'>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Items</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => {
              if (!order) return null;

              return (
                <tr key={index}>
                  <td>{order.id || "N/A"}</td>
                  <td>
                    {order.orderDate
                      ? new Date(order.orderDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>₹{order.totalAmount?.toFixed(2) || "0.00"}</td>
                  <td>{order.status || "Pending"}</td>
                  <td>
                    <table className='table table-sm table-bordered table-striped table-hover'>
                      <thead>
                        <tr>
                          <th>Item ID</th>
                          <th>Name</th>
                          <th>Brand</th>
                          <th>Quantity</th>
                          <th>Unit Price</th>
                          <th>Total Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items && order.items.length > 0 ? (
                          order.items.map((item, itemIndex) => (
                            <tr key={itemIndex}>
                              <td>{item.productId || "N/A"}</td>
                              <td>{item.productName || "N/A"}</td>
                              <td>{item.productBrand || "N/A"}</td>
                              <td>{item.quantity || 0}</td>
                              <td>₹{item.price?.toFixed(2) || "0.00"}</td>
                              <td>
                                ₹
                                {item.quantity && item.price
                                  ? (item.quantity * item.price).toFixed(2)
                                  : "0.00"}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan='6'>No items in this order.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <div className='mb-2'>
        <Link to={"/products"}>Start Shopping</Link>
      </div>
    </div>
  );
};

export default Order;
