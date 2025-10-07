import React, { useState } from 'react';
import { X, Monitor, Cpu, HardDrive, Clock, Wifi, Power, Settings, Eye, Calendar, Save, Move } from 'lucide-react';
import { getPCStatus, formatDate } from '../utils/statusUtils';

const PCDetailsModal = ({ pc, onClose, userRole, onUpdatePC, onMoveModeChange }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [newRebootDate, setNewRebootDate] = useState(pc.lastReboot);
  const [isUpdating, setIsUpdating] = useState(false);
  
  if (!pc) return null;
  
  const status = getPCStatus(pc.lastReboot);
  const isAdmin = userRole === 'admin';

  const handleUpdateRebootDate = async () => {
    if (!isAdmin) return;
    
    setIsUpdating(true);
    
    // Simulate API call to update database
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the PC data
      const updatedPC = {
        ...pc,
        lastReboot: newRebootDate
      };
      
      // Call the parent function to update the PC
      onUpdatePC(updatedPC);
      
      setShowDatePicker(false);
      setIsUpdating(false);
      
      // Show success message
      alert(`Successfully updated reboot date for ${pc.name} to ${formatDate(newRebootDate)}`);
      
    } catch (error) {
      setIsUpdating(false);
      alert('Failed to update reboot date. Please try again.');
    }
  };

  const handleRebootNow = async () => {
    if (!isAdmin) return;
    
    setIsUpdating(true);
    
    try {
      // Simulate API call to reboot PC
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Set reboot date to now
      const now = new Date().toISOString();
      const updatedPC = {
        ...pc,
        lastReboot: now
      };
      
      onUpdatePC(updatedPC);
      setIsUpdating(false);
      
      alert(`Successfully rebooted ${pc.name}`);
      
    } catch (error) {
      setIsUpdating(false);
      alert('Failed to reboot PC. Please try again.');
    }
  };

  const handleMovePC = () => {
    if (!isAdmin) return;
    
    // Close modal and activate move mode
    onClose();
    onMoveModeChange(true);
    
    // Show instructions
    setTimeout(() => {
      alert(`Move Mode Activated!\n\nTo move ${pc.name}:\n1. Click and drag the PC dot to the new position\n2. Release to save the new position\n3. Click outside the floor area to exit move mode\n\nNote: Only admins can move PCs.`);
    }, 100);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content max-w-2xl mx-auto mt-20 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-100 mb-2">{pc.name}</h2>
            <div className="flex items-center space-x-2 text-gray-400">
              <Wifi className="w-4 h-4" />
              <span className="font-mono">{pc.ipAddress}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`px-2 py-1 rounded text-xs font-semibold ${
              isAdmin ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
            }`}>
              {isAdmin ? 'ADMIN' : 'VIEWER'}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status Section */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-100 mb-3 flex items-center">
              <Monitor className="w-5 h-5 mr-2" />
              System Status
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Status:</span>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${status.status === 'green' ? 'bg-status-green' : status.status === 'yellow' ? 'bg-status-yellow' : 'bg-status-red'}`}></div>
                  <span className={`font-semibold ${
                    status.status === 'green' ? 'text-status-green' : 
                    status.status === 'yellow' ? 'text-status-yellow' : 
                    'text-status-red'
                  }`}>
                    {status.label}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Days since reboot:</span>
                <span className="text-gray-100 font-semibold">{status.days} days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Last reboot:</span>
                <span className="text-gray-100 font-mono text-sm">{formatDate(pc.lastReboot)}</span>
              </div>
              
              {/* Admin-only: Reboot Date Editor */}
              {isAdmin && (
                <div className="mt-4 pt-4 border-t border-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">Update Reboot Date:</span>
                    <button
                      onClick={() => setShowDatePicker(!showDatePicker)}
                      className="text-blue-400 hover:text-blue-300 text-sm flex items-center space-x-1"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                  </div>
                  
                  {showDatePicker && (
                    <div className="space-y-3">
                      <input
                        type="datetime-local"
                        value={newRebootDate.slice(0, 16)}
                        onChange={(e) => setNewRebootDate(e.target.value + ':00Z')}
                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-gray-100 text-sm"
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={handleUpdateRebootDate}
                          disabled={isUpdating}
                          className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-500 disabled:opacity-50"
                        >
                          <Save className="w-4 h-4" />
                          <span>{isUpdating ? 'Updating...' : 'Save'}</span>
                        </button>
                        <button
                          onClick={() => setShowDatePicker(false)}
                          className="px-3 py-2 bg-gray-600 text-gray-300 rounded text-sm hover:bg-gray-500"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Configuration Section */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-100 mb-3 flex items-center">
              <Cpu className="w-5 h-5 mr-2" />
              Configuration
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">CPU:</span>
                <span className="text-gray-100 text-sm font-mono">{pc.cpu}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">RAM:</span>
                <span className="text-gray-100 font-semibold">{pc.ram}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Storage:</span>
                <span className="text-gray-100 font-semibold">{pc.disk}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Production Line Info */}
        <div className="mt-6 bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-100 mb-3">Production Line</h3>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Assigned to:</span>
            <span className="text-gray-100 font-semibold capitalize">
              {pc.productionLine.replace('-', ' ')}
            </span>
          </div>
        </div>

        {/* Role-based Action Buttons */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-gray-200 rounded-lg hover:bg-gray-500 transition-colors"
          >
            Close
          </button>
          
          {isAdmin ? (
            <>
              <button
                onClick={handleMovePC}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors flex items-center space-x-2"
                title="Move this PC to a new position"
              >
                <Move className="w-4 h-4" />
                <span>Move PC</span>
              </button>
              <button
                onClick={handleRebootNow}
                disabled={isUpdating}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-500 transition-colors flex items-center space-x-2 disabled:opacity-50"
                title="Reboot this PC now"
              >
                <Power className="w-4 h-4" />
                <span>{isUpdating ? 'Rebooting...' : 'Reboot Now'}</span>
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors flex items-center space-x-2"
                title="Remote access to this PC"
              >
                <Settings className="w-4 h-4" />
                <span>Remote Access</span>
              </button>
            </>
          ) : (
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors flex items-center space-x-2"
              title="View detailed logs"
            >
              <Eye className="w-4 h-4" />
              <span>View Logs</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PCDetailsModal; 