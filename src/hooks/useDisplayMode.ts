
import { useState, useCallback } from 'react';

type DisplayMode = 'focus' | 'garden' | 'library' | 'exiting-garden';

export const useDisplayMode = (initialMode: DisplayMode = 'focus') => {
  const [displayMode, setDisplayMode] = useState<DisplayMode>(initialMode);

  const handleViewGarden = useCallback(() => {
    setDisplayMode('garden');
  }, []);

  const handleCloseGarden = useCallback(() => {
    setDisplayMode('focus');
  }, []);

  const handleOpenLibrary = useCallback(() => {
    setDisplayMode('library');
  }, []);

  const handleCloseLibrary = useCallback(() => {
    setDisplayMode('focus');
  }, []);

  return {
    displayMode,
    setDisplayMode,
    handleViewGarden,
    handleCloseGarden,
    handleOpenLibrary,
    handleCloseLibrary
  };
};
