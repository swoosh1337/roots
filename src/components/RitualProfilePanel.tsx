
import React from 'react';
import { Ritual } from '@/types/ritual';
import ProfilePanel from './profile/ProfilePanel';

interface RitualProfilePanelProps {
  profileOpen: boolean;
  rituals: Ritual[];
  onCloseProfile: () => void;
  onViewGarden: () => void;
  onAddFriend: () => void;
}

const RitualProfilePanel: React.FC<RitualProfilePanelProps> = ({
  profileOpen,
  rituals,
  onCloseProfile,
  onViewGarden,
  onAddFriend
}) => {
  const profileStats = {
    totalStreaks: rituals.reduce((total, ritual) => total + ritual.streak_count, 0),
    longestStreak: rituals.reduce((max, ritual) => Math.max(max, ritual.streak_count), 0),
    ritualsCreated: rituals.length,
    chains: rituals.filter(ritual => ritual.status === 'chained').length
  };

  return (
    <ProfilePanel
      isOpen={profileOpen}
      onClose={onCloseProfile}
      stats={profileStats}
      onViewGarden={onViewGarden}
      onAddFriend={onAddFriend}
    />
  );
};

export default RitualProfilePanel;
