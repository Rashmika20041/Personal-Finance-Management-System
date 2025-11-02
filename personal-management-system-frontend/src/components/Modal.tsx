import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center transition-opacity duration-300 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-lg relative transform transition-all scale-95 border border-gray-200/50 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{title}</h2>
            <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
            >
            <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;