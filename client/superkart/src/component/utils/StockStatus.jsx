import React from "react";

const StockStatus = ({ inventory }) => {
  // Handle edge cases for inventory
  const getInventoryValue = () => {
    if (inventory === null || inventory === undefined || inventory === '' || inventory === '0') {
      return 0;
    }
    const parsed = parseInt(inventory, 10);
    return isNaN(parsed) ? 0 : parsed;
  };

  const inventoryCount = getInventoryValue();

  return (
    <p>
      {inventoryCount > 0 ? (
        <span className='text-success'>{inventoryCount} in stock</span>
      ) : (
        <span className='text-danger'>Out of stock</span>
      )}
    </p>
  );
};

export default StockStatus;
