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

interface LandlordsTableProps {
  searchQuery: string;
  onEdit: (user: User) => void;
}

export default function LandlordsTable({ searchQuery, onEdit }: LandlordsTableProps) {
  const { toast } = useToast();
  const { landlords, setLandlords, deleteUser, setLoading, isLoading } = useUsersStore();

  useEffect(() => {
    const fetchLandlords = async () => {
      try {
        setLoading(true);
        const response = await usersAPI.getAll({ role: 'landlord' });
        setLandlords(response.data.data.users);
      } catch (error) {
        console.error('Failed to fetch landlords:', error);
        toast({
          title: 'Error',
          description: 'Failed to load landlords',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLandlords();
  }, [setLandlords, setLoading, toast]);

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      if (currentStatus) {
        await usersAPI.deactivate(id);
      } else {
        await usersAPI.activate(id);
      }
      setLandlords(landlords.map(landlord =>
        landlord._id === id
          ? { ...landlord, isActive: !currentStatus }
          : landlord
      ));
      toast({
        title: 'Status Updated',
        description: 'Landlord status has been changed',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update landlord status',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await usersAPI.delete(id);
      deleteUser(id);
      toast({
        title: 'Landlord Removed',
        description: 'The landlord account has been deleted',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete landlord',
        variant: 'destructive',
      });
    }
  };

  const filteredLandlords = landlords.filter(landlord =>
    landlord.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    landlord.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Properties</TableHead>
            <TableHead>Join Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredLandlords.map((landlord) => (
            <TableRow key={landlord._id}>
              <TableCell className="font-medium">{landlord.name}</TableCell>
              <TableCell>{landlord.email}</TableCell>
              <TableCell>{landlord.phone || 'N/A'}</TableCell>
              <TableCell>N/A</TableCell>
              <TableCell>{new Date(landlord.createdAt || '').toLocaleDateString()}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  landlord.isActive
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {landlord.isActive ? 'Active' : 'Inactive'}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(landlord)}
                    className="whitespace-nowrap"
                  >
                    <i className="ri-edit-line w-4 h-4 flex items-center justify-center"></i>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleStatus(landlord._id, landlord.isActive)}
                    className="whitespace-nowrap"
                  >
                    <i className={`${landlord.isActive ? 'ri-close-circle-line' : 'ri-close-circle-line text-red-600'} w-4 h-4 flex items-center justify-center`}></i>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(landlord._id)}
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
      {filteredLandlords.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No landlords found
        </div>
      )}
    </div>
  );
}
