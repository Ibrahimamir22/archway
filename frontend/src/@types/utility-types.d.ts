/**
 * Utility type definitions for common React component patterns
 */

// Add key property to any component props
type WithKey<T> = T & { key?: string | number };

// Add children property to any component props
type WithChildren<T = {}> = T & { children?: React.ReactNode };

// Combine key and children for common component props
type ComponentProps<T = {}> = WithChildren<WithKey<T>>;

// For React Fragment type
type FragmentProps = WithKey<WithChildren>;

// For form components
type FormProps<T = {}> = ComponentProps<T> & {
  onSubmit?: (data: any) => void;
  className?: string;
};

// For UI components
type UIComponentProps<T = {}> = ComponentProps<T> & {
  className?: string;
  style?: React.CSSProperties;
};

// For interactive components
type ButtonProps = UIComponentProps<{
  variant?: string;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: () => void;
  'aria-label'?: string;
}>;

// For modal components
type ModalProps = ComponentProps<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  rtl?: boolean;
}>;

// For data display components
type CardProps<T = any> = UIComponentProps<{
  item: T;
  onClick?: () => void;
}>;

// For navigation components
type LinkProps = WithChildren<{
  href: string | { pathname: string; query?: any };
  as?: string;
  replace?: boolean;
  scroll?: boolean;
  prefetch?: boolean;
}>;

// Specific component props
type ServiceCardProps = CardProps<{
  service: any;
  priority?: boolean;
}>;

type ProjectCardProps = CardProps<{
  project: any;
  onSaveToFavorites?: (id: string) => void;
  isAuthenticated?: boolean;
}>; 