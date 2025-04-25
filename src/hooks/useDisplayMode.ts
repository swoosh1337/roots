
import { useState } from 'react';

export type DisplayMode = 'focus' | 'library' | 'garden';

export const useDisplayMode = (initialMode: DisplayMode = 'focus') => {
  const [displayMode, setDisplayMode] = useState<DisplayMode>(initialMode);

  const handleViewGarden = () => setDisplayMode('garden');
  const handleCloseGarden = () => setDisplayMode('focus');
  const handleOpenLibrary = () => setDisplayMode('library');
  const handleCloseLibrary = () => setDisplayMode('focus');

  return {
    displayMode,
    handleViewGarden,
    handleCloseGarden,
    handleOpenLibrary,
    handleCloseLibrary
  };
};
