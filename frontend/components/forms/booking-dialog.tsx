'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Property } from '@/lib/types';
import { bookingsAPI } from '@/lib/api/index';

interface BookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
  user: any;
}

export default function BookingDialog({ isOpen, onClose, property, user }: BookingDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property || !user) return;

    setLoading(true);
    try {
      await bookingsAPI.create({
        property: property._id,
        tenant: user._id,
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
        notes: formData.notes || undefined,
      });

      toast({
        title: 'Booking Request Submitted',
        description: 'Your booking request has been sent to the landlord',
      });
      onClose();
      setFormData({ startDate: '', endDate: '', notes: '' });
    } catch (error: any) {
      toast({
        title: 'Booking Failed',
        description: error.response?.data?.message || 'Failed to submit booking request',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!property) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book {property.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Property Details</p>
            <p className="font-medium">{property.title}</p>
            <p className="text-sm text-gray-600">{`${property.address.street}, ${property.address.city}, ${property.address.state}`}</p>
            <p className="text-lg font-bold text-blue-600 mt-2">
              ${property.rent?.toLocaleString()}/month
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Move-in Date</Label>
                <input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div>
                <Label htmlFor="endDate">Move-out Date</Label>
                <input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Message to Landlord (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                placeholder="Introduce yourself and explain why you're interested in this property..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="whitespace-nowrap" disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" className="whitespace-nowrap" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Booking Request'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
