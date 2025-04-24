/// <reference path="./utility-types.d.ts" />
/// <reference path="../global.d.ts" />
// This is a reference to the global definitions file that suppresses errors

// Declaration file for libraries without TypeScript definitions

// React
declare module 'react' {
  export type FC<P = {}> = FunctionComponent<P>;
  export interface FunctionComponent<P = {}> {
    (props: P & WithChildren): React.ReactElement | null;
    displayName?: string;
  }
  export type ReactNode = React.ReactElement | string | number | Iterable<React.ReactNode> | boolean | null | undefined;
  export interface ReactElement<P = any> {
    type: any;
    props: P;
    key: React.Key | null;
  }
  export type Key = string | number;
  export type useState<T> = [T, (value: T) => void];
  export function useState<T>(initialState: T | (() => T)): useState<T>;
  export function useRef<T>(initialValue: T | null): { current: T | null };
  export function useEffect(effect: () => void | (() => void), deps?: readonly any[]): void;
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: readonly any[]): T;
  export function forwardRef<T, P>(render: (props: P, ref: React.Ref<T>) => React.ReactElement | null): ForwardRefExoticComponent<P & { ref?: React.Ref<T> }>;
  export type Ref<T> = React.RefObject<T> | ((instance: T | null) => void) | null;
  export type RefObject<T> = { readonly current: T | null };
  export interface FormEvent<T = Element> extends SyntheticEvent<T> {
    target: EventTarget & T;
  }
  export interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
    target: EventTarget & T;
  }
  export interface SyntheticEvent<T = Element, E = Event> {
    bubbles: boolean;
    cancelable: boolean;
    currentTarget: EventTarget & T;
    defaultPrevented: boolean;
    eventPhase: number;
    isTrusted: boolean;
    nativeEvent: E;
    preventDefault(): void;
    stopPropagation(): void;
    target: EventTarget & T;
    timeStamp: number;
    type: string;
  }
  export interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    className?: string;
    defaultChecked?: boolean;
    defaultValue?: string | number | readonly string[];
    suppressContentEditableWarning?: boolean;
    suppressHydrationWarning?: boolean;
    style?: CSSProperties;
    [key: string]: any;
  }
  export interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    accept?: string;
    alt?: string;
    autoComplete?: string;
    autoFocus?: boolean;
    checked?: boolean;
    disabled?: boolean;
    form?: string;
    list?: string;
    max?: number | string;
    maxLength?: number;
    min?: number | string;
    minLength?: number;
    multiple?: boolean;
    name?: string;
    pattern?: string;
    placeholder?: string;
    readOnly?: boolean;
    required?: boolean;
    size?: number;
    src?: string;
    step?: number | string;
    type?: string;
    value?: string | number | readonly string[];
    onChange?: ChangeEventHandler<T>;
  }
  export type ChangeEventHandler<T = Element> = (event: ChangeEvent<T>) => void;
  export interface AriaAttributes {
    [key: string]: any;
  }
  export interface DOMAttributes<T> {
    [key: string]: any;
  }
  export interface CSSProperties {
    [key: string]: any;
  }
  export interface EventTarget { }
  
  export const Fragment: React.ComponentType<FragmentProps>;
  
  export type Component<P = {}, S = {}> = {
    setState: (state: Partial<S>) => void;
    forceUpdate: () => void;
    props: P;
    state: S;
    refs: { [key: string]: any };
  };

  export interface ForwardRefExoticComponent<P> {
    (props: P): React.ReactElement | null;
    displayName?: string;
  }

  export interface ComponentType<P = {}> {
    (props: P): React.ReactElement<any, any> | null;
  }
}

// React Query
declare module 'react-query' {
  export function useQuery(key: any, fn: any, options?: any): any;
  export function useInfiniteQuery(key: any, fn: any, options?: any): any;
  export function useQueryClient(): any;
  export class QueryClient {
    constructor(config?: any);
    invalidateQueries(queryKey?: any, filters?: any, options?: any): Promise<void>;
    prefetchQuery(queryKey: any, fn?: any, options?: any): Promise<any>;
    setQueryData(queryKey: any, updater: any, options?: any): any;
    getQueryData(queryKey: any): any;
    resetQueries(queryKey?: any, filters?: any, options?: any): Promise<void>;
  }
  export interface QueryClientProviderProps {
    client: any;
    children?: React.ReactNode;
  }
  export const QueryClientProvider: React.FC<QueryClientProviderProps>;
  export interface DehydratedState {
    mutations: any[];
    queries: any[];
  }
  export function dehydrate(client: QueryClient): DehydratedState;
  export function hydrate(client: QueryClient, state: DehydratedState): void;
  export function useIsFetching(filters?: any): number;
  export function useMutation(mutationFn: any, options?: any): any;
  export interface AxiosError {
    response?: any;
    request?: any;
    message: string;
    config?: any;
    isAxiosError: boolean;
  }
}

