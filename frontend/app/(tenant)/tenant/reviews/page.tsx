'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/shared/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReviewsTable from '@/components/tables/reviews-table';
import ReviewFormDialog from '@/components/forms/review-form-dialog';
import { useAuth } from '@/lib/auth-context';

export default function TenantReviewsPage() {
  const { user, loading, isInitialized } = useAuth();
  const router = useRouter();
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

  useEffect(() => {
    if (!loading && isInitialized && (!user || user.role !== 'tenant')) {
      router.push('/login');
    }
  }, [user, loading, isInitialized, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || user.role !== 'tenant') {
    return null;
  }

  return (
    <DashboardLayout role="tenant" user={user}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Property Reviews</h1>
            <p className="text-gray-600 mt-1">View and share your rental experiences</p>
          </div>
          <Button onClick={() => setIsReviewDialogOpen(true)} className="whitespace-nowrap">
            <i className="ri-add-line mr-2 w-4 h-4 flex items-center justify-center"></i>
            Write Review
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Reviews</TabsTrigger>
            <TabsTrigger value="my-reviews">My Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <ReviewsTable filter="all" />
            </div>
          </TabsContent>

          <TabsContent value="my-reviews" className="mt-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <ReviewsTable filter="my-reviews" userId={user._id} />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <ReviewFormDialog
        isOpen={isReviewDialogOpen}
        onClose={() => setIsReviewDialogOpen(false)}
        userId={user._id}
      />
    </DashboardLayout>
  );
}
