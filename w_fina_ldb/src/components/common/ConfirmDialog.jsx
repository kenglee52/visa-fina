/**
 * ConfirmDialog Component
 * Reusable confirmation dialog using Radix UI
 */
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { DIALOG_MESSAGES } from '@/config/constants';

const ConfirmDialog = ({
  isOpen = false,
  onClose = () => {},
  onConfirm = () => {},
  title = DIALOG_MESSAGES.CONFIRM,
  description = '',
  confirmText = DIALOG_MESSAGES.CONFIRM,
  cancelText = DIALOG_MESSAGES.CANCEL,
  variant = 'default', // 'default' | 'destructive'
  isLoading = false,
}) => {
  const handleConfirm = () => {
    if (!isLoading) {
      onConfirm();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="font-noto-sans-lao">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className={`
              ${variant === 'destructive'
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-blue-600 hover:bg-blue-700'
              }
            `}
          >
            {isLoading ? 'ກຳລັງດຳເນີນການ...' : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmDialog;
