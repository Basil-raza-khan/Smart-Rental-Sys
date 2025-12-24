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
import { Property } from '@/lib/types';
import { propertiesAPI } from '@/lib/api/index';

interface AvailablePropertiesTableProps {
  searchQuery: string;
  onBook: (property: Property) => void;
}

export default function AvailablePropertiesTable({ searchQuery, onBook }: AvailablePropertiesTableProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await propertiesAPI.getAll({ status: 'available' });
        setProperties(response.data.data.properties);
      } catch (error) {
        console.error('Failed to fetch properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const filteredProperties = properties.filter(property =>
    property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.address.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.address.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            {/* <TableHead>Rating</TableHead> */}
            <TableHead>Landlord</TableHead>
            <TableHead className="text-right">Action</TableHead>
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
              {/* <TableCell>
                <div className="flex items-center gap-1">
                  <i className="ri-star-fill text-yellow-500 w-4 h-4 flex items-center justify-center"></i>
                  <span>{property.averageRating?.toFixed(1) || 'N/A'}</span>
                </div>
              </TableCell> */}
              <TableCell>{property.landlord.name}</TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  onClick={() => onBook(property)}
                  className="whitespace-nowrap"
                >
                  Book Now
                </Button>
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
