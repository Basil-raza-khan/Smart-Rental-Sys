'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth-context';

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { signup } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'landlord' | 'tenant' | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRole) {
      toast({
        title: 'Role Required',
        description: 'Please select your role to continue',
        variant: 'destructive',
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Password Mismatch',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: selectedRole,
      });

      toast({
        title: 'Account Created',
        description: `Welcome to SmartRent! Redirecting to ${selectedRole} dashboard...`,
      });

      setTimeout(() => {
        if (selectedRole === 'landlord') {
          router.push('/landlord/properties');
        } else if (selectedRole === 'tenant') {
          router.push('/tenant/bookings');
        }
      }, 1000);
    } catch (error: any) {
      toast({
        title: 'Signup Failed',
        description: error.response?.data?.message || 'Failed to create account',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <img 
              src="https://public.readdy.ai/ai/img_res/461a8bd4-8f34-4d0d-8764-bc93a46fd029.png" 
              alt="SmartRent" 
              className="h-10 w-10 object-contain"
            />
            <span className="text-2xl font-bold text-gray-900">SmartRent</span>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Your Account</h1>
          <p className="text-gray-600">Select your role and get started today</p>
        </div>

        {!selectedRole ? (
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <Card 
              className="p-8 cursor-pointer hover:shadow-xl transition-all border-2 hover:border-blue-500"
              onClick={() => setSelectedRole('landlord')}
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-home-4-line text-3xl text-blue-600 w-8 h-8 flex items-center justify-center"></i>
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Property Owner</h3>
              <p className="text-gray-600 text-center text-sm mb-4">
                List and manage your properties, handle bookings, and connect with tenants
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <i className="ri-check-line text-green-600 w-4 h-4 flex items-center justify-center"></i>
                  Create property listings
                </li>
                <li className="flex items-center gap-2">
                  <i className="ri-check-line text-green-600 w-4 h-4 flex items-center justify-center"></i>
                  Manage bookings
                </li>
                <li className="flex items-center gap-2">
                  <i className="ri-check-line text-green-600 w-4 h-4 flex items-center justify-center"></i>
                  Handle maintenance requests
                </li>
              </ul>
            </Card>

            <Card 
              className="p-8 cursor-pointer hover:shadow-xl transition-all border-2 hover:border-green-500"
              onClick={() => setSelectedRole('tenant')}
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-user-line text-3xl text-green-600 w-8 h-8 flex items-center justify-center"></i>
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Tenant</h3>
              <p className="text-gray-600 text-center text-sm mb-4">
                Find your perfect rental, book properties, and manage your tenancy
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <i className="ri-check-line text-green-600 w-4 h-4 flex items-center justify-center"></i>
                  Browse available properties
                </li>
                <li className="flex items-center gap-2">
                  <i className="ri-check-line text-green-600 w-4 h-4 flex items-center justify-center"></i>
                  Submit booking requests
                </li>
                <li className="flex items-center gap-2">
                  <i className="ri-check-line text-green-600 w-4 h-4 flex items-center justify-center"></i>
                  Request maintenance
                </li>
              </ul>
            </Card>
          </div>
        ) : (
          <Card className="max-w-md mx-auto p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                Sign up as {selectedRole === 'landlord' ? 'Property Owner' : 'Tenant'}
              </h2>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedRole(null)}
                className="whitespace-nowrap"
              >
                Change Role
              </Button>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
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
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="text-sm"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="text-sm"
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="text-sm"
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  className="text-sm"
                />
              </div>

              <div className="text-sm text-gray-600">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" className="mt-1 rounded" required />
                  <span>
                    I agree to the{' '}
                    <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                  </span>
                </label>
              </div>

              <Button type="submit" className="w-full whitespace-nowrap" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
                Login here
              </Link>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