// Axios
declare module 'axios' {
  export interface AxiosRequestConfig {
    url?: string;
    method?: string;
    baseURL?: string;
    headers?: any;
    params?: any;
    data?: any;
    timeout?: number;
    withCredentials?: boolean;
    validateStatus?: (status: number) => boolean;
  }

  export interface AxiosResponse<T = any> {
    data: T;
    status: number;
    statusText: string;
    headers: any;
    config: AxiosRequestConfig;
    request?: any;
  }

  export interface AxiosError<T = any> {
    config: AxiosRequestConfig;
    code?: string;
    request?: any;
    response?: AxiosResponse<T>;
    isAxiosError: boolean;
    toJSON: () => object;
  }

  export function isAxiosError(payload: any): payload is AxiosError;
  export function get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
  export function post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
  export function put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
  export function deleteRequest<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
  export function request<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>>;
  
  // Allow axios to be called as a function
  function axios<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>>;
  namespace axios {
    export { get, post, put, deleteRequest as delete, isAxiosError, request };
    export function create(config?: AxiosRequestConfig): typeof axios;
  }
  
  export default axios;
}

// Next.js Router
declare module 'next/router' {
  export function useRouter(): {
    route: string;
    pathname: string;
    query: any;
    asPath: string;
    push: (url: string | { pathname: string; query: any }, as?: string, options?: any) => Promise<boolean>;
    replace: (url: string, as?: string, options?: any) => Promise<boolean>;
    reload: () => void;
    back: () => void;
    prefetch: (url: string) => Promise<void>;
    beforePopState: (cb: (state: any) => boolean) => void;
    events: {
      on: (type: string, handler: (...args: any[]) => void) => void;
      off: (type: string, handler: (...args: any[]) => void) => void;
      emit: (type: string, ...args: any[]) => void;
    };
    isFallback: boolean;
    locale: string;
    locales: string[];
    defaultLocale: string;
  };
}

// Node Process
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    NEXT_PUBLIC_API_URL?: string;
    NEXT_PUBLIC_BACKEND_URL?: string;
    [key: string]: string | undefined;
  }

  interface Process {
    env: ProcessEnv;
  }
}

declare const process: NodeJS.Process;

// HTML elements
declare namespace React {
  interface LinkHTMLAttributes<T> extends HTMLAttributes<T> {
    importance?: 'high' | 'low' | 'auto';
  }
}

// Next.js Link and Image
declare module 'next/link' {
  import { ComponentType } from 'react';
  
  export interface LinkProps {
    href: string;
    as?: string;
    replace?: boolean;
    scroll?: boolean;
    shallow?: boolean;
    passHref?: boolean;
    prefetch?: boolean;
    locale?: string | false;
    legacyBehavior?: boolean;
    children?: ReactNode;
    onMouseEnter?: any;
    onTouchStart?: any;
    onFocus?: any;
    target?: string;
    rel?: string;
    [key: string]: any;
  }
  
  const Link: ComponentType<LinkProps>;
  export default Link;
}

declare module 'next/image' {
  import { ComponentType } from 'react';
  
  export interface ImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    layout?: 'fixed' | 'intrinsic' | 'responsive' | 'fill';
    fill?: boolean;
    sizes?: string;
    quality?: number;
    priority?: boolean;
    placeholder?: 'blur' | 'empty';
    className?: string;
    onLoad?: () => void;
    onError?: () => void;
    blurDataURL?: string;
  }
  
  const Image: ComponentType<ImageProps>;
  export default Image;
}

// next-i18next module
declare module 'next-i18next' {
  export function useTranslation(namespace?: string | string[]): {
    t: (key: string, options?: any) => string;
    i18n: {
      language: string;
      changeLanguage: (lang: string) => Promise<void>;
    };
  };
  
  export function appWithTranslation<P>(Component: React.ComponentType<P>): React.ComponentType<P>;
  
  export interface SSRConfig {
    _nextI18Next: {
      initialI18nStore: any;
      initialLocale: string;
      userConfig: any;
      ns: string[];
    };
  }
}

// Next.js Head and Document
declare module 'next/head' {
  import { FC } from 'react';
  
  interface HeadProps {
    children?: React.ReactNode;
  }
  
  const Head: FC<WithChildren>;
  export default Head;
}

declare module 'next/document' {
  import React from 'react';
  
