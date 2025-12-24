import api from '../api';
import { User, Property, CreateProperty, Booking, Maintenance, Review, ApiResponse, ApiListResponse } from '../types';

// Auth API
export const authAPI = {
  signup: (data: { name: string; email: string; password: string; phone: string; role: string; address?: any }) =>
    api.post<ApiResponse<{ user: User; token: string }>>('/auth/signup', data),

  login: (data: { email: string; password: string }) =>
    api.post<ApiResponse<{ user: User; token: string }>>('/auth/login', data),

  getMe: () => api.get<ApiResponse<{ user: User }>>('/auth/me'),

  updateMe: (data: Partial<User>) => api.patch<ApiResponse<{ user: User }>>('/auth/updateMe', data),

  updatePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.patch<ApiResponse<{ user: User }>>('/auth/updatePassword', data)
};

// Properties API
export const propertiesAPI = {
  getAll: (params?: { city?: string; minRent?: number; maxRent?: number; bedrooms?: number; status?: string; propertyType?: string; landlord?: string }) =>
    api.get<ApiListResponse<{ properties: Property[] }>>('/properties', { params }),

  getById: (id: string) => api.get<ApiResponse<Property>>(`/properties?landlord=/${id}`),

  create: (data: CreateProperty) =>
    api.post<ApiResponse<{ property: Property }>>('/properties', data),

  update: (id: string, data: Partial<Property>) =>
    api.patch<ApiResponse<{ property: Property }>>(`/properties/${id}`, data),

  delete: (id: string) => api.delete<ApiResponse<null>>(`/properties/${id}`),

  getMyProperties: () => api.get<ApiListResponse<{ properties: Property[] }>>('/properties/landlord/my-properties'),

  assignTenant: (id: string, data: { tenantId: string; landlordId: string }) =>
    api.patch<ApiResponse<Property>>(`/properties/${id}/assign-tenant`, data)
};

// Bookings API
export const bookingsAPI = {
  getAll: (params?: { status?: string; tenant?: string; landlord?: string; property?: string }) =>
    api.get<ApiListResponse<Booking>>('/bookings', { params }),

  getById: (id: string) => api.get<ApiResponse<Booking>>(`/bookings/${id}`),

  create: (data: { property: string; tenant: string; startDate?: string; endDate?: string; notes?: string }) =>
    api.post<ApiResponse<Booking>>('/bookings', data),

  updateStatus: (id: string, data: { status: string; rejectionReason?: string }) =>
    api.patch<ApiResponse<Booking>>(`/bookings/${id}/status`, data)
};

// Maintenance API
export const maintenanceAPI = {
  getAll: (params?: { status?: string; priority?: string; property?: string; userId?: string; role?: string }) =>
    api.get<ApiListResponse<Maintenance>>('/maintenance', { params }),

  getById: (id: string, params?: { userId?: string; role?: string }) => 
    api.get<ApiResponse<Maintenance>>(`/maintenance/${id}`, { params }),

  create: (data: { property: string; title: string; description: string; category: string; priority: string; userId: string; role: string }) =>
    api.post<ApiResponse<Maintenance>>('/maintenance', data),

  update: (id: string, data: Partial<Maintenance> & { userId?: string; role?: string }) =>
    api.patch<ApiResponse<Maintenance>>(`/maintenance/${id}`, data),

  delete: (id: string, data?: { userId?: string; role?: string }) => 
    api.delete<ApiResponse<null>>(`/maintenance/${id}`, { data })
};

// Reviews API
export const reviewsAPI = {
  getAll: (params?: { property?: string; tenant?: string; landlord?: string; minRating?: number; maxRating?: number }) =>
    api.get<ApiListResponse<{ reviews: Review[] }>>('/reviews', { params }),

  getById: (id: string) => api.get<ApiResponse<Review>>(`/reviews/${id}`),

  create: (data: { property: string; tenant: string; rating: number; comment: string }) =>
    api.post<ApiResponse<Review>>('/reviews', data),

  update: (id: string, data: { userId: string; rating?: number; comment?: string; images?: string[] }) =>
    api.patch<ApiResponse<Review>>(`/reviews/${id}`, data),

  reply: (id: string, data: { userId: string; landlordReply: string }) =>
    api.patch<ApiResponse<Review>>(`/reviews/${id}/reply`, data),

  delete: (id: string, data: { userId: string }) =>
    api.delete<ApiResponse<null>>(`/reviews/${id}`, { data })
};

// Users API (Admin)
export const usersAPI = {
  getAll: (params?: { role?: string; isActive?: boolean }) =>
    api.get<ApiListResponse<{ users: User[] }>>('/users', { params }),

  create: (data: { name: string; email: string; password: string; phone: string; role: string; address?: any }) =>
    api.post<ApiResponse<{ user: User }>>('/users', data),

  getById: (id: string) => api.get<ApiResponse<User>>(`/users/${id}`),

  update: (id: string, data: Partial<User>) =>
    api.patch<ApiResponse<User>>(`/users/${id}`, data),

  delete: (id: string) => api.delete<ApiResponse<null>>(`/users/${id}`),

  activate: (id: string) => api.patch<ApiResponse<User>>(`/users/${id}/activate`),

  deactivate: (id: string) => api.patch<ApiResponse<User>>(`/users/${id}/deactivate`)
};