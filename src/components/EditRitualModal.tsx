
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Ritual } from '@/types/ritual';

interface EditRitualModalProps {
  ritual: Ritual;
  isOpen: boolean;
  onClose: () => void;
  onUpdateRitual: (id: string, updates: Partial<Ritual>) => void;
}

const EditRitualModal: React.FC<EditRitualModalProps> = ({
  ritual,
  isOpen,
  onClose,
  onUpdateRitual
}) => {
  const [name, setName] = useState(ritual.name);
  const [status, setStatus] = useState(ritual.status);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateRitual(ritual.id, {
      name,
      status
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-ritual-paper">
        <DialogHeader>
          <DialogTitle className="text-ritual-forest font-serif text-xl">Edit Ritual</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="ritual-name">Ritual Name</Label>
            <Input 
              id="ritual-name"
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="bg-white border-ritual-moss/30"
              placeholder="Enter ritual name"
              required
            />
          </div>

          <div className="space-y-3">
            <Label>Status</Label>
            <RadioGroup value={status} onValueChange={(value: 'active' | 'paused' | 'chained') => setStatus(value)} className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="active" id="active" />
                <Label htmlFor="active">Active</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="paused" id="paused" />
                <Label htmlFor="paused">Paused</Label>
              </div>
              {status === 'chained' && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="chained" id="chained" />
                  <Label htmlFor="chained">Chained</Label>
                </div>
              )}
            </RadioGroup>
          </div>

          <DialogFooter className="sm:justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="border-ritual-forest text-ritual-forest hover:bg-ritual-moss/10"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-ritual-green hover:bg-ritual-green/90 text-white"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditRitualModal;
