
import React from 'react';
import AddRitualModal from './AddRitualModal';
import ChainRitualsModal from './ChainRitualsModal';
import AddFriendModal from './AddFriendModal';
import { Ritual } from '@/types/ritual';

interface RitualModalsProps {
  showAddModal: boolean;
  showChainModal: boolean;
  showAddFriendModal: boolean;
  isOwnGarden: boolean;
  rituals: Ritual[];
  onCloseAddModal: () => void;
  onCloseChainModal: () => void;
  onCloseAddFriendModal: () => void;
  onAddRitual: (name: string) => Promise<Ritual | undefined>;
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
  onChainRituals,
}) => {
  return (
    <>
      {/* Add Ritual Modal */}
      <AddRitualModal
        isOpen={showAddModal}
        onClose={onCloseAddModal}
        onAddRitual={onAddRitual}
      />

      {/* Chain Rituals Modal */}
      {isOwnGarden && (
        <ChainRitualsModal
          isOpen={showChainModal}
          onClose={onCloseChainModal}
          onChainRituals={onChainRituals}
          rituals={rituals}
        />
      )}

      {/* Add Friend Modal */}
      <AddFriendModal
        isOpen={showAddFriendModal}
        onClose={onCloseAddFriendModal}
      />
    </>
  );
};

export default RitualModals;
