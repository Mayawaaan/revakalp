export const createAuthSlice = (set) => ({
  user: null,
  login: (userData) => set({ user: userData }),
  logout: () => set({ user: null }),
  updateProfile: (data) =>
    set((state) => ({ user: { ...state.user, ...data } })),
});
