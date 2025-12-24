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
import { bookingsAPI } from '@/lib/api/index';
import { Booking } from '@/lib/types';

interface ActiveBookingsTableProps {
  status: string;
  userId: string;
  userRole: 'landlord' | 'tenant';
}

export default function ActiveBookingsTable({ status, userId, userRole }: ActiveBookingsTableProps) {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const params: any = { status };
        if (userRole === 'landlord') {
          params.landlord = userId;
        } else if (userRole === 'tenant') {
          params.tenant = userId;
        }
        const response = await bookingsAPI.getAll(params);
        setBookings(response.data.data.bookings);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
        toast({
          title: 'Error',
          description: 'Failed to load bookings',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [status, userId, userRole, toast]);

  const handleApprove = async (id: string) => {
    try {
      await bookingsAPI.updateStatus(id, { status: 'confirmed' });
      toast({
        title: 'Booking Approved',
        description: 'The booking request has been approved',
      });
      // Refresh the list
      const params: any = { status };
      if (userRole === 'landlord') {
        params.landlord = userId;
      } else if (userRole === 'tenant') {
        params.tenant = userId;
      }
      const response = await bookingsAPI.getAll(params);
      setBookings(response.data.data.bookings);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve booking',
        variant: 'destructive',
      });
    }
  };

  const handleReject = async (id: string) => {
    try {
      await bookingsAPI.updateStatus(id, { status: 'cancelled' });
      toast({
        title: 'Booking Rejected',
        description: 'The booking request has been rejected',
      });
      // Refresh the list
      const params: any = { status };
      if (userRole === 'landlord') {
        params.landlord = userId;
      } else if (userRole === 'tenant') {
        params.tenant = userId;
      }
      const response = await bookingsAPI.getAll(params);
      setBookings(response.data.data.bookings);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject booking',
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

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Property</TableHead>
            <TableHead>Tenant</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Monthly Rent</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking._id}>
              <TableCell className="font-medium">{booking.property.title}</TableCell>
              <TableCell>{booking.tenant.name}</TableCell>
              <TableCell>{booking.tenant.email}</TableCell>
              <TableCell>${booking.monthlyRent?.toLocaleString()}</TableCell>
              <TableCell>{booking.startDate ? new Date(booking.startDate).toLocaleDateString() : 'N/A'}</TableCell>
              <TableCell>{booking.endDate ? new Date(booking.endDate).toLocaleDateString() : 'N/A'}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {booking.status}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  {booking.status === 'pending' && userRole === 'landlord' && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleApprove(booking._id)}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50 whitespace-nowrap"
                      >
                        <i className="ri-check-line w-4 h-4 flex items-center justify-center"></i>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReject(booking._id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 whitespace-nowrap"
                      >
                        <i className="ri-close-line w-4 h-4 flex items-center justify-center"></i>
                      </Button>
                    </>
                  )}
                  {booking.status === 'confirmed' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="whitespace-nowrap"
                    >
                      <i className="ri-eye-line w-4 h-4 flex items-center justify-center"></i>
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {bookings.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No {status} bookings found
        </div>
      )}
    </div>
  );
}
