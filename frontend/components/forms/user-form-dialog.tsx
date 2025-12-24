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
import { useToast } from '@/hooks/use-toast';
import { User } from '@/lib/types';
import { usersAPI } from '@/lib/api/index';
import { useUsersStore } from '@/lib/stores';

interface UserFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null;
  userType: 'tenant' | 'landlord';
}

export default function UserFormDialog({ isOpen, onClose, user, userType }: UserFormDialogProps) {
  const { toast } = useToast();
  const { addUser } = useUsersStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    isActive: true,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        phone: user.phone || '',
        isActive: user.isActive,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        isActive: true,
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (user) {
        await usersAPI.update(user._id, {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        });
        toast({
          title: `${userType} Updated`,
          description: `${userType} has been updated successfully`,
        });
      } else {
        const response = await usersAPI.create({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          role: userType,
        });
        // Add the new user to the store immediately
        addUser(response.data.data.user);
        toast({
          title: `${userType} Created`,
          description: `${userType} has been created successfully`,
        });
      }
      onClose();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || `Failed to ${user ? 'update' : 'create'} ${userType}`,
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
          <DialogTitle>
            {user ? `Edit ${userType}` : `Add New ${userType}`}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="text-sm"
            />
          </div>

          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="text-sm"
            />
          </div>

          {!user && (
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="text-sm"
              />
            </div>
          )}

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              className="text-sm"
            />
          </div>

          <div>
            <Label htmlFor="isActive">Status</Label>
            <select
              id="isActive"
              value={formData.isActive ? 'Active' : 'Inactive'}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'Active' })}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm pr-8"
              required
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="whitespace-nowrap" disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" className="whitespace-nowrap" disabled={loading}>
              {loading ? 'Saving...' : (user ? 'Update' : 'Create')} {userType}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
