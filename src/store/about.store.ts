// store/about.store.ts
import { create } from 'zustand';
import { AboutSettings, Consultant } from '../types/about.types';
import AboutService from '../services/about.service';

interface AboutStore {
  settings: AboutSettings | null;
  loading: boolean;
  error: string | null;
  fetchSettings: () => Promise<void>;
  updateSettings: (settings: Partial<AboutSettings>) => Promise<void>;
  updateConsultant: (id: string, data: Partial<Consultant>) => Promise<void>;
}

export const useAboutStore = create<AboutStore>((set) => ({
  settings: null,
  loading: false,
  error: null,

  fetchSettings: async () => {
    try {
      set({ loading: true, error: null });
      const settings = await AboutService.getAboutSettings();
      set({ settings, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error fetching settings',
        loading: false 
      });
    }
  },

  updateSettings: async (settings) => {
    try {
      set({ loading: true, error: null });
      const updatedSettings = await AboutService.updateAboutSettings(settings);
      set({ settings: updatedSettings, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error updating settings',
        loading: false 
      });
    }
  },

  updateConsultant: async (id, data) => {
    try {
      set({ loading: true, error: null });
      await AboutService.updateConsultant(id, data);
      // Refresh settings after update
      const settings = await AboutService.getAboutSettings();
      set({ settings, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error updating consultant',
        loading: false 
      });
    }
  },
}));