'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth-context';
import { propertiesAPI, usersAPI } from '@/lib/api/index';
import { usePropertiesStore } from '@/lib/stores';
import { useUsersStore } from '@/lib/stores';
import { Property, User } from '@/lib/types';

interface AssignPropertyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  property?: Property | null;
}

export default function AssignPropertyDialog({ isOpen, onClose, property }: AssignPropertyDialogProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const { landlordProperties, setLandlordProperties, updateProperty } = usePropertiesStore();
  const { tenants, setTenants } = useUsersStore();
  const [loading, setLoading] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState('');
  const [selectedTenant, setSelectedTenant] = useState('');

  useEffect(() => {
    if (isOpen && user?.role === 'landlord') {
      // Fetch landlord's properties if not already loaded
      if (landlordProperties.length === 0) {
        fetchLandlordProperties();
      }
      // Fetch tenants if not already loaded
      if (tenants.length === 0) {
        fetchTenants();
      }
    }

    // Set selected property if one is passed
    if (property) {
      setSelectedProperty(property._id);
    } else {
      setSelectedProperty('');
    }
    setSelectedTenant('');
  }, [isOpen, user, property, landlordProperties.length, tenants.length]);

  const fetchLandlordProperties = async () => {
    try {
      const response = await propertiesAPI.getMyProperties();
      setLandlordProperties(response.data.data.properties);
    } catch (error) {
      console.error('Failed to fetch properties:', error);
    }
  };

  const fetchTenants = async () => {
    try {
      const response = await usersAPI.getAll({ role: 'tenant' });
      setTenants(response.data.data.users);
    } catch (error) {
      console.error('Failed to fetch tenants:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProperty || !selectedTenant) {
      toast({
        title: 'Validation Error',
        description: 'Please select both property and tenant',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }
      const response = await propertiesAPI.assignTenant(selectedProperty, { 
        tenantId: selectedTenant,
        landlordId: user._id 
      });
      
      // Update the property in the store
      updateProperty(response.data.data);
      
      toast({
        title: 'Property Assigned',
        description: 'The property has been successfully assigned to the tenant',
      });
      onClose();
    } catch (error: any) {
      toast({
        title: 'Assignment Failed',
        description: error.response?.data?.message || 'Failed to assign property to tenant',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Property to Tenant</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="property">Select Property</Label>
            <Select value={selectedProperty} onValueChange={setSelectedProperty}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a property" />
              </SelectTrigger>
              <SelectContent>
                {landlordProperties.map((prop) => (
                  <SelectItem key={prop._id} value={prop._id}>
                    {prop.title} - {prop.address?.street}, {prop.address?.city} ({prop.status})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="tenant">Select Tenant</Label>
            <Select value={selectedTenant} onValueChange={setSelectedTenant}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a tenant" />
              </SelectTrigger>
              <SelectContent>
                {tenants.map((tenant) => (
                  <SelectItem key={tenant._id} value={tenant._id}>
                    {tenant.name} ({tenant.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="whitespace-nowrap" disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" className="whitespace-nowrap" disabled={loading}>
              {loading ? 'Assigning...' : 'Assign Property'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
