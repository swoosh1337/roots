
import React, { useState, useEffect } from 'react';
import FocusMode from '@/components/FocusMode';
import RitualLibrary from '@/components/RitualLibrary';
import AddRitualModal from '@/components/AddRitualModal';
import ChainRitualsModal from '@/components/ChainRitualsModal';
import { useToast } from '@/components/ui/use-toast';

// Unique ID generator
const generateId = () => {
  return Math.random().toString(36).substring(2, 9);
};

// Sample initial ritual
const initialRituals = [
  {
    id: 'ritual-1',
    name: 'Morning Meditation',
    streak: 7,
    status: 'active' as const,
  }
];

const Index = () => {
  const [rituals, setRituals] = useState(initialRituals);
  const [currentRitual, setCurrentRitual] = useState(initialRituals[0]);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isAddRitualOpen, setIsAddRitualOpen] = useState(false);
  const [isChainModalOpen, setIsChainModalOpen] = useState(false);
  
  const { toast } = useToast();

  // Toggle library sidebar
  const toggleLibrary = () => {
    setIsLibraryOpen(!isLibraryOpen);
  };

  // Handle ritual completion
  const handleRitualCompletion = (ritualId: string) => {
    setRituals(rituals.map(ritual => 
      ritual.id === ritualId 
        ? { ...ritual, streak: ritual.streak + 1 } 
        : ritual
    ));
    
    // Update current ritual too if it's the completed one
    if (currentRitual.id === ritualId) {
      setCurrentRitual({
        ...currentRitual,
        streak: currentRitual.streak + 1
      });
    }
    
    toast({
      title: "Ritual Completed!",
      description: "Your tree is growing stronger each day.",
    });
  };

  // Handle selecting a ritual from the library
  const handleSelectRitual = (ritual: typeof currentRitual) => {
    setCurrentRitual(ritual);
    setIsLibraryOpen(false);
    
    toast({
      title: "Ritual Changed",
      description: `Now focusing on: ${ritual.name}`,
    });
  };

  // Handle adding a new ritual
  const handleAddRitual = (name: string) => {
    const newRitual = {
      id: generateId(),
      name,
      streak: 0,
      status: 'active' as const,
    };
    
    setRituals([...rituals, newRitual]);
    setIsAddRitualOpen(false);
    
    toast({
      title: "New Ritual Created",
      description: `"${name}" has been added to your library.`,
    });
  };

  // Handle chaining rituals
  const handleChainRituals = (chainedRitualIds: string[]) => {
    // Update the status of rituals in the chain
    const updatedRituals = rituals.map(ritual => 
      chainedRitualIds.includes(ritual.id)
        ? { ...ritual, status: 'chained' as const }
        : ritual
    );
    
    setRituals(updatedRituals);
    setIsChainModalOpen(false);
    
    toast({
      title: "Rituals Chained",
      description: "Your selected rituals are now linked together.",
    });
  };

  return (
    <>
      {/* Main Focus Mode */}
      <FocusMode
        onOpenLibrary={toggleLibrary}
        currentRitual={currentRitual}
        onCompletedRitual={handleRitualCompletion}
      />
      
      {/* Ritual Library Sidebar */}
      <RitualLibrary
        rituals={rituals}
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onSelectRitual={handleSelectRitual}
        onAddRitual={() => setIsAddRitualOpen(true)}
        onChainRituals={() => setIsChainModalOpen(true)}
      />
      
      {/* Add Ritual Modal */}
      <AddRitualModal
        isOpen={isAddRitualOpen}
        onClose={() => setIsAddRitualOpen(false)}
        onAddRitual={handleAddRitual}
      />
      
      {/* Chain Rituals Modal */}
      <ChainRitualsModal
        isOpen={isChainModalOpen}
        onClose={() => setIsChainModalOpen(false)}
        rituals={rituals}
        onChainRituals={handleChainRituals}
      />
    </>
  );
};

export default Index;
