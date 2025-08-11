import React, { useEffect, useState } from "react";
import { Row, Button, Form, Col, Container } from "react-bootstrap";
import { registerUser } from "../../store/features/userSlice";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import AddressForm from "../common/AddressForm";

const UserRegistration = () => {
  const dispatch = useDispatch();

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [addresses, setAddresses] = useState([
    {
      country: "",
      state: "",
      city: "",
      street: "",
      mobileNumber: "",
      addressType: "HOME",
    },
  ]);

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleAddressChange = (index, e) => {
    const { name, value } = e.target;
    const updatedAddresses = [...addresses];
    updatedAddresses[index] = { ...updatedAddresses[index], [name]: value };
    setAddresses(updatedAddresses);
  };

  const addAddress = () => {
    setAddresses([
      ...addresses,
      {
        country: "",
        state: "",
        city: "",
        street: "",
        mobileNumber: "",
        addressType: "HOME",
      },
    ]);
  };

  const removeAddress = (index) => {
    const updatedAddresses = addresses.filter((_, i) => i !== index);
    setAddresses(updatedAddresses);
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    try {
      const response = await dispatch(
        registerUser({ user, addresses })
      ).unwrap();
      resetForm();
      toast.success(response.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const resetForm = () => {
    setUser({ firstName: "", lastName: "", email: "", password: "" });
    setAddresses([
      {
        country: "",
        state: "",
        city: "",
        street: "",
        mobileNumber: "",
        addressType: "HOME",
      },
    ]);
  };

  return (
    <Container className='d-flex justify-content-center align-items-center mt-5 mb-5'>
      <ToastContainer />
      <Form
        onSubmit={handleRegistration}
        className='border p-4 rounded shadow'
        style={{ width: "100%", maxWidth: "600px" }}>
        <h3 className='mb-4 text-center'>User Registration</h3>
        <Row>
          <Col md={6}>
            <Form.Group controlId='firstName'>
              <Form.Label>First Name:</Form.Label>
              <Form.Control
                type='text'
                name='firstName'
                value={user.firstName}
                onChange={handleUserChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId='lastName'>
              <Form.Label>Last Name:</Form.Label>
              <Form.Control
                type='text'
                name='lastName'
                value={user.lastName}
                onChange={handleUserChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group controlId='email'>
          <Form.Label>Email:</Form.Label>
          <Form.Control
            type='email'
            name='email'
            value={user.email}
            onChange={handleUserChange}
            required
          />
        </Form.Group>
        <Form.Group controlId='password'>
          <Form.Label>Password:</Form.Label>
          <Form.Control
            className='form-control'
            type='password'
            name='password'
            value={user.password}
            onChange={handleUserChange}
            required
          />
        </Form.Group>
        <h4 className='mt-4'>Addresses</h4>
        {addresses.map((address, index) => (
          <div key={index} className='border p-3 mb-3 rounded'>
            <h4>Address {index + 1}</h4>
            <AddressForm
              address={address}
              onChange={(e) => handleAddressChange(index, e)}
              onCancel={() => removeAddress(index)}
              showButtons={true}
              showAddressType={true}
            />
          </div>
        ))}
        <div className='d-flex gap-4 mb-2 mt-2'>
          <Button variant='success' type='submit' size='sm'>
            Register
          </Button>
          <Button variant='primary' onClick={addAddress} size='sm'>
            Add Address
          </Button>
        </div>
        <div className='text-center mt-4 mb-4'>
          Have an account already?{" "}
          <Link to={"/login"} style={{ textDecoration: "none" }}>
            Login here
          </Link>
        </div>
      </Form>
    </Container>
  );
};

export default UserRegistration;
