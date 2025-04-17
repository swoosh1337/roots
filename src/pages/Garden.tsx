
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TreeVisual from '@/components/TreeVisual';
import { useRituals } from '@/hooks/useRituals';

const Garden = () => {
  const navigate = useNavigate();
  const { rituals, loading } = useRituals();
  
  // Filter for only active rituals
  const activeRituals = rituals.filter(ritual => 
    ritual.status === 'active' || ritual.status === 'chained'
  );

  return (
    <div className="min-h-screen bg-ritual-paper">
      {/* Garden Header */}
      <div className="pt-8 pb-4 text-center">
        <h1 className="text-4xl font-serif text-ritual-green">My Garden</h1>
      </div>
      
      {/* Garden Grid with Trees */}
      <div className="px-4 py-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading your garden...</p>
          </div>
        ) : activeRituals.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64 text-center">
            <p className="text-ritual-forest mb-4">Your garden is empty.</p>
            <p className="text-sm text-ritual-forest/70">Create rituals to see trees grow here.</p>
          </div>
        ) : (
          <div className="garden-grid relative mx-auto max-w-4xl">
            {/* Garden Ground */}
            <div className="garden-ground bg-[#F2FCE2] rounded-lg shadow-md p-6 mb-8">
              {/* Grid Lines */}
              <div className="garden-grid-lines mb-4">
                {/* Grid pattern - subtle lines */}
                <div className="relative w-full h-full">
                  <div className="absolute inset-0 grid grid-cols-3 gap-4 pointer-events-none">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="border border-ritual-moss/10 rounded-md"></div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Trees Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {activeRituals.map((ritual) => (
                  <div key={ritual.id} className="flex flex-col items-center justify-center p-4">
                    <TreeVisual 
                      streak={ritual.streak_count} 
                      isAnimating={false}
                    />
                    <div className="mt-2 text-center">
                      <p className="text-sm text-ritual-forest/80">Day {ritual.streak_count}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Back Button */}
      <div className="flex justify-center mb-8">
        <Button 
          onClick={() => navigate('/')}
          variant="outline"
          className="rounded-full px-8 py-6 bg-ritual-paper/80 hover:bg-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>
    </div>
  );
};

export default Garden;
