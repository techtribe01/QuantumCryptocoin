
import React from "react";
import { Brain, BrainCircuit, Network, BookOpen } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuantumNeuralNetwork } from "@/components/ai/QuantumNeuralNetwork";
import { QuantumAITraining } from "@/components/ai/QuantumAITraining";
import { QuantumFidelityMetrics } from "@/components/ai/QuantumFidelityMetrics";
import { QuantumDeepLearningDashboard } from "@/components/ai/QuantumDeepLearningDashboard";

interface QuantumAIDashboardProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function QuantumAIDashboard({ activeTab, setActiveTab }: QuantumAIDashboardProps) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-4 mb-4 w-full sm:w-auto">
        <TabsTrigger value="neural">
          <Brain className="h-4 w-4 mr-2" />
          Neural Network
        </TabsTrigger>
        <TabsTrigger value="training">
          <BrainCircuit className="h-4 w-4 mr-2" />
          AI Training
        </TabsTrigger>
        <TabsTrigger value="fidelity">
          <Network className="h-4 w-4 mr-2" />
          Fidelity Metrics
        </TabsTrigger>
        <TabsTrigger value="learning">
          <BookOpen className="h-4 w-4 mr-2" />
          Deep Learning
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="neural">
        <QuantumNeuralNetwork tokenSymbol="QNTM" />
      </TabsContent>

      <TabsContent value="training">
        <QuantumAITraining />
      </TabsContent>
      
      <TabsContent value="fidelity">
        <QuantumFidelityMetrics />
      </TabsContent>
      
      <TabsContent value="learning">
        <QuantumDeepLearningDashboard />
      </TabsContent>
    </Tabs>
  );
}
