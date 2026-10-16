import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose, duration = 3500 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, onClose, duration]);

  return (
    <div className="fixed bottom-[80px] left-0 right-0 max-w-[430px] mx-auto px-4 z-50 pointer-events-none flex justify-center animate-fade-in-menu">
      <div className="bg-[#1E293B]/90 backdrop-blur text-white text-[13px] font-medium px-4 py-2.5 rounded-full shadow-lg border border-white/10 text-center pointer-events-auto">
        {message}
      </div>
    </div>
  );
};
