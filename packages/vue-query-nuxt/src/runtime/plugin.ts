import type { DehydratedState } from "@tanstack/vue-query"
import { QueryClient, VueQueryPlugin, dehydrate, hydrate } from "@tanstack/vue-query"
import { getVueQueryOptions } from "./utils"
import { defineNuxtPlugin, useRuntimeConfig, useState } from "#imports"
import { pluginCallback } from "#build/internal.vue-query-plugin-callback"

export default defineNuxtPlugin((nuxt) => {
  const { stateKey, queryClientOptions, vueQueryPluginOptions } = getVueQueryOptions(useRuntimeConfig())
  const vueQueryState = useState<DehydratedState | null>(stateKey)
  const queryClient = new QueryClient(queryClientOptions)

  nuxt.vueApp.use(VueQueryPlugin, { queryClient, ...vueQueryPluginOptions })

  if (process.server) {
    nuxt.hooks.hook("app:rendered", () => {
      vueQueryState.value = dehydrate(queryClient)
    })
  }
  if (process.client) {
    nuxt.hooks.hook("app:created", () => {
      hydrate(queryClient, vueQueryState.value)
    })
  }
  return pluginCallback({ queryClient })
})
