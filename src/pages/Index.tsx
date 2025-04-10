
import React, { useState, useEffect } from 'react';
import FocusMode from '@/components/FocusMode';
import RitualLibrary from '@/components/RitualLibrary';
import AddRitualModal from '@/components/AddRitualModal';
import ChainRitualsModal from '@/components/ChainRitualsModal';
import { useToast } from '@/components/ui/use-toast';
import { useRituals, Ritual } from '@/hooks/useRituals';

const Index = () => {
  const { 
    rituals, 
    loading, 
    createRitual, 
    completeRitual, 
    chainRituals 
  } = useRituals();
  
  const [currentRitual, setCurrentRitual] = useState<Ritual | null>(null);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isAddRitualOpen, setIsAddRitualOpen] = useState(false);
  const [isChainModalOpen, setIsChainModalOpen] = useState(false);
  
  const { toast } = useToast();

  // Set the current ritual when rituals are loaded
  useEffect(() => {
    if (rituals.length > 0 && !currentRitual) {
      setCurrentRitual(rituals[0]);
    }
  }, [rituals, currentRitual]);

  // Toggle library sidebar
  const toggleLibrary = () => {
    setIsLibraryOpen(!isLibraryOpen);
  };

  // Handle ritual completion
  const handleRitualCompletion = (ritualId: string) => {
    completeRitual(ritualId);
    
    // Update current ritual too if it's the completed one
    if (currentRitual && currentRitual.id === ritualId) {
      setCurrentRitual({
        ...currentRitual,
        streak_count: currentRitual.streak_count + 1
      });
    }
  };

  // Handle selecting a ritual from the library
  const handleSelectRitual = (ritual: Ritual) => {
    setCurrentRitual(ritual);
    setIsLibraryOpen(false);
    
    toast({
      title: "Ritual Changed",
      description: `Now focusing on: ${ritual.name}`,
    });
  };

  // Handle adding a new ritual
  const handleAddRitual = async (name: string) => {
    try {
      await createRitual(name);
      setIsAddRitualOpen(false);
      
      toast({
        title: "New Ritual Created",
        description: `"${name}" has been added to your library.`,
      });
    } catch (err) {
      console.error("Error adding ritual:", err);
    }
  };

  // Handle chaining rituals
  const handleChainRituals = (chainedRitualIds: string[]) => {
    chainRituals(chainedRitualIds);
    setIsChainModalOpen(false);
  };

  // Show loading state
  if (loading && rituals.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading your rituals...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main Focus Mode */}
      {currentRitual && (
        <FocusMode
          onOpenLibrary={toggleLibrary}
          currentRitual={currentRitual}
          onCompletedRitual={handleRitualCompletion}
        />
      )}
      
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
