// Type declarations for Next.js and related modules

declare module 'next' {
  import { ComponentType, ReactNode } from 'react';
  import { IncomingMessage } from 'http';
  
  export type NextPage<P = {}, IP = P> = ComponentType<P> & {
    getInitialProps?: (context: any) => Promise<IP>;
  };
  
  export interface GetStaticPropsContext {
    params?: any;
    preview?: boolean;
    previewData?: any;
    locale?: string;
    locales?: string[];
    defaultLocale?: string;
  }
  
  export interface GetStaticPathsContext {
    locales?: string[];
    defaultLocale?: string;
  }
  
  export interface GetStaticPathsResult<P = any> {
    paths: Array<{ params: P; locale?: string }>;
    fallback: boolean | 'blocking';
  }
  
  export type GetStaticProps<
    P extends { [key: string]: any } = { [key: string]: any },
    Q extends { [key: string]: any } = { [key: string]: any }
  > = (context: GetStaticPropsContext) => Promise<{
    props: P;
    revalidate?: number | boolean;
    notFound?: boolean;
    redirect?: {
      destination: string;
      permanent: boolean;
    };
  }>;
  
  export type GetStaticPaths<P extends { [key: string]: any } = { [key: string]: any }> = 
    (context?: GetStaticPathsContext) => Promise<GetStaticPathsResult<P>>;
  
  export interface NextApiRequest extends IncomingMessage {
    query: {
      [key: string]: string | string[] | undefined;
    };
    cookies: {
      [key: string]: string;
    };
    body: any;
  }
  
  export interface NextApiResponse<T = any> {
    status(code: number): NextApiResponse<T>;
    json(data: T): void;
    send(data: string | object): void;
    redirect(statusOrUrl: number | string, url?: string): void;
    end(): void;
    setHeader(name: string, value: string | string[]): void;
    getHeader(name: string): string | string[] | undefined;
  }
  
  export type NextApiHandler<T = any> = (
    req: NextApiRequest,
    res: NextApiResponse<T>
  ) => void | Promise<void>;
  
  export interface Metadata {
    title?: string;
    description?: string;
    [key: string]: any;
  }
}

declare module 'next-i18next/serverSideTranslations' {
  export function serverSideTranslations(
    locale: string,
    namespacesRequired?: string[],
    configOverride?: any,
    extraLocales?: string[]
  ): Promise<{
    _nextI18Next: {
      initialI18nStore: any;
      initialLocale: string;
      userConfig: any;
      ns: string[];
    };
  }>;
}

declare module 'next-i18next' {
  export function useTranslation(
    ns?: string | string[],
    options?: { keyPrefix?: string }
  ): {
    t: (key: string, options?: object) => string;
    i18n: {
      language: string;
      changeLanguage: (lang: string) => Promise<any>;
    };
  };
}

declare module 'next/head' {
  import { ReactElement, ReactNode } from 'react';
  export default function Head(props?: { children?: ReactNode }): JSX.Element;
}

declare module 'next/router' {
  import { NextRouter } from 'next/dist/client/router';
  
  export function useRouter(): NextRouter;
  
  export interface NextRouter {
    route: string;
    pathname: string;
    query: { [key: string]: string | string[] | undefined };
    asPath: string;
    isFallback: boolean;
    basePath: string;
    locale?: string;
    locales?: string[];
    defaultLocale?: string;
    domainLocales?: any[];
    isReady: boolean;
    isPreview: boolean;
    isLocaleDomain: boolean;
    
    push(url: string, as?: string, options?: any): Promise<boolean>;
    replace(url: string, as?: string, options?: any): Promise<boolean>;
    reload(): void;
    back(): void;
    prefetch(url: string): Promise<void>;
    beforePopState(cb: (state: any) => boolean): void;
    events: {
      on(type: string, handler: (...evts: any[]) => void): void;
      off(type: string, handler: (...evts: any[]) => void): void;
      emit(type: string, ...evts: any[]): void;
    };
  }
}

declare module 'next/app' {
  import { AppProps as NextAppProps, AppContext, AppInitialProps } from 'next/app';
  import { NextPage } from 'next';
  import { ReactNode } from 'react';
  
  export interface AppProps extends NextAppProps {
    Component: NextPage;
    router: any;
    __N_SSG?: boolean;
    __N_SSP?: boolean;
    [key: string]: any;
  }
  
  export type AppType = (props: AppProps) => JSX.Element;
  
  export interface AppContext {
    Component: NextPage;
    ctx: any;
    router: any;
  }
  
  export default function App(props: AppProps): JSX.Element;
} 