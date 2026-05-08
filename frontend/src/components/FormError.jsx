import { AlertCircle } from 'lucide-react';

export default function FormError({ message }) {
  if (!message) return null;
  return (
    <p className="text-primary text-xs mt-1 flex items-center gap-1">
      <AlertCircle size={12} />
      {message}
    </p>
  );
}