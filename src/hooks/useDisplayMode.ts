
import { useState } from 'react';

type DisplayMode = 'focus' | 'garden' | 'library' | 'exiting-garden';

export const useDisplayMode = (initialMode: DisplayMode = 'focus') => {
  const [displayMode, setDisplayMode] = useState<DisplayMode>(initialMode);

  const handleViewGarden = () => {
    setDisplayMode('garden');
  };

  const handleCloseGarden = () => {
    setDisplayMode('focus');
  };

  const handleOpenLibrary = () => {
    setDisplayMode('library');
  };

  const handleCloseLibrary = () => {
    setDisplayMode('focus');
  };

  return {
    displayMode,
    setDisplayMode,
    handleViewGarden,
    handleCloseGarden,
    handleOpenLibrary,
    handleCloseLibrary
  };
};
