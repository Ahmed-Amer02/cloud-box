import type { ComponentProps } from 'react';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = ComponentProps<typeof Sonner>;

function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-surface group-[.toaster]:text-ink group-[.toaster]:border-border group-[.toaster]:rounded-card group-[.toaster]:shadow-md',
          description: 'group-[.toast]:text-ink-muted',
          actionButton: 'group-[.toast]:bg-accent group-[.toast]:text-white',
          cancelButton: 'group-[.toast]:bg-bg group-[.toast]:text-ink-muted',
          error: 'group-[.toast]:text-danger',
          success: 'group-[.toast]:text-success',
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
