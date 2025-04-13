/**
 * Type definitions for common UI components
 */

// Button Component
export interface ButtonProps {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
}

// Modal Component
export interface ModalProps {
  children?: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  rtl?: boolean;
}

// LoadingState Component
export interface LoadingStateProps {
  type?: 'spinner' | 'dots' | 'text';
  className?: string;
}

// ErrorMessage Component
export interface ErrorMessageProps {
  message?: string;
  className?: string;
}

// FormInput Component
export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
  containerClassName?: string;
} 