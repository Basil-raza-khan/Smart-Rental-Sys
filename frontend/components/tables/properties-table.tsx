'use client';

import { useState, useEffect } from 'react';
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
import { Property } from '@/lib/types';
import { usePropertiesStore } from '@/lib/stores';
import { useAuthStore } from '@/lib/stores';
import { propertiesAPI } from '@/lib/api/index';

interface PropertiesTableProps {
  searchQuery: string;
  onEdit: (property: Property) => void;
  onAssign?: (property: Property) => void; // Optional assign handler for landlords
  mode?: 'all' | 'landlord'; // 'all' for admin, 'landlord' for landlord dashboard
}

export default function PropertiesTable({ searchQuery, onEdit, onAssign, mode = 'all' }: PropertiesTableProps) {
  const { toast } = useToast();
  const { user, token, isInitialized } = useAuthStore();
  const {
    properties,
    landlordProperties,
    setProperties,
    setLandlordProperties,
    deleteProperty,
    setLoading,
    isLoading
  } = usePropertiesStore();

  const displayProperties = mode === 'landlord' ? landlordProperties : properties;

  useEffect(() => {
    const fetchProperties = async () => {
      console.log('fetchProperties called', { user, token, isInitialized, mode });

      // Only fetch if auth is initialized and user exists
      if (!isInitialized || !user) {
        console.log('Skipping fetch - not initialized or no user');
        return;
      }

      try {
        setLoading(true);
        console.log('Fetching properties for landlord:', user._id);

        if (mode === 'landlord') {
          // Use getAll with landlord filter instead of getMyProperties
          const response = await propertiesAPI.getAll({ landlord: user._id });
          console.log('API Response:', response);
          console.log('Response data:', response.data);

          // Handle different response structures
          const properties = response.data.data?.properties || response.data.data || [];
          console.log('Parsed properties:', properties);

          setLandlordProperties(Array.isArray(properties) ? properties : []);
        } else {
          const response = await propertiesAPI.getAll();
          // Handle different response structures
          const properties = response.data.data?.properties || response.data.data || [];
          setProperties(Array.isArray(properties) ? properties : []);
        }
      } catch (error: any) {
        console.error('Failed to fetch properties:', error);
        console.error('Error response:', error.response?.data);
        toast({
          title: 'Error',
          description: error.response?.data?.message || 'Failed to load properties',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [mode, user, token, isInitialized, setProperties, setLandlordProperties, setLoading, toast]);

  const handleDelete = async (id: string) => {
    try {
      await propertiesAPI.delete(id);
      deleteProperty(id);
      toast({
        title: 'Property Deleted',
        description: 'The property has been removed successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete property',
        variant: 'destructive',
      });
    }
  };

  const filteredProperties = displayProperties.filter(property =>
    property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.address.street.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.address.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading properties...</span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Property Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Bed/Bath</TableHead>
            <TableHead>Monthly Rent</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProperties.map((property) => (
            <TableRow key={property._id}>
              <TableCell className="font-medium">{property.title}</TableCell>
              <TableCell>{`${property.address.street}, ${property.address.city}, ${property.address.state}`}</TableCell>
              <TableCell>{property.propertyType}</TableCell>
              <TableCell>{property.bedrooms}BR / {property.bathrooms}BA</TableCell>
              <TableCell>${property.rent.toLocaleString()}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  property.status === 'available'
                    ? 'bg-green-100 text-green-700'
                    : property.status === 'rented'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {property.status}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  {mode === 'landlord' && onAssign && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onAssign(property)}
                      className="whitespace-nowrap text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <i className="ri-user-add-line w-4 h-4 flex items-center justify-center"></i>
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(property)}
                    className="whitespace-nowrap"
                  >
                    <i className="ri-edit-line w-4 h-4 flex items-center justify-center"></i>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(property._id)}
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
      {filteredProperties.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No properties found
        </div>
      )}
    </div>
  );
}
