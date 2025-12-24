'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/shared/dashboard-layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AvailablePropertiesTable from '@/components/tables/available-properties-table';
import BookingDialog from '@/components/forms/booking-dialog';
import { useAuth } from '@/lib/auth-context';

export default function TenantBookingsPage() {
  const { user, loading, isInitialized } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);

  useEffect(() => {
    if (!loading && isInitialized && (!user || user.role !== 'tenant')) {
      router.push('/login');
    }
  }, [user, loading, isInitialized, router]);

  const handleBookProperty = (property: any) => {
    setSelectedProperty(property);
    setIsBookingDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || user.role !== 'tenant') {
    return null;
  }

  return (
    <DashboardLayout role="tenant" user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Browse Properties</h1>
          <p className="text-gray-600 mt-1">Find and book your perfect rental property</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 flex items-center justify-center"></i>
              <Input
                placeholder="Search by location, property name, or features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
            <Button variant="outline" className="whitespace-nowrap">
              <i className="ri-filter-line mr-2 w-4 h-4 flex items-center justify-center"></i>
              Filters
            </Button>
          </div>

          <AvailablePropertiesTable
            searchQuery={searchQuery}
            onBook={handleBookProperty}
          />
        </div>
      </div>

      <BookingDialog
        isOpen={isBookingDialogOpen}
        onClose={() => setIsBookingDialogOpen(false)}
        property={selectedProperty}
        user={user}
      />
    </DashboardLayout>
  );
}
