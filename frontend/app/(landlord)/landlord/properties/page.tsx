'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/shared/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PropertiesTable from '@/components/tables/properties-table';
import PropertyFormDialog from '@/components/forms/property-form-dialog';
import AssignPropertyDialog from '@/components/forms/assign-property-dialog';
import { useAuth } from '@/lib/auth-context';

export default function LandlordPropertiesPage() {
  const { user, loading, isInitialized, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [assigningProperty, setAssigningProperty] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!loading && isInitialized && (!isAuthenticated || (user && user.role !== 'landlord'))) {
      router.push('/login');
    }
  }, [user, loading, isInitialized, isAuthenticated, router]);

  const handleEdit = (property: any) => {
    setEditingProperty(property);
    setIsDialogOpen(true);
  };

  const handleAssign = (property: any) => {
    setAssigningProperty(property);
    setIsAssignDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProperty(null);
  };

  const handleCloseAssignDialog = () => {
    setIsAssignDialogOpen(false);
    setAssigningProperty(null);
  };

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
            <h1 className="text-3xl font-bold text-gray-900">My Properties</h1>
            <p className="text-gray-600 mt-1">Manage your property listings</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)} className="whitespace-nowrap">
            <i className="ri-add-line mr-2 w-4 h-4 flex items-center justify-center"></i>
            Add Property
          </Button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 flex items-center justify-center"></i>
              <Input
                placeholder="Search properties by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
          </div>

          <PropertiesTable
            searchQuery={searchQuery}
            onEdit={handleEdit}
            onAssign={handleAssign}
            mode="landlord"
          />
        </div>
      </div>

      <PropertyFormDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        property={editingProperty}
      />

      <AssignPropertyDialog
        isOpen={isAssignDialogOpen}
        onClose={handleCloseAssignDialog}
        property={assigningProperty}
      />
    </DashboardLayout>
  );
}
