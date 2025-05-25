
import React from 'react';

export const ModelArchitectureTab: React.FC = () => {
  return (
    <div className="bg-gray-800/80 rounded-lg p-4 border border-purple-500/30 backdrop-blur-sm">
      <h3 className="text-sm font-medium text-purple-300 mb-2">Model Architecture</h3>
      <div className="text-xs text-white space-y-3">
        <p className="leading-relaxed">
          This quantum neural network uses a hybrid quantum-classical architecture with both
          traditional neural network layers and quantum processing units.
        </p>
        
        <div className="space-y-2 mt-3">
          <h4 className="text-xs text-white font-medium">Layers Configuration:</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="bg-gray-900/80 p-2 rounded text-center border border-gray-600/50">
              <div className="text-purple-300 text-xs font-medium">Input</div>
              <div className="font-mono text-white text-xs">64 × 1</div>
            </div>
            
            <div className="bg-gray-900/80 p-2 rounded text-center border border-gray-600/50">
              <div className="text-purple-300 text-xs font-medium">Quantum Layer</div>
              <div className="font-mono text-white text-xs">8 qubits</div>
            </div>
            
            <div className="bg-gray-900/80 p-2 rounded text-center border border-gray-600/50">
              <div className="text-purple-300 text-xs font-medium">Output</div>
              <div className="font-mono text-white text-xs">1 × 1</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
