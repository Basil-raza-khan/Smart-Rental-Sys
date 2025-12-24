import { create } from 'zustand';
import { User } from '../types';

interface UsersState {
  users: User[];
  tenants: User[];
  landlords: User[];
  isLoading: boolean;
  error: string | null;
  setUsers: (users: User[]) => void;
  setTenants: (tenants: User[]) => void;
  setLandlords: (landlords: User[]) => void;
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
  deleteUser: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useUsersStore = create<UsersState>((set) => ({
  users: [],
  tenants: [],
  landlords: [],
  isLoading: false,
  error: null,
  setUsers: (users) => set({ users }),
  setTenants: (tenants) => set({ tenants }),
  setLandlords: (landlords) => set({ landlords }),
  addUser: (user) =>
    set((state) => ({
      users: [...state.users, user],
      tenants: user.role === 'tenant' ? [...state.tenants, user] : state.tenants,
      landlords: user.role === 'landlord' ? [...state.landlords, user] : state.landlords,
    })),
  updateUser: (user) =>
    set((state) => ({
      users: state.users.map((u) => (u._id === user._id ? user : u)),
      tenants: state.tenants.map((u) => (u._id === user._id ? user : u)),
      landlords: state.landlords.map((u) => (u._id === user._id ? user : u)),
    })),
  deleteUser: (id) =>
    set((state) => ({
      users: state.users.filter((u) => u._id !== id),
      tenants: state.tenants.filter((u) => u._id !== id),
      landlords: state.landlords.filter((u) => u._id !== id),
    })),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));