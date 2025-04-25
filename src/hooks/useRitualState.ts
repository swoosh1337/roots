
import { useState, useCallback } from 'react';
import type { Ritual } from '@/types/ritual';
import { useToast } from '@/components/ui/use-toast';

export const useRitualState = () => {
  const [rituals, setRituals] = useState<Ritual[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const updateRituals = useCallback((newRituals: Ritual[]) => {
    setRituals(newRituals);
  }, []);

  const addRitual = useCallback((ritual: Ritual) => {
    setRituals(prev => [ritual, ...prev]);
  }, []);

  const updateRitual = useCallback((id: string, updates: Partial<Ritual>) => {
    setRituals(prev =>
      prev.map(ritual =>
        ritual.id === id ? { ...ritual, ...updates } : ritual
      )
    );
  }, []);

  const showError = useCallback((message: string) => {
    setError(message);
    if (message) {
      toast({
        title: "Error",
        description: message,
        variant: "destructive"
      });
    }
  }, [toast]);

  return {
    rituals,
    loading,
    error,
    setLoading,
    updateRituals,
    addRitual,
    updateRitual,
    showError
  };
};
