'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/shared/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MaintenanceTable from '@/components/tables/maintenance-table';
import MaintenanceFormDialog from '@/components/forms/maintenance-form-dialog';
import { useAuth } from '@/lib/auth-context';

export default function TenantMaintenancePage() {
  const { user, loading, isInitialized, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!loading && isInitialized && (!isAuthenticated || (user && user.role !== 'tenant'))) {
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

  if (!user || user.role !== 'tenant') {
    return null;
  }

  return (
    <DashboardLayout role="tenant" user={user}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Maintenance Requests</h1>
            <p className="text-gray-600 mt-1">Submit and track maintenance requests</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)} className="whitespace-nowrap">
            <i className="ri-add-line mr-2 w-4 h-4 flex items-center justify-center"></i>
            New Request
          </Button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 flex items-center justify-center"></i>
              <Input
                placeholder="Search maintenance requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
          </div>

          <MaintenanceTable 
            userId={user._id} 
            role="tenant" 
            searchQuery={searchQuery} 
          />
        </div>
      </div>

      <MaintenanceFormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </DashboardLayout>
  );
}
