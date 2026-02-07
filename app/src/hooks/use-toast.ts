import { toast as sonnerToast } from 'sonner';

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export const useToast = () => {
  const toast = (options: ToastOptions) => {
    sonnerToast(options.title, {
      description: options.description,
    });
  };

  return { toast };
};

export { sonnerToast as toast };
