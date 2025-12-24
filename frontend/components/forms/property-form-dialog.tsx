'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { propertiesAPI } from '@/lib/api/index';
import { usePropertiesStore, useAuthStore } from '@/lib/stores';

interface PropertyFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  property?: any;
}

export default function PropertyFormDialog({ isOpen, onClose, property }: PropertyFormDialogProps) {
  const { toast } = useToast();
  const { addProperty, updateProperty } = usePropertiesStore();
  const { user, token, isInitialized } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: property?.title || '',
    description: property?.description || '',
    street: property?.address?.street || '',
    city: property?.address?.city || '',
    state: property?.address?.state || '',
    zipCode: property?.address?.zipCode || '',
    country: property?.address?.country || 'USA',
    propertyType: property?.propertyType || '',
    bedrooms: property?.bedrooms || '',
    bathrooms: property?.bathrooms || '',
    area: property?.area || '',
    rent: property?.rent || '',
    deposit: property?.deposit || '',
    amenities: property?.amenities?.join(', ') || '',
  });

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title || '',
        description: property.description || '',
        street: property.address?.street || '',
        city: property.address?.city || '',
        state: property.address?.state || '',
        zipCode: property.address?.zipCode || '',
        country: property.address?.country || 'USA',
        propertyType: property.propertyType || '',
        bedrooms: property.bedrooms || '',
        bathrooms: property.bathrooms || '',
        area: property.area || '',
        rent: property.rent || '',
        deposit: property.deposit || '',
        amenities: property.amenities?.join(', ') || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'USA',
        propertyType: '',
        bedrooms: '',
        bathrooms: '',
        area: '',
        rent: '',
        deposit: '',
        amenities: '',
      });
    }
  }, [property]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);


    try {
      const propertyData = {
        title: formData.title,
        description: formData.description,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        propertyType: formData.propertyType,
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        area: parseInt(formData.area),
        rent: parseInt(formData.rent),
        deposit: parseInt(formData.deposit) || 0,
        amenities: formData.amenities.split(',').map((a: string) => a.trim()).filter((a: string) => a),
        images: [],
        status: 'available' as const,
        landlord: user?._id,
      };

      if (property) {
        // Update existing property
        const response = await propertiesAPI.update(property._id, propertyData);
        updateProperty(response.data.data.property);
        toast({
          title: 'Property Updated',
          description: 'Property has been updated successfully',
        });
      } else {
        // Create new property
        const response = await propertiesAPI.create(propertyData);
        addProperty(response.data.data.property);
        toast({
          title: 'Property Created',
          description: 'Property has been created successfully',
        });
      }

      onClose();
    } catch (error: any) {
      console.error('Property save error:', error);
      console.error('Error response:', error.response);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to save property',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{property ? 'Edit Property' : 'Add New Property'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Property Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="propertyType">Property Type</Label>
              <Input
                id="propertyType"
                value={formData.propertyType}
                onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                placeholder="apartment, house, villa..."
                required
                className="text-sm"
              />
            </div>
            <div>
              <Label htmlFor="area">Area (sq ft)</Label>
              <Input
                id="area"
                type="number"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                required
                className="text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                required
                className="text-sm"
              />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
                className="text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                required
                className="text-sm"
              />
            </div>
            <div>
              <Label htmlFor="zipCode">Zip Code</Label>
              <Input
                id="zipCode"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                required
                className="text-sm"
              />
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                required
                className="text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                type="number"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                required
                className="text-sm"
              />
            </div>
            <div>
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                type="number"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                required
                className="text-sm"
              />
            </div>
            <div>
              <Label htmlFor="rent">Monthly Rent ($)</Label>
              <Input
                id="rent"
                type="number"
                value={formData.rent}
                onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
                required
                className="text-sm"
              />
            </div>
            <div>
              <Label htmlFor="deposit">Deposit ($)</Label>
              <Input
                id="deposit"
                type="number"
                value={formData.deposit}
                onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                className="text-sm"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="amenities">Amenities</Label>
            <Input
              id="amenities"
              value={formData.amenities}
              onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
              placeholder="WiFi, Parking, Gym (comma separated)"
              className="text-sm"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              placeholder="Describe the property features, amenities, and highlights..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="whitespace-nowrap" disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" className="whitespace-nowrap" disabled={loading}>
              {loading ? 'Saving...' : (property ? 'Update Property' : 'Create Property')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
