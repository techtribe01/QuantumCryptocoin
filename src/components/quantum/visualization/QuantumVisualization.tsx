
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs';
import { BrainCircuit } from 'lucide-react';
import { QuantumCanvas } from './QuantumCanvas';
import { QuantumStatusIndicator } from './QuantumStatusIndicator';
import { TabTrigger } from './TabTrigger';

export function QuantumVisualization() {
  // Use a default value to ensure activeTab is never undefined
  const [activeTab, setActiveTab] = useState<string>('quantum');
  const [quantumState, setQuantumState] = useState<'stable' | 'processing' | 'entangled'>('stable');

  // Change quantum state randomly at intervals
  React.useEffect(() => {
    const stateInterval = setInterval(() => {
      setQuantumState(prev => {
        const states: Array<'stable' | 'processing' | 'entangled'> = ['stable', 'processing', 'entangled'];
        const currentIndex = states.indexOf(prev);
        const nextIndex = (currentIndex + 1) % states.length;
        return states[nextIndex];
      });
    }, 5000);
    
    return () => clearInterval(stateInterval);
  }, []);

  // Define tabs with guaranteed string values
  const tabs = ['quantum', 'neural', 'blockchain'];

  return (
    <Card className="bg-gray-900/90 border-purple-500/30 shadow-lg overflow-hidden backdrop-blur-sm">
      <CardHeader className="pb-2 bg-gray-800/50">
        <div className="flex justify-between items-center">
          <CardTitle className="text-white flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-purple-400" />
            <span className="text-white font-semibold">Quantum Intelligence Visualization</span>
            <QuantumStatusIndicator state={quantumState} />
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="bg-gray-800/30">
        <Tabs defaultValue="quantum" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4 bg-gray-800/50 border border-gray-600/30">
            {tabs.map(tab => (
              <TabTrigger key={tab} value={tab} />
            ))}
          </TabsList>
          
          {/* We need to create a separate TabsContent for each possible tab value */}
          {tabs.map(tab => (
            <QuantumCanvas 
              key={tab}
              activeTab={tab} 
              quantumState={quantumState} 
            />
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
