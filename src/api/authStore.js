import { create } from "zustand";

const useAuthStore = create((set) => ({
  email: '',
  password: '',
  token: null, // you can store the JWT or access token here
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  resetCredentials: () => set({ email: '', password: '' }),
}));

export default useAuthStore;
