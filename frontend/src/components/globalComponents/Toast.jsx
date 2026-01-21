import React, { useEffect } from 'react';
import useStore from '../../store/store';

const Toast = () => {
  const { toast, hideToast } = useStore();

  useEffect(() => {
    if (toast.message) {
      const timer = setTimeout(() => {
        hideToast();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast, hideToast]);

  return (
    toast.message && (
        <div className={`fixed bottom-10 right-10 z-50 px-6 py-3 rounded shadow-lg text-white transition-all duration-500 ${toast.type === 'error' ? 'bg-red-600' : 'bg-black'}`}>
            {toast.message}
        </div>
    )
  )
}

export default Toast;