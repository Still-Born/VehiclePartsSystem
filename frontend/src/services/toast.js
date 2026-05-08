import { toast } from 'react-toastify';

export const showSuccess = (message) => {
  toast.success(message, {
    style: {
      background: '#1a1a1a',
      color: '#ffffff',
      border: '1px solid #2a2a2a',
    },
    progressStyle: {
      background: '#e63946',
    },
  });
};

export const showError = (message) => {
  toast.error(message, {
    style: {
      background: '#1a1a1a',
      color: '#ffffff',
      border: '1px solid #e63946',
    },
    progressStyle: {
      background: '#e63946',
    },
  });
};

export const showWarning = (message) => {
  toast.warning(message, {
    style: {
      background: '#1a1a1a',
      color: '#ffffff',
      border: '1px solid #f59e0b',
    },
    progressStyle: {
      background: '#f59e0b',
    },
  });
};