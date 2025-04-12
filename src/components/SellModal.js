import React, { useState } from 'react';
import './BuyModal.css'; // reuse same styles

const SellModal = ({ stock, maxQuantity, onClose, onSell }) => {
  const [quantity, setQuantity] = useState('');

  const handleSell = () => {
    const qty = parseInt(quantity);
    if (!qty || qty <= 0 || qty > maxQuantity) {
      alert(`Enter valid quantity (max ${maxQuantity})`);
      return;
    }

    const price = parseFloat(stock.price);
    const total = qty * price;

    onSell({
      symbol: stock.symbol,
      price,
      quantity: qty,
      total,
    });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Sell {stock.symbol}</h2>
        <p>Current Price: ${stock.price}</p>
        <p>You own: {maxQuantity} shares</p>
        <input
          type="number"
          placeholder="Enter quantity to sell"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <div className="modal-actions">
          <button onClick={handleSell}>Confirm Sell</button>
          <button className="cancel" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default SellModal;
