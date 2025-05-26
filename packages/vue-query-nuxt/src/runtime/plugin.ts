import type { DehydratedState } from "@tanstack/vue-query"
import { QueryClient, VueQueryPlugin, dehydrate, hydrate } from "@tanstack/vue-query"
import { getVueQueryOptions } from "./utils"
import { pluginHook } from "#build/internal.vue-query-plugin-hook"
import { defineNuxtPlugin, useRuntimeConfig, useState } from "#imports"

export default defineNuxtPlugin((nuxt) => {
  const { stateKey, queryClientOptions, vueQueryPluginOptions } = getVueQueryOptions(useRuntimeConfig())
  const vueQueryState = useState<DehydratedState | null>(stateKey)
  const queryClient = new QueryClient(queryClientOptions)

  // The plugin hook is replaced by the user provided vue-query.config.ts and allow advanced modifications
  const { pluginReturn, vueQueryPluginOptions: hookOptions } = pluginHook({ queryClient, nuxt })

  nuxt.vueApp.use(VueQueryPlugin, { queryClient, ...vueQueryPluginOptions, ...hookOptions })

  if (import.meta.server) {
    nuxt.hooks.hook("app:rendered", () => {
      vueQueryState.value = dehydrate(queryClient)
    })
  }

  if (import.meta.client) hydrate(queryClient, vueQueryState.value)

  return pluginReturn
})
