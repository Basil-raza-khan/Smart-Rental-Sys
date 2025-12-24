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
import { Maintenance } from '@/lib/types';
import { maintenanceAPI } from '@/lib/api/index';
import { useAuth } from '@/lib/auth-context';

interface MaintenanceTableProps {
  userId: string;
  role: 'tenant' | 'landlord';
  searchQuery: string;
  showLandlordActions?: boolean;
}

export default function MaintenanceTable({ userId, role, searchQuery, showLandlordActions = false }: MaintenanceTableProps) {
  const { toast } = useToast();
  const [maintenanceRequests, setMaintenanceRequests] = useState<Maintenance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaintenanceRequests = async () => {
      try {
        setLoading(true);
        const params: any = { userId, role };
        const response = await maintenanceAPI.getAll(params);
        setMaintenanceRequests(response.data.data.maintenanceRequests || []);
      } catch (error) {
        console.error('Failed to fetch maintenance requests:', error);
        toast({
          title: 'Error',
          description: 'Failed to load maintenance requests',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMaintenanceRequests();
  }, [userId, role, toast]);

  const handleUpdateStatus = async (id: string, newStatus: 'reported' | 'in_progress' | 'resolved' | 'closed') => {
    try {
      await maintenanceAPI.update(id, { 
        status: newStatus, 
        userId, 
        role 
      });
      
      // Update local state
      setMaintenanceRequests(requests => 
        requests.map(req => 
          req._id === id ? { ...req, status: newStatus } : req
        )
      );
      
      toast({
        title: 'Status Updated',
        description: `Request status changed to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update request status',
        variant: 'destructive',
      });
    }
  };

  const filteredRequests = maintenanceRequests.filter(request =>
    request.property?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-700';
      case 'in_progress': return 'bg-blue-100 text-blue-700';
      case 'reported': return 'bg-yellow-100 text-yellow-700';
      case 'closed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Property</TableHead>
            <TableHead>Issue</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            {showLandlordActions && <TableHead>Submitted By</TableHead>}
            <TableHead>Date</TableHead>
            {showLandlordActions && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRequests.map((request) => (
            <TableRow key={request._id}>
              <TableCell className="font-medium">{request.property?.title || 'N/A'}</TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{request.title}</div>
                  {request.description && (
                    <div className="text-sm text-gray-500 mt-1">{request.description}</div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority || 'medium')}`}>
                  {request.priority || 'medium'}
                </span>
              </TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status || 'reported')}`}>
                  {request.status || 'reported'}
                </span>
              </TableCell>
              {showLandlordActions && <TableCell>{request.reportedBy?.name || 'N/A'}</TableCell>}
              <TableCell>{new Date(request.createdAt || new Date()).toLocaleDateString()}</TableCell>
              {showLandlordActions && (
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {request.status === 'reported' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUpdateStatus(request._id, 'in_progress')}
                        className="whitespace-nowrap"
                      >
                        Start
                      </Button>
                    )}
                    {request.status === 'in_progress' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUpdateStatus(request._id, 'resolved')}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50 whitespace-nowrap"
                      >
                        Complete
                      </Button>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {filteredRequests.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No maintenance requests found
        </div>
      )}
    </div>
  );
}
