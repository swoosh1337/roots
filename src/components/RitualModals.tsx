
import React from 'react';
import { Ritual } from '@/types/ritual';
import AddRitualModal from './AddRitualModal';
import ChainRitualsModal from './ChainRitualsModal';
import AddFriendModal from './AddFriendModal';

interface RitualModalsProps {
  showAddModal: boolean;
  showChainModal: boolean;
  showAddFriendModal: boolean;
  isOwnGarden: boolean;
  rituals: Ritual[];
  onCloseAddModal: () => void;
  onCloseChainModal: () => void;
  onCloseAddFriendModal: () => void;
  onAddRitual: (name: string) => void;
  onChainRituals: (ritualIds: string[]) => void;
}

const RitualModals: React.FC<RitualModalsProps> = ({
  showAddModal,
  showChainModal,
  showAddFriendModal,
  isOwnGarden,
  rituals,
  onCloseAddModal,
  onCloseChainModal,
  onCloseAddFriendModal,
  onAddRitual,
  onChainRituals
}) => {
  if (!isOwnGarden) return null;

  return (
    <>
      <AddRitualModal
        isOpen={showAddModal}
        onClose={onCloseAddModal}
        onAddRitual={onAddRitual}
      />
      
      <ChainRitualsModal
        isOpen={showChainModal}
        onClose={onCloseChainModal}
        rituals={rituals}
        onChainRituals={onChainRituals}
      />
      
      <AddFriendModal
        isOpen={showAddFriendModal}
        onClose={onCloseAddFriendModal}
      />
    </>
  );
};

export default RitualModals;
