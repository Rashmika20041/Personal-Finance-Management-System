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
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center transition-opacity duration-300">
      <div className="bg-secondary rounded-lg shadow-xl p-8 w-full max-w-md relative transform transition-all scale-95">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-text-primary">{title}</h2>
            <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors"
            >
            <XMarkIcon className="h-6 w-6" />
            </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;