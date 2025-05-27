import type { DehydratedState } from "@tanstack/vue-query"
import { QueryClient, VueQueryPlugin, dehydrate, hydrate } from "@tanstack/vue-query"
import { isErrorLike, deserializeError, serializeError } from 'serialize-error';
import { getVueQueryOptions } from "./utils"
import { pluginHook } from "#build/internal.vue-query-plugin-hook"
import { defineNuxtPlugin, useRuntimeConfig, useState } from "#imports"

export default defineNuxtPlugin((nuxt) => {
  const { stateKey, queryClientOptions, vueQueryPluginOptions } = getVueQueryOptions(useRuntimeConfig())
  const vueQueryState = useState<DehydratedState | null>(stateKey)
  const queryClient = new QueryClient(queryClientOptions)

  // The plugin hook is replaced by the user provided vue-query.config.ts and allow advanced modifications
  const { pluginReturn, vueQueryPluginOptions: hookOptions, hydrateOptions, dehydrateOptions } = pluginHook({ queryClient, nuxt })

  nuxt.vueApp.use(VueQueryPlugin, { queryClient, ...vueQueryPluginOptions, ...hookOptions })

  type Dehydrated = ReturnType<typeof dehydrate>
  type QueryOrMutations = Dehydrated['queries'] | Dehydrated['mutations']
  if (import.meta.server) {
    nuxt.hooks.hook("app:rendered", () => {
      const serializeErrors = <T extends QueryOrMutations>(queryOrMutations: T): T => queryOrMutations
        .filter(queryOrMutation => queryOrMutation.state.error instanceof Error)
        .map(queryOrMutation => {
          const state = queryOrMutation.state
          state.error = serializeError(state.error) as Error | null
          if ('fetchFailureReason' in state)
            state.fetchFailureReason = serializeError(state.fetchFailureReason) as Error | null
          if ('failureReason' in state)
            state.failureReason = serializeError(state.failureReason) as Error | null
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
        .filter(queryOrMutation => isErrorLike(queryOrMutation.state.error))
        .map(queryOrMutation => {
          const state = queryOrMutation.state
          state.error = deserializeError(state.error)
          if ('fetchFailureReason' in state)
            state.fetchFailureReason = deserializeError(state.fetchFailureReason)
          if ('failureReason' in state)
            state.failureReason = deserializeError(state.failureReason)
          return queryOrMutation
        }) as T
    const dehydrated = vueQueryState.value
    dehydrated.queries = deserializeErrors(dehydrated.queries)
    dehydrated.mutations = deserializeErrors(dehydrated.mutations)
    hydrate(queryClient, dehydrated, hydrateOptions)
  }

  if (pluginReturn !== undefined) return pluginReturn
  return;
})
