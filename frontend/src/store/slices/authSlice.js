export const createAuthSlice = (set) => ({
  user: null,
  login: (userData) => set({ user: userData }),
  logout: () => set({ user: null }),
  updateProfilePic: (pic) =>
    set((state) => ({ user: { ...state.user, profilePic: pic } })),
});
