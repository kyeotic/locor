import * as React from 'react'

export function useRoutes(
  routes: { [key: string]: (props: { [k: string]: any }) => JSX.Element },
  options?: {
    basePath?: string
    routeProps?: { [k: string]: any }
    overridePathParams?: boolean
    matchTrailingSlash?: boolean
  }
): JSX.Element

export function useRedirect(
  predicateUrl: string,
  targetUrl: string,
  queryParams?: QueryParam | URLSearchParams,
  replace?: boolean
): void

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  basePath?: string
  linkRef?: React.RefObject<HTMLAnchorElement>
}
export const Link: React.FC<LinkProps>
export interface ActiveLinkProps extends LinkProps {
  activeClass?: string
  exactActiveClass?: string
}
export const ActiveLink: React.FC<ActiveLinkProps>

export interface RedirectProps {
  to: string
  replace?: boolean
  merge?: boolean
}
export const Redirect: React.FC<RedirectProps>

export function navigate(url: string, replace?: boolean): void
export function navigate(
  url: string,
  query?: QueryParam | URLSearchParams,
  replace?: boolean
): void

export function usePath(basePath?: string): string
export function useHash(options?: { stripHash?: boolean }): string

export function useBasePath(): string

export function useLocationChange(
  setFn: (path: string) => any,
  options?: {
    inheritBasePath?: boolean
    basePath?: string
    isActive?: () => boolean | boolean
  }
): void

export interface QueryParam {
  [key: string]: any
}

export function useQueryParams(
  parseFn?: (query: string) => QueryParam,
  serializeFn?: (query: QueryParam) => string
): [QueryParam, (query: QueryParam, replace?: boolean) => void]

export function useQueryParams<T>(
  parseFn?: (query: string) => T,
  serializeFn?: (query: T) => string
): [T, (query: T, replace?: boolean) => void]

export function useQueryParams<T, Q>(
  parseFn?: (query: string) => T,
  serializeFn?: (query: Q) => string
): [T, (query: Q, replace?: boolean) => void]

export function useNavigationPrompt(predicate = true, prompt?: string): void
