import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import {
  getProductById,
  updateProduct,
} from "../../store/features/productSlice";
import { deleteProductImage } from "../../store/features/imageSlice";
import LoadSpinner from "../common/LoadSpinner";
import BrandSelector from "../common/BrandSelector";
import CategorySelector from "../common/CategorySelector";
import { toast, ToastContainer } from "react-toastify";
import ProductImage from "../utils/ProductImage";
import ImageUpdater from "../image/ImageUpdater";

const ProductUpdate = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [showNewBrandInput, setShowNewBrandInput] = useState(false);
  const [newBrand, setNewBrand] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const newProductImage = useSelector((state) => state.image.uploadedImages);

  const [updatedProduct, setUpdatedProduct] = useState({
    name: "",
    brand: "",
    price: "",
    inventory: "",
    description: "",
    category: "",
    images: [],
  });

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const result = await dispatch(getProductById(productId)).unwrap();
        setUpdatedProduct(result);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    };
    fetchProduct();
  }, [dispatch, productId, newProductImage]);

  const handleChange = (e) => {
    setUpdatedProduct({
      ...updatedProduct,
      [e.target.name]: e.target.value,
    });
  };

  const handleBrandChange = (brand) => {
    setUpdatedProduct({ ...updatedProduct, brand });
    if (brand === "New") {
      setShowNewBrandInput(true);
    } else {
      setShowNewBrandInput(false);
    }
  };

  const handleCategoryChange = (category) => {
    setUpdatedProduct({ ...updatedProduct, category });
    if (category === "New") {
      setShowNewCategoryInput(true);
    } else {
      setShowNewCategoryInput(false);
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(
        updateProduct({ productId, updatedProduct })
      ).unwrap();
      toast.success(result.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      const result = await dispatch(deleteProductImage({ imageId })).unwrap();
      toast.success(result.message);

      setUpdatedProduct((prevProduct) => ({
        ...prevProduct,
        images: prevProduct.images.filter((image) => image.id !== imageId),
      }));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleImageUpdate = () => {
    dispatch(getProductById(productId));
  };

  const handleEditImage = (imageId) => {
    setSelectedImageId(imageId);
    setShowImageModal(true);
  };

  const handleAddImage = () => {
    setShowImageModal(true);
    setSelectedImageId(null);
  };

  const handleCloseImageModal = () => {
    setShowImageModal(false);
    setSelectedImageId(null);
  };

  if (isLoading) {
    return <LoadSpinner />;
  }

  return (
    <div className='container mt-5 mb-5'>
      <ToastContainer />
      <div className='row'>
        <div className='col-md-6 me-4'>
          <h4 className='mb-4'> Update Product</h4>
          <form onSubmit={handleUpdateProduct}>
            <div className='mb-3'>
              <label className='form-label'>Name :</label>

              <input
                className='form-control'
                type='text'
                id='name'
                name='name'
                value={updatedProduct.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className='mb-3'>
              <label className='form-label'>Price:</label>
              <input
                type='number'
                className='form-control'
                name='price'
                value={updatedProduct.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className='mb-3'>
              <label className='form-label'>Inventory:</label>
              <input
                type='number'
                className='form-control'
                name='inventory'
                value={updatedProduct.inventory}
                onChange={handleChange}
                required
              />
            </div>

            <div className='mb-3'>
              <BrandSelector
                selectedBrand={updatedProduct.brand}
                onBrandChange={handleBrandChange}
                showNewBrandInput={showNewBrandInput}
                setShowNewBrandInput={setShowNewBrandInput}
                newBrand={newBrand}
                setNewBrand={setNewBrand}
              />
            </div>
            <div className='mb-3'>
              <CategorySelector
                selectedCategory={updatedProduct.category.name}
                onCategoryChange={handleCategoryChange}
                showNewCategoryInput={showNewCategoryInput}
                setShowNewCategoryInput={setShowNewCategoryInput}
                newCategory={newCategory}
                setNewCategory={setNewCategory}
              />
            </div>

            <div className='mb-3'>
              <label className='form-label'>Description:</label>
              <textarea
                className='form-control'
                name='description'
                value={updatedProduct.description}
                onChange={handleChange}
                required
              />
            </div>

            <button type='submit' className='btn btn-secondary btn-sm'>
              Save product update
            </button>
          </form>
        </div>

        <div className='col-md-3'>
          <table className='table table-bordered text-center'>
            <tbody>
              {updatedProduct.images.map((image, index) => (
                <tr key={index}>
                  <td className='update-image-container'>
                    <ProductImage productId={image.id} />

                    <div className='d-flex gap-4 mb-2 mt-2'>
                      <Link to={"#"} onClick={() => handleEditImage(image.id)}>
                        edit
                      </Link>
                      <Link
                        to={"#"}
                        onClick={() => handleDeleteImage(image.id)}>
                        remove
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Link to={"#"} onClick={() => handleAddImage(productId)}>
            Add Image
          </Link>
        </div>
      </div>

      <ImageUpdater
        show={showImageModal}
        handleClose={handleCloseImageModal}
        selectedImageId={selectedImageId}
        productId={productId}
      />
    </div>
  );
};

export default ProductUpdate;
