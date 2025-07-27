import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllBrands, addBrand } from "../../store/features/productSlice";

const BrandSelector = ({
  selectedBrand,
  onBrandChange,
  newBrand,
  showNewBrandInput,
  setNewBrand,
  setShowNewBrandInput,
}) => {
  const dispatch = useDispatch();
  const brands = useSelector((state) => state.product.brands);

  useEffect(() => {
    dispatch(getAllBrands());
  }, [dispatch]);

  const handleAddNewBrand = () => {
    if (newBrand !== "") {
      dispatch(addBrand(newBrand));
      onBrandChange(newBrand);
      setNewBrand("");
      setShowNewBrandInput(false);
    }
  };

  const handleBrandChange = (e) => {
    if (e.target.value === "New") {
      setShowNewBrandInput(true);
    } else {
      onBrandChange(e.target.value);
    }
  };

  const handleNewBrandChange = (e) => {
    setNewBrand(e.target.value);
  };

  return (
    <div className='mb-3'>
      <label className='form-label'> Brands :</label>
      <select
        className='form-select'
        required
        value={selectedBrand}
        onChange={handleBrandChange}>
        <option value=''>All Brands</option>
        <option value='New'>Add New Brand</option>
        {brands.map((brand, index) => (
          <option key={index} value={brand}>
            {brand}
          </option>
        ))}
      </select>
      {showNewBrandInput && (
        <div className='input-group'>
          <input
            type='text'
            className='form-control'
            value={newBrand}
            placeholder='Enter new brand'
            onChange={handleNewBrandChange}
          />
          <button
            className='btn btn-secondary btn-sm'
            type='button'
            onClick={handleAddNewBrand}>
            Add Brand
          </button>
        </div>
      )}
    </div>
  );
};

export default BrandSelector;
