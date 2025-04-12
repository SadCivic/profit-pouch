import React, { useState } from 'react';
import './BuyModal.css';

const BuyModal = ({ stock, onClose, onBuy }) => {
  const [quantity, setQuantity] = useState('');

  const handleBuy = () => {
    const qty = parseInt(quantity);
    if (!qty || qty <= 0) return alert('Enter valid quantity');

    const price = parseFloat(stock.price);
    const total = qty * price;

    onBuy({
      symbol: stock.symbol,
      price,
      quantity: qty,
      total,
    });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Buy {stock.symbol}</h2>
        <p>Current Price: ${stock.price}</p>
        <input
          type="number"
          placeholder="Enter quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <div className="modal-actions">
          <button onClick={handleBuy}>Confirm Buy</button>
          <button className="cancel" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default BuyModal;
