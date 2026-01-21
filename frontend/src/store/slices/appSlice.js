
export const createAppSlice = (set) => ({
  showSearch: false,
  setShowSearch: (show) => set({ showSearch: show }),
  search: '',
  setSearch: (search) => set({ search: search }),
  toast: {
    message: '',
    type: '',
  },
  showToast: (message, type) => set({ toast: { message, type } }),
  hideToast: () => set({ toast: { message: '', type: '' } }),
});
