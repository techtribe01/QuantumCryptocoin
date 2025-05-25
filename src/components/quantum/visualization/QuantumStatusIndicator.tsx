
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface QuantumStatusIndicatorProps {
  state: 'stable' | 'processing' | 'entangled';
}

export function QuantumStatusIndicator({ state }: QuantumStatusIndicatorProps) {
  const getStatusColor = () => {
    switch (state) {
      case 'stable': return 'bg-green-600/90 text-green-100 border-green-400/50';
      case 'processing': return 'bg-blue-600/90 text-blue-100 border-blue-400/50';
      case 'entangled': return 'bg-purple-600/90 text-purple-100 border-purple-400/50';
    }
  };
  
  const getStatusLabel = () => {
    return state.charAt(0).toUpperCase() + state.slice(1);
  };

  return (
    <Badge className={`ml-2 px-3 py-1 font-medium ${getStatusColor()}`}>
      {getStatusLabel()}
    </Badge>
  );
}
