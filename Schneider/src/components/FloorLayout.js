import React, { useState } from 'react';
import { factoryFloorData } from '../data/mockData';
import PCDot from './PCDot';
import { getPCStatus } from '../utils/statusUtils';

const pcPositions = {
  'line1_pc1':     { x: 8,  y: 55 },  // Line 1 PC1
  'line1_pc2':     { x: 22, y: 55 },  // Line 1 PC2
  'line2_pc1':     { x: 8,  y: 55 },  // Line 2 PC1
  'line2_pc2':     { x: 22, y: 55 }   // Line 2 PC2
};

const FloorLayout = ({ onPCClick, selectedPC, pcs, onUpdatePC, userRole, moveMode, onMoveModeChange }) => {
  const { floorDimensions, productionLines } = factoryFloorData;
  const [draggedPC, setDraggedPC] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [originalPosition, setOriginalPosition] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingPC, setPendingPC] = useState(null);
  const [legendOpen, setLegendOpen] = useState(false);
  const [areaFilter, setAreaFilter] = useState('all'); // 'all', 'welding', 'assembly', 'finishing'

  const isAdmin = userRole === 'admin';

  const handleMouseDown = (e, pc) => {
    if (!isAdmin || !moveMode) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setDraggedPC(pc);
    setIsDragging(true);
    setDragPosition({ x: pc.x, y: pc.y });
    setOriginalPosition({ x: pc.x, y: pc.y });
    
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !draggedPC) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Constrain to floor boundaries
    const constrainedX = Math.max(20, Math.min(x, floorDimensions.width - 20));
    const constrainedY = Math.max(20, Math.min(y, floorDimensions.height - 20));
    
    setDragPosition({ x: constrainedX, y: constrainedY });
  };

  const handleMouseUp = () => {
    if (!isDragging || !draggedPC) return;
    
    // Prepare the updated PC but do not save yet
    const updatedPC = {
      ...draggedPC,
      x: dragPosition.x,
      y: dragPosition.y
    };
    setPendingPC(updatedPC);
    setShowConfirm(true);
    setIsDragging(false);
    setDraggedPC(null);
    // Do not exit move mode yet
  };

  const handleConfirm = (save) => {
    if (save && pendingPC) {
      onUpdatePC(pendingPC);
    } else if (!save && pendingPC) {
      // Revert: call onUpdatePC with original position
      onUpdatePC({ ...pendingPC, x: originalPosition.x, y: originalPosition.y });
    }
    setShowConfirm(false);
    setPendingPC(null);
    setOriginalPosition(null);
    onMoveModeChange(false);
  };

  const handlePCClick = (pc) => {
    if (moveMode) {
      // In move mode, don't open modal, just allow dragging
      return;
    }
    // Normal click behavior - open modal
    onPCClick(pc);
  };

  // Get area name for the filter
  const getAreaName = () => {
    if (areaFilter === 'welding') return 'Welding Line';
    if (areaFilter === 'assembly') return 'Assembly Lines';
    if (areaFilter === 'finishing') return 'Finishing Lines';
    return '';
  };

  // Get PCs for the selected area
  const getFilteredPCs = () => {
    if (areaFilter === 'welding') return [];
    if (areaFilter === 'assembly') return pcs.filter(pc => ['assembly-line-1','assembly-line-2','assembly-line-3'].includes(pc.productionLine));
    if (areaFilter === 'finishing') return pcs.filter(pc => ['finishing-line-1','finishing-line-2'].includes(pc.productionLine));
    return [];
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-100 mb-2">Factory Floor Layout</h2>
        <p className="text-gray-400 text-sm">
          {moveMode 
            ? "Move Mode Active - Click and drag PCs to move them" 
            : "Blueprint view of production lines and PC locations"
          }
        </p>
        {moveMode && (
          <div className="mt-2 p-2 bg-yellow-600 bg-opacity-20 border border-yellow-600 rounded text-yellow-300 text-sm">
            🎯 Move Mode: Click and drag PCs to reposition them. Click outside to exit move mode.
          </div>
        )}
      </div>
      
      <div className="overflow-auto">
        <div 
          className="relative floor-grid bg-gray-800 border-2 border-floor-border rounded-lg overflow-hidden"
          style={{
            width: floorDimensions.width,
            height: floorDimensions.height,
            minWidth: '100%'
          }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={() => {
            if (moveMode) {
              onMoveModeChange(false);
            }
          }}
        >
          {/* Overlay for drawer */}
          {areaFilter !== 'all' && (
            <div className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity duration-300" onClick={() => setAreaFilter('all')} />
          )}
          {/* Sliding Drawer Panel */}
          <div
            className={`fixed top-0 right-0 h-full w-96 max-w-full z-50 flex flex-col shadow-2xl transition-transform duration-500 bg-gray-900 border-l border-gray-800 ${areaFilter !== 'all' ? 'translate-x-0' : 'translate-x-full'}`}
            style={{ minWidth: 350 }}
          >
            {areaFilter !== 'all' && (
              <>
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700 bg-gray-900 rounded-t-lg">
                  <span className="text-lg font-bold text-gray-100">{getAreaName()}</span>
                  <button
                    className="text-gray-400 hover:text-red-500 text-2xl font-bold px-2 py-1 rounded focus:outline-none"
                    onClick={() => setAreaFilter('all')}
                    title="Close Inventory"
                  >
                    ×
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-900">
                  {getFilteredPCs().length === 0 ? (
                    <div className="text-gray-400 text-center mt-8">No PCs in this area.</div>
                  ) : (
                    getFilteredPCs().map(pc => (
                      <div key={pc.id} className="bg-white bg-opacity-5 rounded-lg shadow p-4 flex items-center space-x-4 hover:bg-opacity-10 transition cursor-pointer" onClick={() => handlePCClick(pc)}>
                        <div className={`w-3 h-3 rounded-full ${getPCStatus(pc.lastReboot).status === 'red' ? 'bg-red-500' : getPCStatus(pc.lastReboot).status === 'yellow' ? 'bg-yellow-400' : 'bg-green-500'}`}></div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-100">{pc.name}</div>
                          <div className="text-xs text-gray-400">IP: {pc.ipAddress}</div>
                        </div>
                        <div className="text-xs px-2 py-1 rounded-full font-bold bg-gray-800 text-gray-200 border border-gray-700">
                          {getPCStatus(pc.lastReboot).label}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>

          {/* Filtered Production Lines with highlight/fade logic and PCs inside boxes */}
          {productionLines.filter(line => {
            if (areaFilter === 'all') return true;
            if (areaFilter === 'welding') return line.id === 'welding-line';
            if (areaFilter === 'assembly') return ['assembly-line-1','assembly-line-2','assembly-line-3'].includes(line.id);
            if (areaFilter === 'finishing') return ['finishing-line-1','finishing-line-2'].includes(line.id);
            return true;
          }).map((line) => {
            // Get PCs for this line (only for finishing lines)
            const pcsInBox = line.id.startsWith('finishing') ? pcs.filter(pc => pc.productionLine === line.id) : [];
            // Area highlight logic
            const isHighlighted =
              (areaFilter === 'welding' && line.id === 'welding-line') ||
              (areaFilter === 'assembly' && ['assembly-line-1','assembly-line-2','assembly-line-3'].includes(line.id)) ||
              (areaFilter === 'finishing' && ['finishing-line-1','finishing-line-2'].includes(line.id));
            return (
              <div
                key={line.id}
                className={`absolute z-10 bg-opacity-30 border-2 rounded flex items-center justify-center transition-all duration-300
                  ${line.id.includes('welding') ? 'bg-red-900 border-red-600' : line.id.includes('assembly') ? 'bg-blue-900 border-blue-600' : 'bg-green-900 border-green-600'}
                  ${areaFilter !== 'all' && isHighlighted ? 'ring-2 ring-yellow-200' : ''}
                  ${areaFilter !== 'all' && !isHighlighted ? 'opacity-40 grayscale' : ''}`}
                style={{
                  left: line.x,
                  top: line.y,
                  width: line.width,
                  height: line.height,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  boxShadow: areaFilter !== 'all' && isHighlighted ? '0 0 8px 2px #fde68a' : 'none',
                  transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
                }}
              >
                {/* Render PCs inside finishing line boxes only */}
                {line.id.startsWith('finishing') && (
                  <div style={{position: 'relative', width: '100%', height: '100%'}}>
                    {pcsInBox.map((pc, idx) => {
                      // Use the exact coordinates from pcPositions object
                      const position = pcPositions[pc.name];
                      // Safety check - if position is undefined, skip rendering this PC
                      if (!position) {
                        console.warn(`No position found for PC: ${pc.name}`);
                        return null;
                      }
                      return (
                        <div key={pc.id} style={{position: 'absolute', left: position.x, top: position.y, transform: 'translate(-50%, -50%)'}}>
                          <PCDot
                            pc={{ ...pc, x: position.x, y: position.y }}
                            onClick={() => handlePCClick(pc)}
                            isSelected={selectedPC?.id === pc.id}
                            onMouseDown={(e) => handleMouseDown(e, pc)}
                            isDraggable={isAdmin && moveMode}
                            moveMode={moveMode}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Box Color Legend Dropdown as Filter */}
          <div className="absolute left-1/2 transform -translate-x-1/2 bottom-4 z-50">
            <button
              className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-xs text-gray-200 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setLegendOpen((open) => !open)}
            >
              {legendOpen ? 'Hide Box Color Legend' : 'Show Box Color Legend'}
            </button>
            {legendOpen && (
              <div className="mt-2 bg-gray-800 border border-gray-600 rounded-lg p-3 text-xs flex flex-col items-start min-w-[220px] z-50">
                <div className="font-semibold text-gray-300 mb-2">Box Color Legend</div>
                <button className="flex items-center mb-1 hover:bg-gray-700 px-2 py-1 rounded w-full text-left" onClick={() => setAreaFilter('welding')}>
                  <div className="w-5 h-5 bg-red-900 border-2 border-red-600 rounded mr-2"></div>
                  <span className="text-gray-200">Welding Line</span>
                </button>
                <button className="flex items-center mb-1 hover:bg-gray-700 px-2 py-1 rounded w-full text-left" onClick={() => setAreaFilter('assembly')}>
                  <div className="w-5 h-5 bg-blue-900 border-2 border-blue-600 rounded mr-2"></div>
                  <span className="text-gray-200">Assembly Line</span>
                </button>
                <button className="flex items-center hover:bg-gray-700 px-2 py-1 rounded w-full text-left" onClick={() => setAreaFilter('finishing')}>
                  <div className="w-5 h-5 bg-green-900 border-2 border-green-600 rounded mr-2"></div>
                  <span className="text-gray-200">Finishing Line</span>
                </button>
                <button className="mt-2 bg-blue-700 hover:bg-blue-800 text-white px-3 py-1 rounded w-full text-xs font-semibold" onClick={() => setAreaFilter('all')}>Show Full Layout</button>
              </div>
            )}
          </div>
          
          {/* Dragged PC (if being dragged) */}
          {isDragging && draggedPC && (
            <div
              className="absolute w-4 h-4 rounded-full border-2 border-white shadow-lg cursor-grabbing opacity-75"
              style={{
                left: dragPosition.x,
                top: dragPosition.y,
                transform: 'translate(-50%, -50%)',
                backgroundColor: '#10b981', // Green color
                zIndex: 1000
              }}
            >
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                Moving: {draggedPC.name}
              </div>
            </div>
          )}
          
          {/* Confirmation Dialog */}
          {showConfirm && (
            <div className="absolute inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
              <div className="bg-gray-900 border border-gray-600 rounded-lg p-6 text-center">
                <div className="text-white mb-4">Do you want to save the new position?</div>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mr-2" onClick={() => handleConfirm(true)}>Yes</button>
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded" onClick={() => handleConfirm(false)}>No</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FloorLayout;


