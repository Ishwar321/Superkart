import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { getUserById } from "../../store/features/userSlice";
import { toast, ToastContainer } from "react-toastify";
import { nanoid } from "nanoid";

import { fetchUserOrders } from "../../store/features/orderSlice";
import { Container, Row, Col, Card, ListGroup, Table } from "react-bootstrap";
import placeholder from "../../assets/images/placeholder.png";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import AddressForm from "../common/AddressForm";
import {
  updateAddress,
  addAddress,
  deleteAddress,
  setUserAddresses,
} from "../../store/features/userSlice";

const UserProfile = () => {
  const dispatch = useDispatch();
  const { userId } = useParams();
  const user = useSelector((state) => state.user.user);
  const loading = useSelector((state) => state.order.loading);
  const orders = useSelector((state) => state.order.orders);

  const [isEditing, setIsEditing] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [newAddress, setNewAddress] = useState({
    addressType: "",
    street: "",
    city: "",
    state: "",
    country: "",
    mobileNumber: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  const handleEditClick = (address) => {
    setNewAddress(address);
    setIsEditing(true);
    setEditingAddressId(address.id);
    setShowForm(true);
  };

  const handleAddAddress = async () => {
    const updatedAddressList = [
      ...user.addressList,
      { ...newAddress, id: nanoid() },
    ];

    dispatch(setUserAddresses(updatedAddressList));
    try {
      const response = await dispatch(
        addAddress({ address: newAddress, userId })
      ).unwrap();
      toast.success(response.message);
      resetForm();
    } catch (error) {
      console.error(error);

      dispatch(setUserAddresses(user.addressList));
    }
  };

  const handleUpdateAddress = async (id) => {
    const updatedAddressList = user.addressList.map((address) =>
      address.id === id ? { ...newAddress, id } : address
    );

    dispatch(setUserAddresses(updatedAddressList));

    try {
      const response = await dispatch(
        updateAddress({ id, address: newAddress })
      ).unwrap();
      toast.success(response.message);
      resetForm();
    } catch (error) {
      toast.error(error.message);
      dispatch(setUserAddresses(user.addressList));
    }
  };

  const handleDeleteAddress = async (id) => {
    const updatedAddressList = user.addressList.filter(
      (address) => address.id !== id
    );
    dispatch(setUserAddresses(updatedAddressList));

    try {
      const response = await dispatch(deleteAddress({ id })).unwrap();
      toast.success(response.message);
    } catch (error) {
      toast.error(error.message);
      dispatch(setUserAddresses(user.addressList));
    }
  };

  const resetForm = () => {
    setNewAddress({
      addressType: "",
      street: "",
      city: "",
      state: "",
      country: "",
      mobileNumber: "",
    });
    setShowForm(false);
    setIsEditing(false);
    setEditingAddressId(null);
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (userId) {
        try {
          await dispatch(getUserById(userId)).unwrap();
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchUser();
  }, [userId, dispatch]);

  useEffect(() => {
    dispatch(fetchUserOrders(userId));
  }, [dispatch, userId]);

  return (
    <Container className='mt-5 mb-5'>
      <ToastContainer />
      <h2 className='cart-title'>User Dashboard</h2>
      {user ? (
        <>
          <Row>
            <Col md={4}>
              <Card>
                <Card.Header>Personal User Information</Card.Header>
                <Card.Body className='text-center'>
                  <div className='mb-3'>
                    <img
                      src={user.photo || placeholder}
                      alt='User Photo'
                      style={{ width: "100px", height: "100px" }}
                      className='image-fluid rounded-circle'
                    />
                  </div>

                  <Card.Text>
                    {" "}
                    <strong> Full Name :</strong> {user.firstName}{" "}
                    {user.lastName}
                  </Card.Text>

                  <Card.Text>
                    {" "}
                    <strong> Email :</strong> {user.email}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={8}>
              <Card className='mb-4'>
                <Card.Header>User Addresses</Card.Header>

                <ListGroup variant='flush'>
                  {user.addressList && user.addressList.length > 0 ? (
                    user.addressList.map((address) => (
                      <ListGroup.Item key={address.id}>
                        <Card className='p-2 mb-2 shadow'>
                          <Card.Body>
                            <Card.Text>
                              {" "}
                              {address.addressType} ADDRESS :{" "}
                            </Card.Text>
                            <hr />

                            <Card.Text>
                              {address.street}, {address.city}, {address.state},{" "}
                              {address.country}
                            </Card.Text>
                          </Card.Body>

                          <div className='d-flex gap-4'>
                            <Link>
                              <span
                                className='text-danger'
                                onClick={() => handleDeleteAddress(address.id)}>
                                <FaTrash />
                              </span>
                            </Link>
                            <Link variant='primary'>
                              <span
                                className='text-info'
                                onClick={() => handleEditClick(address)}>
                                <FaEdit />
                              </span>
                            </Link>
                          </div>
                        </Card>
                      </ListGroup.Item>
                    ))
                  ) : (
                    <p> No addresses found</p>
                  )}
                </ListGroup>

                <Link
                  className='mb-2 ms-2'
                  variant='success'
                  onClick={() => {
                    setShowForm(true);
                    setIsEditing(false);
                  }}>
                  <FaPlus />
                </Link>

                {showForm && (
                  <AddressForm
                    address={newAddress}
                    onChange={handleInputChange}
                    onSubmit={
                      isEditing
                        ? () => handleUpdateAddress(editingAddressId)
                        : handleAddAddress
                    }
                    isEditing={isEditing}
                    onCancel={resetForm}
                    showButtons={true}
                    showCheck={true}
                    showTitle={true}
                  />
                )}
              </Card>
            </Col>
          </Row>

          <Row>
            <Col>
              <Card>
                <Card.Header>Orders History</Card.Header>
                <Container className='mt-4'>
                  {Array.isArray(orders) && orders.length === 0 ? (
                    <p>No orders found at the moment.</p>
                  ) : (
                    <Table>
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
                        {Array.isArray(orders) &&
                          orders.map((order, index) => {
                            return (
                              <tr key={index}>
                                <td>{order.id}</td>
                                <td>
                                  {new Date(
                                    order.orderDate
                                  ).toLocaleDateString()}
                                </td>
                                <td>${order.totalAmount?.toFixed(2)}</td>
                                <td>{order.status}</td>
                                <td>
                                  <Table size='sm' striped bordered hover>
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
                                      {Array.isArray(order.items) &&
                                        order.items.map((item, itemIndex) => (
                                          <tr key={itemIndex}>
                                            <td>{item.productId}</td>
                                            <td>{item.productName}</td>
                                            <td>{item.productBrand}</td>
                                            <td>{item.quantity}</td>
                                            <td>${item.price.toFixed(2)}</td>
                                            <td>
                                              $
                                              {(
                                                item.quantity * item.price
                                              ).toFixed(2)}
                                            </td>
                                          </tr>
                                        ))}
                                    </tbody>
                                  </Table>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </Table>
                  )}
                  <div className='mb-2'>
                    <Link to='/products'>Start Shopping </Link>
                  </div>
                </Container>
              </Card>
            </Col>
          </Row>
        </>
      ) : (
        <p>Loading user information....</p>
      )}
    </Container>
  );
};

export default UserProfile;

/* 

Assignment 16:

1. Modify the addres API in our backend to include a phone number;

2. Implement the UserProfile component to displays the following information:

      1.  The user full name and email address;
      2.  The list of user orders with each order information on a separate card.
      3.  The list of user addresses with each address information on a separate card
      with the following options:
        a.  Enable user to remove /delete address.
        b.  Enable user to edit/update address.
        c.  Enable user to add new address


 You don't have to worry about the implementation of(add new address and update the address),
  you just have to indicate these actions with a Link / button on the card. But the
  delete implementation should be done since this is a straigthforward implementation.


Hint:
You may want to take a proper look at the address api implementation at the backend.


Finally, let all your actions and data pass through the redux store ( userProfileSlice ).

Please remember to handle any potential errors or edge cases.

Remember, this is just a basic implementation. You might need to make some adjustments
 and enhancements based on your specific requirements.


Good luck!!!




  <div className='d-flex gap-4'>
                            <Link >
                              <span className='text-danger'>
                                <FaTrash />
                              </span>
                            </Link>
                            <Link  variant='primary'>
                              <span className='text-info'>
                                <FaEdit />
                              </span>
                            </Link>
                          </div>


                             <Link className='mb-2 ms-2'  variant='success'  >
                  <FaPlus />
                </Link>

*/
