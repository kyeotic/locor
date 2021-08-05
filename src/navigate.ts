import { useCallback, useLayoutEffect } from 'react'
import { useBasePath } from '.'
import { isNode } from './node'
import type { QueryParam } from './querystring'
import {
  shouldCancelNavigation,
  addInterceptor,
  removeInterceptor,
  defaultPrompt,
  undoNavigation,
} from './intercept'

export interface NavigateWithReplace {
  (url: string, replace?: boolean): void
}
export interface NavigateWithQuery {
  (url: string, query?: QueryParam | URLSearchParams, replace?: boolean): void
}

let lastPath = ''

export function navigate(
  url: string,
  replaceOrQuery?: QueryParam | URLSearchParams | boolean | null,
  replace?: boolean,
  state: unknown = null
): void {
  if (typeof url !== 'string') {
    throw new Error(`"url" must be a string, was provided a(n) ${typeof url}`)
  }

  if (Array.isArray(replaceOrQuery)) {
    throw new Error(
      '"replaceOrQuery" must be boolean, object, or URLSearchParams'
    )
  }

  if (shouldCancelNavigation()) return
  if (replaceOrQuery !== null && typeof replaceOrQuery === 'object') {
    url += '?' + new URLSearchParams(replaceOrQuery).toString()
  } else if (replace === undefined && replaceOrQuery !== undefined) {
    replace = replaceOrQuery ?? undefined
  } else if (replace === undefined && replaceOrQuery === undefined) {
    replace = false
  }
  lastPath = url

  if (replace) window.history.replaceState(state, '', url)
  else window.history.pushState(state, '', url)

  dispatchEvent(new PopStateEvent('popstate'))
}

export function useNavigationPrompt(
  predicate: boolean = true,
  prompt: string = defaultPrompt
) {
  if (isNode) return
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useLayoutEffect(() => {
    const onPopStateNavigation = () => {
      if (shouldCancelNavigation()) {
        undoNavigation(lastPath)
      }
    }
    window.addEventListener('popstate', onPopStateNavigation)
    return () => window.removeEventListener('popstate', onPopStateNavigation)
  }, [])
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useLayoutEffect(() => {
    const handler = (e?: BeforeUnloadEvent): string => {
      if (predicate) return e ? cancelNavigation(e, prompt) : prompt
      return ''
    }
    addInterceptor(handler)
    return () => removeInterceptor(handler)
  }, [predicate, prompt])
}

function cancelNavigation(event: BeforeUnloadEvent, prompt: string) {
  // Cancel the event as stated by the standard.
  event.preventDefault()
  // Chrome requires returnValue to be set.
  event.returnValue = prompt
  // Return value for prompt per spec
  return prompt
}

export function useNavigate(
  optBasePath = ''
): NavigateWithReplace & NavigateWithQuery {
  const basePath = useBasePath()
  const navigateWithBasePath = useCallback<
    NavigateWithReplace & NavigateWithQuery
  >(
    (
      url: string,
      replaceOrQuery?: boolean | QueryParam | URLSearchParams,
      replace?: boolean
    ) => {
      const base = optBasePath || basePath
      const href = url.startsWith('/') ? base + url : url
      navigate(href, replaceOrQuery, replace)
    },
    [basePath, optBasePath]
  )
  return navigateWithBasePath
}
