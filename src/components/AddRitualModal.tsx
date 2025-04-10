
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface AddRitualModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRitual: (name: string) => void;
}

const AddRitualModal: React.FC<AddRitualModalProps> = ({ 
  isOpen, 
  onClose,
  onAddRitual
}) => {
  const [ritualName, setRitualName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ritualName.trim()) {
      onAddRitual(ritualName);
      setRitualName('');
    }
  };

  return (
    <motion.div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
    >
      {/* Backdrop */}
      <motion.div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
      />
      
      {/* Modal */}
      <motion.div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: isOpen ? 1 : 0, scale: isOpen ? 1 : 0.95 }}
        transition={{ duration: 0.2 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-ritual-moss/30">
          <h2 className="text-2xl font-serif text-ritual-forest">Create New Ritual</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label htmlFor="ritualName" className="block text-sm font-medium text-gray-700">
              Ritual Name
            </label>
            <input
              type="text"
              id="ritualName"
              value={ritualName}
              onChange={(e) => setRitualName(e.target.value)}
              placeholder="e.g. Morning Meditation"
              className="w-full px-4 py-3 rounded-lg border border-ritual-moss/50 focus:border-ritual-green
                         focus:outline-none focus:ring-1 focus:ring-ritual-green"
              required
            />
          </div>
          
          <div className="pt-4">
            <button
              type="submit"
              className="w-full ritual-button"
            >
              Create Ritual
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AddRitualModal;
