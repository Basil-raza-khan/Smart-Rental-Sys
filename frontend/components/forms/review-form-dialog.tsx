'use client';

import { useState, useEffect } from 'react';
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
import { bookingsAPI } from '@/lib/api/index';

interface ReviewFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export default function ReviewFormDialog({ isOpen, onClose, userId }: ReviewFormDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    property: '',
    rating: 5,
    comment: '',
  });
  const [properties, setProperties] = useState<{ _id: string; title: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && userId) {
      const fetchProperties = async () => {
        try {
          // Get confirmed bookings for the tenant
          const response = await bookingsAPI.getAll({ tenant: userId, status: 'confirmed' });
          const uniqueProperties = response.data.data.bookings.reduce((acc: any[], booking: any) => {
            if (!acc.find(p => p._id === booking.property._id)) {
              acc.push(booking.property);
            }
            return acc;
          }, []);
          setProperties(uniqueProperties);
        } catch (error) {
          console.error('Failed to fetch properties:', error);
        }
      };
      fetchProperties();
    }
  }, [isOpen, userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.property) return;

    setLoading(true);
    try {
      await fetch('/api/v1/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          property: formData.property,
          tenant: userId,
          rating: formData.rating,
          comment: formData.comment,
        }),
      });

      toast({
        title: 'Review Submitted',
        description: 'Thank you for your feedback!',
      });
      onClose();
      setFormData({ property: '', rating: 5, comment: '' });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to submit review',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="property">Select Property</Label>
            <select
              id="property"
              value={formData.property}
              onChange={(e) => setFormData({ ...formData, property: e.target.value })}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm pr-8"
              required
            >
              <option value="">Choose a property</option>
              {properties.map((prop) => (
                <option key={prop._id} value={prop._id}>
                  {prop.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Rating</Label>
            <div className="flex items-center gap-2 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="focus:outline-none"
                >
                  <i
                    className={`${
                      star <= formData.rating
                        ? 'ri-star-fill text-yellow-500'
                        : 'ri-star-line text-gray-300'
                    } text-3xl w-8 h-8 flex items-center justify-center cursor-pointer`}
                  ></i>
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="comment">Your Review</Label>
            <Textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              rows={4}
              placeholder="Share your experience with this property..."
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="whitespace-nowrap" disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" className="whitespace-nowrap" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Review'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
