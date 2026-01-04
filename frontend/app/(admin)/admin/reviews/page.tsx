'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/shared/dashboard-layout';
import { Input } from '@/components/ui/input';
import AdminReviewsTable from '@/components/tables/admin-reviews-table';
import { useAuth } from '@/lib/auth-context';

export default function AdminReviewsPage() {
  const { user, loading, isInitialized, isAuthenticated } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!loading && isInitialized && (!isAuthenticated || (user && user.role !== 'admin'))) {
      router.push('/login');
    }
  }, [user, loading, isInitialized, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <DashboardLayout role="admin" user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Reviews</h1>
          <p className="text-gray-600 mt-1">Monitor and moderate property reviews</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 flex items-center justify-center"></i>
              <Input
                placeholder="Search reviews by property or user..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
          </div>

          <AdminReviewsTable searchQuery={searchQuery} />
        </div>
      </div>
    </DashboardLayout>
  );
}
