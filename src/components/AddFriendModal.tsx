import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AddFriendModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendRequest: (identifier: string) => void;
}

const AddFriendModal: React.FC<AddFriendModalProps> = ({
  isOpen,
  onClose,
  onSendRequest
}) => {
  const [identifier, setIdentifier] = useState('');

  const handleSend = () => {
    if (identifier.trim()) {
      onSendRequest(identifier.trim());
      setIdentifier('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Custom modal */}
      <div className="bg-white rounded-lg shadow-lg w-[500px] max-w-[95vw] overflow-hidden">
        {/* Header with X button */}
        <div className="relative pt-8 pb-4">
          <button 
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <X size={20} />
          </button>
          
          <h2 className="text-4xl font-serif text-ritual-forest text-center">
            Add Friend
          </h2>
        </div>
        
        {/* Form content */}
        <div className="px-8 py-4 space-y-4">
          {/* Input */}
          <div className="relative">
            <Input
              type="text"
              placeholder="Enter a username or email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full rounded-md border-gray-300 py-2 px-3 focus:border-ritual-green focus:ring-ritual-green"
            />
          </div>
          
          {/* Button */}
          <Button
            type="button"
            onClick={handleSend}
            disabled={!identifier.trim()}
            className="w-full bg-[#D5E6C5] hover:bg-[#C5DEB0] text-ritual-forest rounded-md py-3 text-base font-medium"
          >
            Send Request
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddFriendModal; 