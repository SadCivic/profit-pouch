// ✅ Transaction History Modal with Table
import React, { useEffect, useState } from 'react';
import './BuyModal.css';

const HistoryModal = ({ onClose }) => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      fetch(`http://localhost:5000/api/transactions/${user.uid}`)
        .then(res => res.json())
        .then(data => setTransactions(data))
        .catch(err => console.error('Error fetching history:', err));
    }
  }, []);

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Transaction History</h2>
        {transactions.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td>{tx.symbol}</td>
                  <td>{tx.type}</td>
                  <td>{tx.quantity}</td>
                  <td>${tx.price}</td>
                  <td>${tx.total}</td>
                  <td>{new Date(tx.date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <button className="cancel" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default HistoryModal;