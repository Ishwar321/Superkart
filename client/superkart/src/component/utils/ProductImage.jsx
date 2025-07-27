import React, { useState, useEffect } from "react";

const ProductImage = ({ productId }) => {
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
    <div>
      <img src={productImg} alt='Product Image' />
    </div>
  );
};

export default ProductImage;
