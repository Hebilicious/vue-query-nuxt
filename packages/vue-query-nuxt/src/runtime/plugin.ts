import type { DehydratedState } from "@tanstack/vue-query"
import { QueryClient, VueQueryPlugin, dehydrate, hydrate } from "@tanstack/vue-query"
import { isErrorLike, deserializeError, serializeError, type Options } from 'serialize-error'
import { getVueQueryOptions } from "./utils"
import { pluginHook } from "#build/internal.vue-query-plugin-hook"
import { defineNuxtPlugin, useRuntimeConfig, useState } from "#imports"

export default defineNuxtPlugin((nuxt) => {
  const { stateKey, queryClientOptions, vueQueryPluginOptions } = getVueQueryOptions(useRuntimeConfig())
  const vueQueryState = useState<DehydratedState | null>(stateKey)
  const queryClient = new QueryClient(queryClientOptions)

  // The plugin hook is replaced by the user provided vue-query.config.ts and allow advanced modifications
  const {
    pluginReturn,
    vueQueryPluginOptions: hookOptions,
    hydrateOptions,
    dehydrateOptions,
    ...pluginHookReturn
  } = pluginHook({ queryClient, nuxt })
  let {
    serializeErrorOptions,
    deserializeErrorOptions
  } = pluginHookReturn
  serializeErrorOptions = { ...serializeErrorOptions, useToJSON: false } as Options
  deserializeErrorOptions = { ...deserializeErrorOptions, useToJSON: false } as Options

  nuxt.vueApp.use(VueQueryPlugin, { queryClient, ...vueQueryPluginOptions, ...hookOptions })

  type Dehydrated = ReturnType<typeof dehydrate>
  type QueryOrMutations = Dehydrated['queries'] | Dehydrated['mutations']
  if (import.meta.server) {
    nuxt.hooks.hook("app:rendered", () => {
      const serializeErrors = <T extends QueryOrMutations>(queryOrMutations: T): T => queryOrMutations
        .map(queryOrMutation => {
          const state = queryOrMutation.state
          if (state.error instanceof Error)
            state.error = serializeError(state.error, serializeErrorOptions) as Error | null
          if ('fetchFailureReason' in state && state.fetchFailureReason instanceof Error)
            state.fetchFailureReason = serializeError(state.fetchFailureReason, serializeErrorOptions) as Error | null
          if ('failureReason' in state && state.failureReason instanceof Error)
            state.failureReason = serializeError(state.failureReason, serializeErrorOptions) as Error | null
          return queryOrMutation
        }) as T
      const dehydrated = dehydrate(queryClient, dehydrateOptions)
      dehydrated.queries = serializeErrors(dehydrated.queries)
      dehydrated.mutations = serializeErrors(dehydrated.mutations)
      vueQueryState.value = dehydrated
    })
  }

  if (import.meta.client) {
    const deserializeErrors = <T extends QueryOrMutations>(queryOrMutations: T): T => queryOrMutations
        .map(queryOrMutation => {
          const state = queryOrMutation.state
          if (isErrorLike(state.error))
            state.error = deserializeError(state.error, deserializeErrorOptions)
          if ('fetchFailureReason' in state && isErrorLike(state.fetchFailureReason))
            state.fetchFailureReason = deserializeError(state.fetchFailureReason, deserializeErrorOptions)
          if ('failureReason' in state && isErrorLike(state.failureReason))
            state.failureReason = deserializeError(state.failureReason, deserializeErrorOptions)
          return queryOrMutation
        }) as T
    const dehydrated = vueQueryState.value
    dehydrated.queries = deserializeErrors(dehydrated.queries)
    dehydrated.mutations = deserializeErrors(dehydrated.mutations)
    hydrate(queryClient, dehydrated, hydrateOptions)
  }

  if (pluginReturn !== undefined) return pluginReturn
  return
})
