'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';

interface DashboardLayoutProps {
  children: ReactNode;
  role: 'landlord' | 'tenant' | 'admin';
  user?: any;
}

export default function DashboardLayout({ children, role, user }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const getLandlordNavItems = () => [
    { href: '/landlord/properties', label: 'Properties', icon: 'ri-home-4-line' },
    { href: '/landlord/bookings', label: 'Active Bookings', icon: 'ri-calendar-check-line' },
    { href: '/landlord/maintenance', label: 'Maintenance', icon: 'ri-tools-line' },
  ];

  const getTenantNavItems = () => [
    { href: '/tenant/bookings', label: 'Browse Properties', icon: 'ri-search-line' },
    { href: '/tenant/reviews', label: 'Reviews', icon: 'ri-star-line' },
    { href: '/tenant/maintenance', label: 'Maintenance', icon: 'ri-tools-line' },
  ];

  const getAdminNavItems = () => [
    { href: '/admin/tenants', label: 'Tenants', icon: 'ri-user-line' },
    { href: '/admin/landlords', label: 'Landlords', icon: 'ri-home-4-line' },
    { href: '/admin/reviews', label: 'Reviews', icon: 'ri-star-line' },
  ];

  const navItems = 
    role === 'landlord' ? getLandlordNavItems() :
    role === 'tenant' ? getTenantNavItems() :
    getAdminNavItems();

  const getRoleTitle = () => {
    if (role === 'landlord') return 'Property Owner Dashboard';
    if (role === 'tenant') return 'Tenant Dashboard';
    return 'Admin Dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <img 
                  src="https://public.readdy.ai/ai/img_res/461a8bd4-8f34-4d0d-8764-bc93a46fd029.png" 
                  alt="SmartRent" 
                  className="h-8 w-8 object-contain"
                />
                <span className="text-xl font-bold text-gray-900">SmartRent</span>
              </Link>
              
              <nav className="hidden md:flex items-center gap-1">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={pathname === item.href ? 'default' : 'ghost'}
                      className="whitespace-nowrap"
                    >
                      <i className={`${item.icon} mr-2 w-4 h-4 flex items-center justify-center`}></i>
                      {item.label}
                    </Button>
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-4">
               <div className="hidden md:block text-right">
                 <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                 <p className="text-xs text-gray-500 capitalize">{role}</p>
               </div>
              <Button variant="outline" onClick={handleLogout} className="whitespace-nowrap">
                <i className="ri-logout-box-line mr-2 w-4 h-4 flex items-center justify-center"></i>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
