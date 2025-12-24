'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { reviewsAPI } from '@/lib/api/index';
import { Review } from '@/lib/types';

interface ReviewsTableProps {
  filter: 'all' | 'my-reviews';
  userId?: string;
}

export default function ReviewsTable({ filter, userId }: ReviewsTableProps) {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const params: any = {};
        if (filter === 'my-reviews' && userId) {
          params.tenant = userId;
        }
        const response = await reviewsAPI.getAll(params);
        setReviews(response.data.data.reviews);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
        toast({
          title: 'Error',
          description: 'Failed to load reviews',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [filter, userId, toast]);

  const handleEdit = async (id: string) => {
    // For now, just show toast
    toast({
      title: 'Edit Review',
      description: 'Review editing feature coming soon',
    });
  };

  const handleDelete = async (id: string) => {
    if (!userId) return;
    try {
      await reviewsAPI.delete(id, { userId });
      toast({
        title: 'Review Deleted',
        description: 'Your review has been removed',
      });
      // Refresh
      const params: any = {};
      if (filter === 'my-reviews' && userId) {
        params.tenant = userId;
      }
      const response = await reviewsAPI.getAll(params);
      setReviews(response.data.data.reviews);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete review',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <i
            key={i}
            className={`${
              i < rating ? 'ri-star-fill text-yellow-500' : 'ri-star-line text-gray-300'
            } w-4 h-4 flex items-center justify-center`}
          ></i>
        ))}
      </div>
    );
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Property</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Review</TableHead>
            <TableHead>Reviewer</TableHead>
            <TableHead>Date</TableHead>
            {filter === 'my-reviews' && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.map((review) => (
            <TableRow key={review._id}>
              <TableCell className="font-medium">{review.property.title}</TableCell>
              <TableCell>{renderStars(review.rating)}</TableCell>
              <TableCell className="max-w-md">{review.comment}</TableCell>
              <TableCell>{review.tenant.name}</TableCell>
              <TableCell>{new Date(review.createdAt || '').toLocaleDateString()}</TableCell>
              {filter === 'my-reviews' && (
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(review._id)}
                      className="whitespace-nowrap"
                    >
                      <i className="ri-edit-line w-4 h-4 flex items-center justify-center"></i>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(review._id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 whitespace-nowrap"
                    >
                      <i className="ri-delete-bin-line w-4 h-4 flex items-center justify-center"></i>
                    </Button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {reviews.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No reviews found
        </div>
      )}
    </div>
  );
}
