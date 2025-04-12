// Declaration file for libraries without TypeScript definitions

// React Query
declare module 'react-query' {
  export function useQuery(key: any, fn: any, options?: any): any;
  export function useInfiniteQuery(key: any, fn: any, options?: any): any;
  export function useQueryClient(): any;
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
  }

  export interface AxiosResponse<T = any> {
    data: T;
    status: number;
    statusText: string;
    headers: any;
    config: AxiosRequestConfig;
    request?: any;
  }

  export function get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
  export function post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
  export function put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
  export function delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;

  export default {
    get,
    post,
    put,
    delete,
  };
}

// Next.js Router
declare module 'next/router' {
  export function useRouter(): {
    route: string;
    pathname: string;
    query: any;
    asPath: string;
    push: (url: string, as?: string, options?: any) => Promise<boolean>;
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
} 