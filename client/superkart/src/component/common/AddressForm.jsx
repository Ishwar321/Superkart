import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Row, Form } from "react-bootstrap";
import { FaCheck, FaTimes } from "react-icons/fa";
import { getCountryNames } from "../../store/features/userSlice";

const AddressForm = ({
  address,
  onChange,
  onSubmit,
  isEditing,
  onCancel,
  showButtons,
  showCheck,
  showTitle,
  showAddressType,
  showPostalCode,
}) => {
  const dispatch = useDispatch();
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      const response = await dispatch(getCountryNames()).unwrap();
      setCountries(response);
    };
    fetchCountries();
  }, [dispatch]);

  return (
    <div className='p-4 m-4 border'>
      {showTitle && <h5>{isEditing ? "Edit Address" : "Add New Address"}</h5>}

      <Row>
        <Col md={6}>
          <Form.Group className='mb-2'>
            <Form.Label>Street</Form.Label>
            <Form.Control
              type='text'
              name='street'
              placeholder='Street'
              value={address.street}
              onChange={onChange}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className='mb-2'>
            <Form.Label>City</Form.Label>
            <Form.Control
              type='text'
              name='city'
              placeholder='City'
              value={address.city}
              onChange={onChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className='mb-2'>
        <Form.Label>State/Province</Form.Label>
        <Form.Control
          type='text'
          name='state'
          placeholder='State'
          value={address.state}
          onChange={onChange}
        />
      </Form.Group>

      <Row>
        <Col md={6}>
          <Form.Group className='mb-2'>
            <Form.Label>Country</Form.Label>
            <Form.Select
              name='country'
              value={address.country}
              onChange={onChange}>
              <option value=''>select country...</option>
              {countries.map((country, index) => (
                <option key={index} value={country.code}>
                  {country.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className='mb-2'>
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type='text'
              name='mobileNumber'
              placeholder='Phone Number'
              value={address.mobileNumber}
              onChange={onChange}
            />
          </Form.Group>
        </Col>
      </Row>

      {showAddressType && (
        <Form.Group className='mb-2'>
          <Form.Label>Address Type</Form.Label>
          <Form.Select
            name='addressType'
            value={address.addressType}
            onChange={onChange}>
            <option value=''>select address type</option>{" "}
            <option value='HOME'>Home</option>
            <option value='OFFICE'>Office</option>
            <option value='SHIPPING'>Shipping</option>
          </Form.Select>
        </Form.Group>
      )}

      {showButtons && (
        <div className='d-flex gap-4 mt-3'>
          {showCheck && (
            <div
              onClick={onSubmit}
              style={{ cursor: "pointer", color: "green" }}>
              <FaCheck
                size={24}
                title={isEditing ? "Update Address" : "Add Address"}
              />
            </div>
          )}

          <div onClick={onCancel} style={{ cursor: "pointer", color: "red" }}>
            <FaTimes size={24} title='Cancel' />
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressForm;
