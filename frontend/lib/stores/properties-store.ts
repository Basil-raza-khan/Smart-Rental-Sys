import { create } from 'zustand';
import { Property } from '../types';

interface PropertiesState {
  properties: Property[];
  landlordProperties: Property[];
  isLoading: boolean;
  error: string | null;
  setProperties: (properties: Property[]) => void;
  setLandlordProperties: (properties: Property[]) => void;
  addProperty: (property: Property) => void;
  updateProperty: (property: Property) => void;
  deleteProperty: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const usePropertiesStore = create<PropertiesState>((set) => ({
  properties: [],
  landlordProperties: [],
  isLoading: false,
  error: null,
  setProperties: (properties) => set({ properties }),
  setLandlordProperties: (properties) => set({ landlordProperties: properties }),
  addProperty: (property) =>
    set((state) => ({
      properties: [...state.properties, property],
      landlordProperties: [...state.landlordProperties, property],
    })),
  updateProperty: (property) =>
    set((state) => ({
      properties: state.properties.map((p) => (p._id === property._id ? property : p)),
      landlordProperties: state.landlordProperties.map((p) => (p._id === property._id ? property : p)),
    })),
  deleteProperty: (id) =>
    set((state) => ({
      properties: state.properties.filter((p) => p._id !== id),
      landlordProperties: state.landlordProperties.filter((p) => p._id !== id),
    })),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));