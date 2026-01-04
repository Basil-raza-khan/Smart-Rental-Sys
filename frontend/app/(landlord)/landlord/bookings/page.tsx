'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/shared/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ActiveBookingsTable from '@/components/tables/active-bookings-table';
import AssignPropertyDialog from '@/components/forms/assign-property-dialog';
import { useAuth } from '@/lib/auth-context';

export default function LandlordBookingsPage() {
  const { user, loading, isInitialized, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  useEffect(() => {
    if (!loading && isInitialized && (!isAuthenticated || (user && user.role !== 'landlord'))) {
      router.push('/login');
    }
  }, [user, loading, isInitialized, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || user.role !== 'landlord') {
    return null;
  }

  return (
    <DashboardLayout role="landlord" user={user}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Active Bookings</h1>
            <p className="text-gray-600 mt-1">Manage property assignments and bookings</p>
          </div>
          <Button onClick={() => setIsAssignDialogOpen(true)} className="whitespace-nowrap">
            <i className="ri-user-add-line mr-2 w-4 h-4 flex items-center justify-center"></i>
            Assign Property
          </Button>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList>
            <TabsTrigger value="active">Active Bookings</TabsTrigger>
            <TabsTrigger value="pending">Pending Requests</TabsTrigger>
            <TabsTrigger value="history">Booking History</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <ActiveBookingsTable status="confirmed" userId={user._id} userRole={user.role} />
            </div>
          </TabsContent>

          <TabsContent value="pending" className="mt-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <ActiveBookingsTable status="pending" userId={user._id} userRole={user.role} />
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <ActiveBookingsTable status="history" userId={user._id} userRole={user.role} />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <AssignPropertyDialog
        isOpen={isAssignDialogOpen}
        onClose={() => setIsAssignDialogOpen(false)}
      />
    </DashboardLayout>
  );
}
