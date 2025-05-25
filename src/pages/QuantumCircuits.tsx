
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { CircuitVisualizer } from '@/components/quantum/CircuitVisualizer';
import { Button } from '@/components/ui/button';
import { QuantumFidelityMetrics } from '@/components/ai/QuantumFidelityMetrics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CircuitOptimizer } from '@/components/quantum/CircuitOptimizer'; 
import { toast } from 'sonner';
import { Cpu, Zap, BrainCircuit } from 'lucide-react';
import { circuitOptimizer } from '@/lib/quantum/CircuitOptimizer';

export default function QuantumCircuits() {
  const [activeCircuit, setActiveCircuit] = useState(
    circuitOptimizer.generateSampleCircuit(5, 'medium')
  );
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2 flex items-center">
              <Cpu className="h-6 w-6 mr-2 text-purple-400" />
              Quantum Circuit Optimizer
            </h1>
            <p className="text-gray-400 max-w-2xl">
              Design, visualize, and optimize quantum circuits with advanced AGI-powered techniques. 
              The system integrates fidelity machine learning for improved quantum operations.
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex gap-3">
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Zap className="h-4 w-4 mr-2" />
              Create New Circuit
            </Button>
            <Button variant="outline">
              <BrainCircuit className="h-4 w-4 mr-2" />
              Import from AGI
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          {/* Remove the initialCircuit prop since it doesn't exist on CircuitVisualizer */}
          <CircuitVisualizer />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <QuantumFidelityMetrics />
            
            <Card className="bg-black/70 border-purple-500/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <div className="flex items-center">
                    <BrainCircuit className="h-5 w-5 mr-2 text-purple-400" />
                    Circuit Registry
                  </div>
                  <Badge className="bg-purple-900/40 text-purple-300">
                    {Math.floor(Math.random() * 20) + 5} Circuits
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => {
                    const complexity = i === 1 ? 'simple' : i === 2 ? 'medium' : 'complex';
                    const circuit = circuitOptimizer.generateSampleCircuit(
                      i === 1 ? 3 : i === 2 ? 5 : 8, 
                      complexity as 'simple' | 'medium' | 'complex'
                    );
                    
                    return (
                      <div 
                        key={i} 
                        className="bg-gray-900/40 border border-gray-800 hover:border-purple-500/30 
                                  rounded-lg p-3 cursor-pointer transition-colors"
                        onClick={() => {
                          setActiveCircuit(circuit);
                          toast.info(`Loaded ${circuit.name}`, {
                            description: `${circuit.qubits} qubits with ${circuit.gates.length} gates`
                          });
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-sm font-medium">{circuit.name}</h3>
                            <p className="text-xs text-gray-400 mt-1">
                              {circuit.qubits} qubits • {circuit.gates.length} gates • Depth: {circuit.depth}
                            </p>
                          </div>
                          <Badge variant="outline" className={
                            i === 1 ? "bg-blue-900/30 text-blue-400 border-blue-500/20" : 
                            i === 2 ? "bg-purple-900/30 text-purple-400 border-purple-500/20" : 
                            "bg-red-900/30 text-red-400 border-red-500/20"
                          }>
                            {complexity}
                          </Badge>
                        </div>
                        
                        <div className="mt-2 flex justify-between items-center">
                          <div className="flex items-center gap-1 text-xs">
                            <span className="text-gray-500">Fidelity:</span>
                            <span className={
                              circuit.fidelity > 0.9 ? "text-green-400" :
                              circuit.fidelity > 0.7 ? "text-yellow-400" :
                              "text-red-400"
                            }>
                              {(circuit.fidelity * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {circuit.id.slice(-8)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  <Button 
                    variant="ghost" 
                    className="w-full text-gray-400 hover:text-gray-300 hover:bg-gray-800/50 border border-dashed border-gray-800"
                  >
                    View All Circuits
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
