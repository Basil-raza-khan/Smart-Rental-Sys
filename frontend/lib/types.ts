export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'tenant' | 'landlord' | 'admin';
  isActive: boolean;
  phone?: string;
  address?: Address;
  profileImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Property {
  _id: string;
  landlord: User;
  title: string;
  description: string;
  address: Address;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  rent: number;
  deposit: number;
  amenities: string[];
  images: string[];
  status: 'available' | 'rented' | 'maintenance';
  currentTenant?: User;
  averageRating?: number;
  totalReviews?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProperty {
  title: string;
  description: string;
  address: Address;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  rent: number;
  deposit: number;
  amenities: string[];
  images: string[];
  status: 'available' | 'rented' | 'maintenance';
}

export interface Booking {
  _id: string;
  property: Property;
  tenant: User;
  landlord: User;
  startDate?: string;
  endDate?: string;
  monthlyRent: number;
  depositAmount: number;
  totalAmount?: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  bookings?: any;
}

export interface Maintenance {
  _id: string;
  property: Property;
  reportedBy: User;
  title: string;
  description: string;
  category: string;
  status: 'reported' | 'in_progress' | 'resolved' | 'closed' | any;
  priority: 'low' | 'medium' | 'high';
  scheduledDate?: string;
  cost?: number;
  completedDate?: string;
  createdAt?: Date;
  created_at?: Date;
  updatedAt?: string;
  maintenanceRequests?: any;
}

export interface Review {
  _id: string;
  property: Property;
  tenant: User;
  landlord: User;
  rating: number;
  comment: string;
  landlordReply?: string;
  landlordReplyDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiListResponse<T> {
  success: boolean;
  results: number;
  data: T;
  message?: string;
}