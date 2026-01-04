'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/shared/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TenantsTable from '@/components/tables/tenants-table';
import UserFormDialog from '@/components/forms/user-form-dialog';
import { useAuth } from '@/lib/auth-context';
import { useUsersStore } from '@/lib/stores';

export default function AdminTenantsPage() {
  const { user, loading, isInitialized, isAuthenticated } = useAuth();
  const { tenants } = useUsersStore();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!loading && isInitialized && (!isAuthenticated || (user && user.role !== 'admin'))) {
      router.push('/login');
    }
  }, [user, loading, isInitialized, isAuthenticated, router]);

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <DashboardLayout role="admin" user={user}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Tenants</h1>
            <p className="text-gray-600 mt-1">View and manage all tenant accounts ({tenants.length} total)</p>
          </div>

          <Button onClick={() => setIsDialogOpen(true)} className="whitespace-nowrap">
            <i className="ri-user-add-line mr-2 w-4 h-4 flex items-center justify-center"></i>
            Add Tenant
          </Button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 flex items-center justify-center"></i>
              <Input
                placeholder="Search tenants by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
          </div>

          <TenantsTable
            searchQuery={searchQuery}
            onEdit={handleEdit}
          />
        </div>
      </div>

      <UserFormDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        user={editingUser}
        userType="tenant"
      />
    </DashboardLayout>
  );
}
