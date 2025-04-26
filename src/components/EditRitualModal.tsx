
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Ritual } from '@/types/ritual';

interface EditRitualModalProps {
  ritual: Ritual;
  isOpen: boolean;
  onClose: () => void;
  onUpdateRitual: (id: string, updates: Partial<Ritual>) => void;
  onDeleteRitual?: (id: string) => void;
}

const EditRitualModal: React.FC<EditRitualModalProps> = ({
  ritual,
  isOpen,
  onClose,
  onUpdateRitual,
  onDeleteRitual
}) => {
  const { toast } = useToast();
  const [name, setName] = useState(ritual.name);
  const [status, setStatus] = useState(ritual.status);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      setName(ritual.name);
      setStatus(ritual.status);
    }
  }, [ritual, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (name !== ritual.name || status !== ritual.status) {
      onUpdateRitual(ritual.id, {
        name,
        status
      });
      
      toast({
        title: "Ritual updated",
        description: "Your changes have been saved successfully.",
        className: "bg-ritual-green/20 border-ritual-green text-ritual-forest",
      });
    }
    
    onClose();
  };

  const handleDelete = () => {
    if (onDeleteRitual) {
      onDeleteRitual(ritual.id);
      setShowDeleteDialog(false);
      onClose();
      
      toast({
        title: "Ritual deleted",
        description: "Your ritual has been removed.",
        className: "bg-ritual-peach/20 border-ritual-peach text-ritual-forest",
      });
    }
  };

  return (
    <>
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
            <h2 className="text-2xl font-serif text-ritual-forest">Edit Ritual</h2>
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter ritual name"
                className="w-full px-4 py-3 rounded-lg border border-ritual-moss/50 focus:border-ritual-green
                         focus:outline-none focus:ring-1 focus:ring-ritual-green"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="status-active"
                    name="status"
                    value="active"
                    checked={status === 'active'}
                    onChange={() => setStatus('active')}
                    className="mr-2 h-4 w-4 text-ritual-green focus:ring-ritual-green"
                  />
                  <label htmlFor="status-active" className="text-sm text-gray-700">
                    Active (appears in Focus Mode and Garden)
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="status-paused"
                    name="status"
                    value="paused"
                    checked={status === 'paused'}
                    onChange={() => setStatus('paused')}
                    className="mr-2 h-4 w-4 text-ritual-green focus:ring-ritual-green"
                  />
                  <label htmlFor="status-paused" className="text-sm text-gray-700">
                    Paused (hidden from Focus Mode and Garden)
                  </label>
                </div>
                
                {status === 'chained' && (
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="status-chained"
                      name="status"
                      value="chained"
                      checked={status === 'chained'}
                      onChange={() => setStatus('chained')}
                      className="mr-2 h-4 w-4 text-ritual-green focus:ring-ritual-green"
                    />
                    <label htmlFor="status-chained" className="text-sm text-gray-700">
                      Chained (part of a ritual chain)
                    </label>
                  </div>
                )}
              </div>
            </div>
            
            <div className="pt-4 flex flex-col gap-3">
              <button
                type="submit"
                className="w-full ritual-button"
              >
                Save Changes
              </button>
              
              {onDeleteRitual && (
                <button
                  type="button"
                  onClick={() => setShowDeleteDialog(true)}
                  className="w-full px-4 py-3 rounded-full border border-ritual-peach text-ritual-peach
                           hover:bg-ritual-peach/10 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Ritual
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{ritual.name}" and all of its progress.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-ritual-moss text-ritual-forest hover:bg-ritual-moss/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-ritual-peach text-white hover:bg-ritual-peach/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EditRitualModal;
