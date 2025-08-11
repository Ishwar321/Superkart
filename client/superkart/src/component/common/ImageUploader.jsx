import React, { useState, useRef } from "react";
import { nanoid } from "nanoid";
import { uploadImages } from "../../store/features/imageSlice";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "@mui/material";
import { BsPlus, BsDash } from "react-icons/bs";
import { useDispatch } from "react-redux";

const ImageUploader = ({ productId }) => {
  const dispatch = useDispatch();
  const fileInputRefs = useRef([]);

  const [images, setImages] = useState([]);
  const [imageInputs, setImageInputs] = useState([{ id: nanoid() }]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      id: nanoid(),
      name: file.name,
      file,
    }));
    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  const handleAddImageInput = () => {
    setImageInputs((prevInputs) => [...prevInputs, { id: nanoid() }]);
  };

  const handleRemoveImageInput = (id) => {
    setImageInputs(imageInputs.filter((input) => input.id !== id));
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!productId) {
      return;
    }
    if (Array.isArray(images) && images.length > 0) {
      try {
        const result = await dispatch(uploadImages({ productId, files: images.map((image) => image.file) })
        ).unwrap();
        clearFileInputs();
        toast.success(result.message);
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const clearFileInputs = () => {
    fileInputRefs.current.forEach((input) => {
      if (input) input.value = null;
    });
  };

  return (
    <form onSubmit={handleImageUpload}>
      <div className='mt-4'>
        <h5>Upload product image (s)</h5>

        <Link to={"#"} onClick={handleAddImageInput}>
          <BsPlus className='icon' /> Add More Images
        </Link>

        <div className='mb-2 mt-2'>
          {imageInputs.map((input, index) => (
            <div
              key={input.id}
              className='d-flex align-items-center mb-2 input-group'>
              <input
                type='file'
                multiple
                accept='image/*'
                onChange={handleImageChange}
                className='me-2 form-control'
                ref={(el) => (fileInputRefs.current[index] = el)}
              />
              <button
                className='btn btn-danger'
                onClick={() => handleRemoveImageInput(input.id)}>
                <BsDash />
              </button>
            </div>
          ))}
        </div>

        {imageInputs.length > 0 && (
          <button type='submit' className='btn btn-primary btn-sm'>
            Upload Images
          </button>
        )}
      </div>
    </form>
  );
};

export default ImageUploader;
