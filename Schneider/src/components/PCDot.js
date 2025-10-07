import React, { useState } from 'react';
import { getPCStatus, getStatusColorClass } from '../utils/statusUtils';

const PCDot = ({ pc, onClick, isSelected, onMouseDown, isDraggable, moveMode }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const rebootStatus = getPCStatus(pc.lastReboot);
  
  // Determine dot color based on online/offline status first, then reboot status
  let dotColorClass = 'bg-gray-600'; // Default gray for offline
  
  if (pc.status === 'online') {
    // PC is online - check reboot status for color
    if (rebootStatus.status === 'red') {
      dotColorClass = 'bg-red-500'; // Critical - needs reboot
    } else {
      dotColorClass = 'bg-green-500'; // Online and healthy
    }
  } else {
    // PC is offline
    dotColorClass = 'bg-gray-600'; // Gray for offline
  }

  const handleClick = (e) => {
    if (moveMode) {
      // In move mode, don't open modal
      return;
    }
    // Normal click behavior - open modal
    onClick();
  };

  return (
    <div className="relative">
      <div
        className={`pc-dot ${dotColorClass} ${isSelected ? 'ring-4 ring-blue-400' : ''} ${
          isDraggable ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'
        }`}
        style={{
          left: pc.x,
          top: pc.y,
          transform: 'translate(-50%, -50%)'
        }}
        onClick={handleClick}
        onMouseDown={onMouseDown}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        title={`${pc.name} - ${pc.ipAddress}${moveMode ? ' (Drag to move)' : ''}`}
      />
      
      {/* Tooltip */}
      {showTooltip && (
        <div
          className="absolute z-10 bg-gray-900 border border-gray-600 rounded-lg p-3 text-xs shadow-xl"
          style={{
            left: pc.x + 20,
            top: pc.y - 10,
            minWidth: '200px'
          }}
        >
          <div className="font-semibold text-gray-100 mb-1">{pc.name}</div>
          <div className="text-gray-400 mb-1">IP: {pc.ipAddress}</div>
          <div className="text-gray-400 mb-1">Connection: {pc.status === 'online' ? '🟢 Online' : '⚫ Offline'}</div>
          <div className="text-gray-400 mb-1">Reboot Status: {rebootStatus.label}</div>
          <div className="text-gray-400 mb-1">Days since reboot: {rebootStatus.days}</div>
          {moveMode && (
            <div className="text-yellow-400 text-xs mt-1">
              🎯 Move Mode: Drag to reposition
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PCDot; 