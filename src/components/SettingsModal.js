import React, { useState } from 'react';
import './SettingsModal.css';

const SettingsModal = ({ onClose }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [error, setError] = useState('');

  // Helper function to check if new password is valid
  const isValidPassword = (password) => {
    const regex = /^(?=.*[0-9]).{7,}$/; // At least 7 characters with at least 1 number
    return regex.test(password);
  };

  const handlePasswordChange = () => {
    if (currentPassword !== 'demo123') {
      setError('❌ Current password is incorrect.');
      setPasswordChanged(false);
      return;
    }

    if (!isValidPassword(newPassword)) {
      setError('❌ New password must be at least 7 characters long and contain at least one number.');
      setPasswordChanged(false);
      return;
    }

    setPasswordChanged(true);
    setError('');
    setCurrentPassword('');
    setNewPassword('');
  };

  return (
    <div className="modal-backdrop">
      <div className="settings-modal">
        <h2>Account Info</h2>

        <div className="input-group">
          <label>First Name</label>
          <input value={user.firstname} disabled />
        </div>

        <div className="input-group">
          <label>Last Name</label>
          <input value={user.lastname} disabled />
        </div>

        <div className="input-group">
          <label>Email</label>
          <input value={user.email} disabled />
        </div>

        <h2 style={{ marginTop: '2rem' }}>Change Your Password</h2>

        <div className="input-group">
          <label>Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
          />
        </div>

        <div className="input-group">
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
          />
        </div>

        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        {passwordChanged && <p style={{ color: 'green', textAlign: 'center' }}>✅ Password changed successfully</p>}

        <div className="modal-actions">
          <button onClick={handlePasswordChange}>Save</button>
          <button className="cancel" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
