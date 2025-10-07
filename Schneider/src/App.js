import React, { useState, useEffect } from 'react';
import { Activity, Monitor, BarChart3, Settings, User } from 'lucide-react';
import FloorLayout from './components/FloorLayout';
import PCDetailsModal from './components/PCDetailsModal';
import PCTable from './components/PCTable';
import UserRoleManager from './components/UserRoleManager';
import { getPCStatus, shouldAlertReboot } from './utils/statusUtils';
import Toast from './components/Toast';

const API_BASE_URL = 'http://localhost:3001/api';
const PC_TIMEOUT = 60 * 1000; // 60 seconds

function App() {
  const [userRole, setUserRole] = useState('viewer');
  const [selectedPC, setSelectedPC] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('floor');
  const [moveMode, setMoveMode] = useState(false);
  const [pcs, setPcs] = useState([]);
  const [pcTimestamps, setPcTimestamps] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRoleManager, setShowRoleManager] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Fetch PC data from backend API
  const fetchPCData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/pcs`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPcs(prevPcs => {
        // Update timestamps for each PC
        const now = Date.now();
        const newTimestamps = { ...pcTimestamps };
        data.forEach(pc => {
          newTimestamps[pc.id] = now;
        });
        setPcTimestamps(newTimestamps);
        return data;
      });
      setError(null);
    } catch (err) {
      console.error('Error fetching PC data:', err);
      setError('Failed to fetch PC data. Make sure the backend server is running.');
      setPcs([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and set up polling
  useEffect(() => {
    fetchPCData();
    
    // Poll for updates every 5 seconds
    const interval = setInterval(fetchPCData, 5000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Build toasts for all PCs needing attention
    const newToasts = pcs
      .map(pc => {
        const status = getPCStatus(pc.lastReboot);
        const daysLeft = shouldAlertReboot(pc.lastReboot);
        if (status.status === 'red') {
          return {
            id: pc.id,
            type: 'critical',
            message: `CRITICAL: ${pc.name} (${pc.ipAddress}) has not been rebooted for ${status.days} days! Reboot immediately!`,
          };
        } else if (daysLeft !== null) {
          return {
            id: pc.id,
            type: 'warning',
            message: `WARNING: ${pc.name} (${pc.ipAddress}) has not been rebooted for ${status.days} days. Please reboot within ${daysLeft} days!`,
          };
        }
        return null;
      })
      .filter(Boolean);
    setToasts(newToasts);
  }, [pcs]);

  const handlePCClick = (pc) => {
    setSelectedPC(pc);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPC(null);
  };

  const handleUpdatePC = (updatedPC) => {
    setPcs(prevPCs => 
      prevPCs.map(pc => 
        pc.id === updatedPC.id ? updatedPC : pc
      )
    );
    
    // Update selected PC if it's the one being updated
    if (selectedPC && selectedPC.id === updatedPC.id) {
      setSelectedPC(updatedPC);
    }
  };

  const handleMoveModeChange = (newMoveMode) => {
    setMoveMode(newMoveMode);
    if (!newMoveMode) {
      // Exit move mode - clear any selected PC
      setSelectedPC(null);
    }
  };

  const isAdmin = userRole === 'admin';

  const handleCloseToast = (id) => {
    setToasts((prev) => prev.filter(t => t.id !== id));
  };

  // Helper to get effective status (frontend timeout logic)
  const getEffectiveStatus = (pc) => {
    const now = Date.now();
    const lastSeen = pcTimestamps[pc.id];
    if (lastSeen && (now - lastSeen > PC_TIMEOUT)) {
      return 'offline';
    }
    return pc.status;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading PC data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Toast Notification Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end space-y-2">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            id={toast.id}
            type={toast.type}
            message={toast.message}
            onClose={handleCloseToast}
            duration={6000}
          />
        ))}
      </div>

      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Activity className="w-8 h-8 text-blue-400" />
                <h1 className="text-2xl font-bold text-gray-100">Factory Floor Monitor</h1>
              </div>
              <div className="hidden md:block">
                <span className="text-gray-400 text-sm">Production Line PC Management System</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-400">
                Last updated: {new Date().toLocaleString()}
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                isAdmin ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
              }`}>
                {isAdmin ? 'ADMIN' : 'VIEWER'}
              </div>
              {moveMode && (
                <div className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-600 text-white">
                  MOVE MODE
                </div>
              )}
              <button 
                onClick={() => setShowRoleManager(!showRoleManager)}
                className="p-2 text-gray-400 hover:text-gray-200 transition-colors"
                title="Manage user role"
              >
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* User Role Manager */}
      {showRoleManager && (
        <div className="bg-gray-800 border-b border-gray-700 p-4">
          <div className="max-w-7xl mx-auto">
            <UserRoleManager 
              currentRole={userRole} 
              onRoleChange={setUserRole} 
            />
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('floor')}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'floor'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span>Floor Layout</span>
            </button>
            <button
              onClick={() => setActiveTab('table')}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'table'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>PC Inventory</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-green-500 bg-opacity-20 rounded-lg">
                <Activity className="w-6 h-6 text-status-green" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total PCs</p>
                <p className="text-2xl font-bold text-gray-100">{pcs.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-green-500 bg-opacity-20 rounded-lg">
                <Activity className="w-6 h-6 text-status-green" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Online</p>
                <p className="text-2xl font-bold text-status-green">
                  {pcs.filter(pc => pc.status === 'online').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-500 bg-opacity-20 rounded-lg">
                <Activity className="w-6 h-6 text-status-yellow" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Reboot Due</p>
                <p className="text-2xl font-bold text-status-yellow">
                  {pcs.filter(pc => {
                    const status = getPCStatus(pc.lastReboot);
                    return status.status === 'yellow';
                  }).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-red-500 bg-opacity-20 rounded-lg">
                <Activity className="w-6 h-6 text-status-red" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Critical</p>
                <p className="text-2xl font-bold text-status-red">
                  {pcs.filter(pc => {
                    const status = getPCStatus(pc.lastReboot);
                    return status.status === 'red';
                  }).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'floor' && (
            <FloorLayout
              onPCClick={handlePCClick}
              selectedPC={selectedPC}
              pcs={pcs}
              onUpdatePC={handleUpdatePC}
              userRole={userRole}
              moveMode={moveMode}
              onMoveModeChange={handleMoveModeChange}
              getEffectiveStatus={getEffectiveStatus}
            />
          )}
          
          {activeTab === 'table' && (
            <PCTable
              pcs={pcs}
              onPCClick={handlePCClick}
              userRole={userRole}
              getEffectiveStatus={getEffectiveStatus}
            />
          )}
        </div>
      </main>

      {/* PC Details Modal */}
      {showModal && (
        <PCDetailsModal
          pc={selectedPC}
          onClose={closeModal}
          userRole={userRole}
          onUpdatePC={handleUpdatePC}
          onMoveModeChange={handleMoveModeChange}
        />
      )}
    </div>
  );
}

export default App; 