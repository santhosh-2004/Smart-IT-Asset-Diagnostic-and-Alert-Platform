import React, { useState } from 'react';
import { User } from 'lucide-react';

const UserRoleManager = ({ currentRole, onRoleChange }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdminClick = () => {
    if (currentRole === 'admin') return;
    setShowLogin(true);
    setLoginError('');
    setPassword('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');
    // Only allow password '1234'
    if (password === '1234') {
      onRoleChange('admin');
      setShowLogin(false);
      setPassword('');
    } else {
      setLoginError('Invalid password');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    onRoleChange('viewer');
    setShowLogin(false);
    setPassword('');
    setLoginError('');
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <User className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-100">User Role</h3>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
          currentRole === 'admin' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-600 text-gray-300'
        }`}>
          {currentRole === 'admin' ? 'ADMIN' : 'VIEWER'}
        </div>
      </div>

      {showLogin ? (
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm mb-1">Admin Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoFocus
              disabled={loading}
            />
          </div>
          {loginError && <div className="text-red-400 text-xs">{loginError}</div>}
          <div className="flex space-x-2">
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
              disabled={loading || !password}
            >
              {loading ? 'Logging in...' : 'Login as Admin'}
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded bg-gray-600 text-gray-200 font-semibold hover:bg-gray-700"
              onClick={() => { setShowLogin(false); setPassword(''); setLoginError(''); }}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : currentRole === 'admin' ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <div>
                <div className="text-sm font-semibold text-gray-100">Admin Mode</div>
                <div className="text-xs text-gray-400">Full access - can edit and manage</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-1 rounded text-xs font-medium bg-red-600 text-white hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={handleAdminClick}
          className={`px-3 py-1 rounded text-xs font-medium transition-colors bg-gray-600 text-gray-300 hover:bg-gray-500`}
        >
          Switch to Admin
        </button>
      )}
    </div>
  );
};

export default UserRoleManager; 