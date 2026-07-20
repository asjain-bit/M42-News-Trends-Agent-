import { create } from 'zustand';
import { User, authService } from '../services/authService';
import { ReportThread, storageService } from '../services/storageService';

interface AppState {
  user: User | null;
  isAuthenticating: boolean;
  login: (role: "strategy" | "general") => Promise<void>;
  logout: () => Promise<void>;
  
  threads: ReportThread[];
  loadThreads: () => Promise<void>;
  addThread: (thread: ReportThread) => Promise<void>;
  updateThread: (thread: ReportThread) => Promise<void>;
  deleteThread: (id: string) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  isAuthenticating: false,
  login: async (role) => {
    set({ isAuthenticating: true });
    try {
      const user = await authService.login(role);
      set({ user });
    } finally {
      set({ isAuthenticating: false });
    }
  },
  logout: async () => {
    await authService.logout();
    set({ user: null });
  },

  threads: [],
  loadThreads: async () => {
    const threads = await storageService.getThreads();
    set({ threads });
  },
  addThread: async (thread) => {
    await storageService.saveThread(thread);
    const threads = await storageService.getThreads();
    set({ threads });
  },
  updateThread: async (thread) => {
    await storageService.saveThread(thread);
    const threads = await storageService.getThreads();
    set({ threads });
  },
  deleteThread: async (id) => {
    await storageService.deleteThread(id);
    const threads = await storageService.getThreads();
    set({ threads });
  }
}));
