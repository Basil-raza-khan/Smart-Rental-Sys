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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth-context';
import { maintenanceAPI, propertiesAPI } from '@/lib/api/index';
import { Property } from '@/lib/types';

interface MaintenanceFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MaintenanceFormDialog({ isOpen, onClose }: MaintenanceFormDialogProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [formData, setFormData] = useState({
    property: '',
    title: '',
    description: '',
    category: '',
    priority: 'medium',
  });

  useEffect(() => {
    if (isOpen && user?.role === 'tenant') {
      fetchTenantProperties();
    }
  }, [isOpen, user]);

  const fetchTenantProperties = async () => {
    try {
      // For tenants, we need to get properties they are assigned to
      // This might require a different API endpoint or filtering
      const response = await propertiesAPI.getAll();
      // Filter properties where currentTenant matches the user
      const tenantProperties = response.data.data.properties.filter(
        (property: Property) => property.currentTenant?._id === user?._id
      );
      setProperties(tenantProperties);
    } catch (error) {
      console.error('Failed to fetch properties:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Error',
        description: 'User not authenticated',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      await maintenanceAPI.create({
        ...formData,
        userId: user._id,
        role: user.role,
      });
      
      toast({
        title: 'Maintenance Request Submitted',
        description: 'Your request has been sent to the landlord',
      });
      onClose();
      // Reset form
      setFormData({
        property: '',
        title: '',
        description: '',
        category: '',
        priority: 'medium',
      });
    } catch (error: any) {
      toast({
        title: 'Submission Failed',
        description: error.response?.data?.message || 'Failed to submit maintenance request',
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
          <DialogTitle>Submit Maintenance Request</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="property">Select Property</Label>
            <Select value={formData.property} onValueChange={(value) => setFormData({ ...formData, property: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a property" />
              </SelectTrigger>
              <SelectContent>
                {properties.map((property) => (
                  <SelectItem key={property._id} value={property._id}>
                    {property.title} - {property.address?.street}, {property.address?.city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="title">Issue Title</Label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
              placeholder="Brief title for the issue"
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category (Optional)</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="plumbing">Plumbing</SelectItem>
                <SelectItem value="electrical">Electrical</SelectItem>
                <SelectItem value="heating">Heating/Cooling</SelectItem>
                <SelectItem value="structural">Structural</SelectItem>
                <SelectItem value="appliance">Appliance</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="priority">Priority Level</Label>
            <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Describe the Issue</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              placeholder="Please provide detailed information about the maintenance issue..."
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="whitespace-nowrap" disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" className="whitespace-nowrap" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Request'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
