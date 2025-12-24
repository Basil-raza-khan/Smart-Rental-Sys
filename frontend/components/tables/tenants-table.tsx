'use client';

import { useEffect } from 'react';
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
import { User } from '@/lib/types';
import { usersAPI } from '@/lib/api/index';
import { useUsersStore } from '@/lib/stores';

interface TenantsTableProps {
  searchQuery: string;
  onEdit: (user: User) => void;
}

export default function TenantsTable({ searchQuery, onEdit }: TenantsTableProps) {
  const { toast } = useToast();
  const { tenants, setTenants, deleteUser, setLoading, isLoading } = useUsersStore();

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        setLoading(true);
        const response = await usersAPI.getAll({ role: 'tenant' });
        setTenants(response.data.data.users);
      } catch (error) {
        console.error('Failed to fetch tenants:', error);
        toast({
          title: 'Error',
          description: 'Failed to load tenants',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTenants();
  }, [setTenants, setLoading, toast]);

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      if (currentStatus) {
        await usersAPI.deactivate(id);
      } else {
        await usersAPI.activate(id);
      }
      setTenants(tenants.map(tenant =>
        tenant._id === id
          ? { ...tenant, isActive: !currentStatus }
          : tenant
      ));
      toast({
        title: 'Status Updated',
        description: 'Tenant status has been changed',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update tenant status',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await usersAPI.delete(id);
      deleteUser(id);
      toast({
        title: 'Tenant Removed',
        description: 'The tenant account has been deleted',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete tenant',
        variant: 'destructive',
      });
    }
  };

  const filteredTenants = tenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tenant.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Current Property</TableHead>
            <TableHead>Join Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTenants.map((tenant) => (
            <TableRow key={tenant._id}>
              <TableCell className="font-medium">{tenant.name}</TableCell>
              <TableCell>{tenant.email}</TableCell>
              <TableCell>{tenant.phone || 'N/A'}</TableCell>
              <TableCell>N/A</TableCell>
              <TableCell>{new Date(tenant.createdAt || '').toLocaleDateString()}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  tenant.isActive
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {tenant.isActive ? 'Active' : 'Inactive'}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(tenant)}
                    className="whitespace-nowrap"
                  >
                    <i className="ri-edit-line w-4 h-4 flex items-center justify-center"></i>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleStatus(tenant._id, tenant.isActive)}
                    className="whitespace-nowrap"
                  >
                    <i className={`${tenant.isActive ? 'ri-close-circle-line' : 'ri-close-circle-line text-red-600'} w-4 h-4 flex items-center justify-center`}></i>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(tenant._id)}
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
      {filteredTenants.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No tenants found
        </div>
      )}
    </div>
  );
}
