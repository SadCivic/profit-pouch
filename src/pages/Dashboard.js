import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import BuyModal from '../components/BuyModal';
import SellModal from '../components/SellModal';
import HistoryModal from '../components/HistoryModal'; // ✅ NEW
import SettingsModal from '../components/SettingsModal'; // ✅ NEW

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [stocks, setStocks] = useState([]);
  const [ownedStocks, setOwnedStocks] = useState([]);
  const [holdingsMap, setHoldingsMap] = useState({});
  const [selectedBuy, setSelectedBuy] = useState('');
  const [selectedSell, setSelectedSell] = useState('');
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [selectedStockInfo, setSelectedStockInfo] = useState(null);

  // ✅ New modal states
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const API_KEY = '7b85fa44e1d34e52b5e0dc3bf756c809';

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      fetch(`http://localhost:5000/api/transactions/${parsedUser.uid}`)
        .then((res) => res.json())
        .then((data) => {
          const owned = {};
          data.forEach((tx) => {
            const symbol = tx.symbol;
            if (!owned[symbol]) owned[symbol] = 0;
            owned[symbol] += tx.type === 'buy' ? tx.quantity : -tx.quantity;
          });
          const filtered = Object.entries(owned).filter(([_, qty]) => qty > 0);
          setOwnedStocks(filtered.map(([symbol]) => symbol));
          setHoldingsMap(owned);
        });
    }

    const fetchStocks = async () => {
      try {
        const res = await fetch(`https://api.twelvedata.com/price?symbol=AAPL,MSFT,GOOGL&apikey=${API_KEY}`);
        const data = await res.json();
        const stockArray = Object.entries(data).map(([symbol, info]) => ({
          symbol,
          price: info.price,
        }));
        setStocks(stockArray);
      } catch (err) {
        console.error('Error fetching stock data:', err);
      }
    };

    fetchStocks();
  }, []);

  // BUY
  const handleBuyClick = () => {
    const info = stocks.find(s => s.symbol === selectedBuy);
    setSelectedStockInfo(info);
    setShowBuyModal(true);
  };

  const handleBuy = async ({ symbol, price, quantity, total }) => {
    if (!user) return alert('User not found');

    const transaction = {
      userId: user.uid,
      symbol,
      price,
      quantity,
      total,
      type: 'buy',
      timestamp: new Date()
    };

    try {
      const res = await fetch('http://localhost:5000/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction)
      });

      if (res.ok) {
        alert('✅ Purchase successful!');
        setShowBuyModal(false);
        setSelectedBuy('');
        window.location.reload();
      } else {
        alert('❌ Failed to record transaction');
      }
    } catch (err) {
      console.error('Buy error:', err);
      alert('❌ Network error');
    }
  };

  // SELL
  const handleSellClick = () => {
    const info = stocks.find(s => s.symbol === selectedSell);
    setSelectedStockInfo(info);
    setShowSellModal(true);
  };

  const handleSell = async ({ symbol, price, quantity, total }) => {
    if (!user) return alert('User not found');

    const transaction = {
      userId: user.uid,
      symbol,
      price,
      quantity,
      total,
      type: 'sell',
      timestamp: new Date()
    };

    try {
      const res = await fetch('http://localhost:5000/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction)
      });

      if (res.ok) {
        alert('✅ Sale successful!');
        setShowSellModal(false);
        setSelectedSell('');
        window.location.reload();
      } else {
        alert('❌ Failed to record sell');
      }
    } catch (err) {
      console.error('Sell error:', err);
      alert('❌ Network error');
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      {user && <p className="welcome">Welcome, {user.firstname} {user.lastname}!</p>}

      {/* Buy Section */}
      <div className="section">
        <h2>Available Stocks</h2>
        <select onChange={(e) => setSelectedBuy(e.target.value)} value={selectedBuy}>
          <option value="" disabled>Select stock to buy</option>
          {stocks.map((stock) => (
            <option key={stock.symbol} value={stock.symbol}>
              {stock.symbol} - ${stock.price}
            </option>
          ))}
        </select>
        <button disabled={!selectedBuy} onClick={handleBuyClick}>Buy</button>
      </div>

      {/* Sell Section */}
      <div className="section">
        <h2>Your Holdings</h2>
        {ownedStocks.length === 0 ? (
          <p>You don’t own any stocks yet.</p>
        ) : (
          <>
            <select onChange={(e) => setSelectedSell(e.target.value)} value={selectedSell}>
              <option value="" disabled>Select stock to sell</option>
              {ownedStocks.map((symbol) => (
                <option key={symbol} value={symbol}>{symbol}</option>
              ))}
            </select>
            <button disabled={!selectedSell} onClick={handleSellClick}>Sell</button>
          </>
        )}
      </div>

      {/* New Buttons */}
      <div className="section">
        <button onClick={() => setShowHistoryModal(true)}>📜 View Transaction History</button>
        <button onClick={() => setShowSettingsModal(true)}>⚙️ Settings</button>
      </div>

      {/* Buy Modal */}
      {showBuyModal && selectedStockInfo && (
        <BuyModal
          stock={selectedStockInfo}
          onClose={() => setShowBuyModal(false)}
          onBuy={handleBuy}
        />
      )}

      {/* Sell Modal */}
      {showSellModal && selectedStockInfo && (
        <SellModal
          stock={selectedStockInfo}
          maxQuantity={holdingsMap[selectedStockInfo.symbol] || 0}
          onClose={() => setShowSellModal(false)}
          onSell={handleSell}
        />
      )}

      {/* Transaction History Modal */}
      {showHistoryModal && (
        <HistoryModal onClose={() => setShowHistoryModal(false)} />
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <SettingsModal onClose={() => setShowSettingsModal(false)} />
      )}
    </div>
  );
};

export default Dashboard;
