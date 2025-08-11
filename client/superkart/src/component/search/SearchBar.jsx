import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCategories } from "../../store/features/categorySlice";
import {
  setSearchQuery,
  setSelectedCategory,
  clearFilters,
} from "../../store/features/searchSlice";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button, InputGroup } from "react-bootstrap";
import { FaSearch, FaTimes } from "react-icons/fa";

const SearchBar = () => {
  const dispatch = useDispatch();
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const categories = useSelector((state) => state.category.categories);

  const { searchQuery, selectedCategory } = useSelector(
    (state) => state.search
  );

  useEffect(() => {
    if (categoryId && categories.length > 0) {
      const selectedCategory = categories.find(
        (category) => category.id === parseInt(categoryId, 10)
      );

      if (selectedCategory) {
        dispatch(setSelectedCategory(selectedCategory.name));
      } else {
        dispatch(setSelectedCategory("all"));
      }
    }
  }, [categoryId, categories, dispatch]);

  const handleCategoryChange = (e) => {
    dispatch(setSelectedCategory(e.target.value));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const handleSearchQueryChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products/${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/products');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  return (
    <Form onSubmit={handleSearch} className="search-form w-100">
      <div className="d-flex flex-column flex-md-row gap-2">
        {/* Category Selector */}
        <Form.Select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="category-select flex-shrink-0"
          style={{ maxWidth: '150px' }}
          size="sm"
        >
          <option value="all">All Categories</option>
          {categories.map((category, index) => (
            <option key={index} value={category.name}>
              {category.name}
            </option>
          ))}
        </Form.Select>

        {/* Search Input */}
        <InputGroup className="flex-grow-1">
          <Form.Control
            type="text"
            value={searchQuery}
            onChange={handleSearchQueryChange}
            onKeyPress={handleKeyPress}
            placeholder="Search for products, brands, categories..."
            className="search-input"
            size="sm"
          />
          
          {/* Clear Button */}
          {searchQuery && (
            <Button
              variant="outline-secondary"
              onClick={handleClearFilters}
              className="clear-btn"
              size="sm"
              title="Clear search"
            >
              <FaTimes />
            </Button>
          )}
          
          {/* Search Button */}
          <Button
            variant="primary"
            type="submit"
            className="search-btn"
            size="sm"
            title="Search"
          >
            <FaSearch />
          </Button>
        </InputGroup>
      </div>
    </Form>
  );
};

export default SearchBar;
