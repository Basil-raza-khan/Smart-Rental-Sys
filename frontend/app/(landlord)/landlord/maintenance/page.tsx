'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/shared/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MaintenanceTable from '@/components/tables/maintenance-table';
import { useAuth } from '@/lib/auth-context';

export default function LandlordMaintenancePage() {
  const { user, loading, isInitialized, isAuthenticated } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!loading && isInitialized && (!isAuthenticated || (user && user.role !== 'landlord'))) {
      router.push('/login');
    }
  }, [user, loading, isInitialized, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user || user.role !== 'landlord') {
    return null;
  }

  return (
    <DashboardLayout role="landlord" user={user}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Maintenance Requests</h1>
            <p className="text-muted-foreground">
              Manage maintenance requests for your properties
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search maintenance requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <MaintenanceTable
          userId={user._id}
          role={user.role}
          searchQuery={searchQuery}
          showLandlordActions={true}
        />
      </div>
    </DashboardLayout>
  );
}