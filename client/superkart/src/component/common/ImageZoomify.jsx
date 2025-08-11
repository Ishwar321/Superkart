import React, { useEffect, useState } from "react";
import ImageZoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

const ImageZoomify = ({ productId }) => {
  const [productImg, setProductImg] = useState(null);

  useEffect(() => {
    const fetchProductImage = async (id) => {
      try {
        const response = await fetch(
          `http://localhost:9090/api/v1/images/image/download/${id}`
        );
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          setProductImg(reader.result);
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    if (productId) {
      fetchProductImage(productId);
    }
  }, [productId]);

  if (!productImg) return null;
  return (
    <ImageZoom>
      <img src={productImg} alt='Product image' className='resized-image' />
    </ImageZoom>
  );
};

export default ImageZoomify;
