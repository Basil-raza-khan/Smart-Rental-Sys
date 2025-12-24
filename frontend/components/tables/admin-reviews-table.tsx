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
import { Review } from '@/lib/types';
import { reviewsAPI } from '@/lib/api/index';

interface AdminReviewsTableProps {
  searchQuery: string;
}

export default function AdminReviewsTable({ searchQuery }: AdminReviewsTableProps) {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await reviewsAPI.getAll();
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
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await reviewsAPI.delete(id);
      setReviews(reviews.filter(r => r._id !== id));
      toast({
        title: 'Review Deleted',
        description: 'The review has been permanently removed',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete review',
        variant: 'destructive',
      });
    }
  };

  const filteredReviews = reviews.filter(review =>
    review.property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.tenant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-700';
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'Flagged': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
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
            <TableHead>Landlord</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredReviews.map((review) => (
            <TableRow key={review._id}>
              <TableCell className="font-medium">{review.property.title}</TableCell>
              <TableCell>{renderStars(review.rating)}</TableCell>
              <TableCell className="max-w-md">{review.comment}</TableCell>
              <TableCell>{review.tenant.name}</TableCell>
              <TableCell>{review.landlord.name}</TableCell>
              <TableCell>{new Date(review.createdAt || '').toLocaleDateString()}</TableCell>
              <TableCell>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  Approved
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {filteredReviews.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No reviews found
        </div>
      )}
    </div>
  );
}