  export interface DocumentContext {
    req: any;
    res: any;
    pathname: string;
    query: any;
    asPath?: string;
    AppTree: any;
  }
  
  export interface DocumentInitialProps {
    html: string;
    head?: JSX.Element[];
    styles?: React.ReactNode[] | React.ReactNode;
  }
  
  export interface DocumentProps extends DocumentInitialProps {
    __NEXT_DATA__: {
      props: any;
      page: string;
      query: any;
      buildId: string;
      locale?: string;
      locales?: string[];
      defaultLocale?: string;
      [key: string]: any;
    };
  }
  
  export default class Document extends React.Component<DocumentProps> {
    static getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps>;
    render(): JSX.Element;
  }
  
  export class Html extends React.Component<any> { render(): JSX.Element; }
  export class Head extends React.Component<any> { render(): JSX.Element; }
  export class Main extends React.Component<any> { render(): JSX.Element; }
  export class NextScript extends React.Component<any> { render(): JSX.Element; }
}

// Add custom component interfaces
interface SocialIconProps {
  platform: string;
  url: string;
  key?: string | number;
}

interface FooterSectionProps {
  section: any;
  isRtl: boolean;
  key?: string | number;
}

// For Button and Modal components
interface ButtonProps {
  children?: React.ReactNode;
  variant: string;
  fullWidth?: boolean;
  type?: string;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  'aria-label'?: string;
}

interface ModalProps {
  children?: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title: string;
  rtl?: boolean;
}

interface ServiceCardProps {
  service: any;
  priority?: boolean;
  key?: string | number;
}

// JSX namespace
declare namespace JSX {
  interface Element extends React.ReactElement<any, any> {}
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

// Next.js modules
declare module 'next/app' {
  import { NextPage } from 'next';
  import { AppProps as NextAppProps } from 'next/app';
  
  export interface AppProps extends NextAppProps {
    Component: NextPage;
    pageProps: any;
  }
}

// React Hook Form
declare module 'react-hook-form' {
  export function useForm<T>(options?: any): {
    register: (name: string, options?: any) => any;
    handleSubmit: (callback: (data: T) => void) => (e: any) => void;
    formState: {errors: any};
    watch: (name?: string, defaultValue?: any) => any;
    setValue: (name: string, value: any) => void;
    reset: () => void;
  };
}

// React Query add-ons
declare module 'react-query/devtools' {
  export const ReactQueryDevtools: React.ComponentType<{initialIsOpen?: boolean}>;
}

declare module 'react-query/hydration' {
  export const Hydrate: React.ComponentType<{state?: any; children?: React.ReactNode}>;
}

// This file contains type declarations for modules without their own types
declare module 'react-modal-video';
declare module 'react-indiana-drag-scroll';
declare module '@react-hook/media-query';
declare module 'react-countup';
declare module 'react-reveal/Fade';
declare module 'react-reveal/Zoom';
declare module 'react-vertical-timeline-component';

// Fix for Button component typing issues
declare module '@/components/common/Button' {
  export interface ButtonProps {
    children?: ReactNode;
    variant?: 'primary' | 'secondary' | 'outline';
    fullWidth?: boolean;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    className?: string;
    [key: string]: any;
  }
}

// Fix for Modal component typing issues
declare module '@/components/common/Modal' {
  export interface ModalProps {
    children?: ReactNode;
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    rtl?: boolean;
    [key: string]: any;
  }
}

// Add Navbar and Footer component declarations
declare module '@/components/common/Navbar/index' {
  import { FC } from 'react';
  const Navbar: FC;
  export default Navbar;
}

declare module '@/components/common/Footer/index' {
  import { FC } from 'react';
  const Footer: FC;
  export default Footer;
}

// Add LoadingState component declaration
declare module '@/components/common/LoadingState' {
  import { FC } from 'react';
  interface LoadingStateProps {
    type?: 'spinner' | 'dots' | 'text';
    className?: string;
    [key: string]: any;
  }
  const LoadingState: FC<LoadingStateProps>;
  export default LoadingState;
}

declare module '@/components/common/LoadingState/index' {
  import LoadingState from '@/components/common/LoadingState';
  export default LoadingState;
}

// Add ErrorMessage component declaration
declare module '@/components/common/ErrorMessage' {
  import { FC } from 'react';
  interface ErrorMessageProps {
    message?: string;
    className?: string;
    [key: string]: any;
  }
  const ErrorMessage: FC<ErrorMessageProps>;
  export default ErrorMessage;
}

declare module '@/components/common/ErrorMessage/index' {
  import ErrorMessage from '@/components/common/ErrorMessage';
  export default ErrorMessage;
} 