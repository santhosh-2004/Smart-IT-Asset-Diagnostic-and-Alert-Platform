import React, { useState, useEffect, useRef } from 'react';
import { ChevronUp, ChevronDown, Eye, Power } from 'lucide-react';
import { getPCStatus, formatDate, sortPCs, shouldAlertReboot } from '../utils/statusUtils';

const PCTable = ({ pcs, onPCClick, userRole }) => {
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const sortedPCs = sortPCs(pcs, sortBy, sortOrder);
  const isAdmin = userRole === 'admin';

  // Alert if any PC needs reboot (>= 8 days)
  const alertedPCsRef = useRef({});
  useEffect(() => {
    pcs.forEach(pc => {
      const daysLeft = shouldAlertReboot(pc.lastReboot);
      if (daysLeft !== null && !alertedPCsRef.current[pc.id]) {
        window.alert(`ALERT: ${pc.name} (${pc.ipAddress}) has not been rebooted for ${getPCStatus(pc.lastReboot).days} days! Please reboot within ${daysLeft} days.`);
        alertedPCsRef.current[pc.id] = true;
      }
    });
  }, [pcs]);

  const SortIcon = ({ column }) => {
    if (sortBy !== column) return null;
    return sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-700">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-100">PC Inventory</h2>
            <p className="text-gray-400 text-sm mt-1">Complete list of production line computers</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
            isAdmin ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
          }`}>
            {isAdmin ? 'ADMIN MODE' : 'VIEWER MODE'}
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="table-header">
              <th className="table-cell text-left">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-1 hover:text-gray-200 transition-colors"
                >
                  <span>PC Name</span>
                  <SortIcon column="name" />
                </button>
              </th>
              <th className="table-cell text-left">
                <button
                  onClick={() => handleSort('ipAddress')}
                  className="flex items-center space-x-1 hover:text-gray-200 transition-colors"
                >
                  <span>IP Address</span>
                  <SortIcon column="ipAddress" />
                </button>
              </th>
              <th className="table-cell text-left">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center space-x-1 hover:text-gray-200 transition-colors"
                >
                  <span>Status</span>
                  <SortIcon column="status" />
                </button>
              </th>
              <th className="table-cell text-left">
                <button
                  onClick={() => handleSort('lastReboot')}
                  className="flex items-center space-x-1 hover:text-gray-200 transition-colors"
                >
                  <span>Last Reboot</span>
                  <SortIcon column="lastReboot" />
                </button>
              </th>
              <th className="table-cell text-left">CPU</th>
              <th className="table-cell text-left">RAM</th>
              <th className="table-cell text-left">Storage</th>
              <th className="table-cell text-left">Production Line</th>
              {isAdmin && <th className="table-cell text-left">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {sortedPCs.map((pc) => {
              const status = getPCStatus(pc.lastReboot);
              return (
                <tr
                  key={pc.id}
                  className="table-row cursor-pointer"
                  onClick={() => onPCClick(pc)}
                >
                  <td className="table-cell font-semibold text-gray-100">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        status.status === 'red' ? 'bg-status-red' : 'bg-status-green'
                      }`}></div>
                      <span>{pc.name}</span>
                    </div>
                  </td>
                  <td className="table-cell font-mono">{pc.ipAddress}</td>
                  <td className="table-cell">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        status.status === 'green' ? 'bg-status-green bg-opacity-20 text-status-green' : 
                        status.status === 'yellow' ? 'bg-status-yellow bg-opacity-20 text-status-yellow' : 
                        'bg-status-red bg-opacity-20 text-status-red'
                      }`}>
                        {status.label}
                      </span>
                      <span className="text-gray-400 text-xs">({status.days}d)</span>
                    </div>
                  </td>
                  <td className="table-cell text-gray-300">{formatDate(pc.lastReboot)}</td>
                  <td className="table-cell text-gray-300 text-sm">{pc.cpu}</td>
                  <td className="table-cell text-gray-300">{pc.ram}</td>
                  <td className="table-cell text-gray-300">{pc.disk}</td>
                  <td className="table-cell text-gray-300 capitalize">
                    {pc.productionLine.replace('-', ' ')}
                  </td>
                  {isAdmin && (
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Admin action: Reboot PC
                            console.log(`Rebooting ${pc.name}`);
                          }}
                          className="p-1 text-yellow-400 hover:text-yellow-300 transition-colors"
                          title="Reboot PC"
                        >
                          <Power className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Admin action: Remote access
                            console.log(`Remote access to ${pc.name}`);
                          }}
                          className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                          title="Remote Access"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-3 bg-gray-800 border-t border-gray-700">
        <div className="flex justify-between items-center text-sm text-gray-400">
          <span>Total PCs: {pcs.length}</span>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-status-green"></div>
              <span>OK: {pcs.filter(pc => getPCStatus(pc.lastReboot).status === 'green').length}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-status-yellow"></div>
              <span>Due: {pcs.filter(pc => getPCStatus(pc.lastReboot).status === 'yellow').length}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-status-red"></div>
              <span>Critical: {pcs.filter(pc => getPCStatus(pc.lastReboot).status === 'red').length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PCTable; 