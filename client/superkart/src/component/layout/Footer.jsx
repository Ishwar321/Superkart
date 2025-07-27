import React, { useEffect } from "react";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getAllCategories } from "../../store/features/categorySlice";
import { useDispatch, useSelector } from "react-redux";

const Footer = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.category.categories);

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  return (
    <footer className='mega-footer'>
      <div className='footer-container'>
        <div className='footer-section'>
          <h3>About Us</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>

        <div className='footer-section'>
          <h3>Category</h3>
          <ul>
            {categories.map((category, index) => (
              <li key={index}>
                <Link to={`/products/category/${category.id}/products`}>{category.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className='footer-section'>
          <h3>Contact</h3>
          <p>Email: info@buynow.com</p>
          <p>Phone: (123) 456-7890</p>
        </div>

        <div className='footer-section'>
          <h3>Follow Us</h3>
          <div className='social-icons'>
            <a
              href='https://facebook.com'
              target='_blank'
              rel='noopener noreferrer'>
              <FaFacebookF />
            </a>
            <a
              href='https://twitter.com'
              target='_blank'
              rel='noopener noreferrer'>
              <FaTwitter />
            </a>
            <a
              href='https://instagram.com'
              target='_blank'
              rel='noopener noreferrer'>
              <FaInstagram />
            </a>
          </div>
        </div>

        <div className='footer-bottom'>
          <p>&copy; 2024 buynow.com. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
