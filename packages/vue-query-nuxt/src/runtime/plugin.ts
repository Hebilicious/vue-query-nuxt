import type { DehydratedState, DehydrateOptions } from "@tanstack/vue-query"
import { QueryClient, VueQueryPlugin, dehydrate, hydrate } from "@tanstack/vue-query"
import { getVueQueryOptions, dehydrateOptionKeys } from "./utils"
import { pluginHook } from "#build/internal.vue-query-plugin-hook"
import { defineNuxtPlugin, useRuntimeConfig, useState } from "#imports"

export default defineNuxtPlugin((nuxt) => {
  const { stateKey, queryClientOptions, vueQueryPluginOptions, dehydrateOptions } = getVueQueryOptions(useRuntimeConfig())
  const vueQueryState = useState<DehydratedState | null>(stateKey)
  const queryClient = new QueryClient(queryClientOptions)

  // The plugin hook is replaced by the user provided vue-query.config.ts and allow advanced modifications
  const { pluginReturn, vueQueryPluginOptions: hookOptions } = pluginHook({ queryClient, nuxt })

  nuxt.vueApp.use(VueQueryPlugin, { queryClient, ...vueQueryPluginOptions, ...hookOptions })

  if (import.meta.server) {
    nuxt.hooks.hook("app:rendered", () => {
      vueQueryState.value = dehydrate(queryClient, dehydrateOptionKeys.reduce<DehydrateOptions>((newDehydrateOptions, key) => {
        if (dehydrateOptions[key] !== undefined) {
          // https://stackoverflow.com/questions/64408632/typescript-inconsistent-check-for-undefined-why-do-i-need-an-exclamation-poin
          // https://stackoverflow.com/questions/60077761/typescript-null-check-doesnt-work-inside-array-map-function/60077855#60077855
          const narrowedValue = dehydrateOptions[key]
          newDehydrateOptions[key] = () => narrowedValue
        }
        return newDehydrateOptions
      }, {}))
    })
  }

  if (import.meta.client) hydrate(queryClient, vueQueryState.value)

  return pluginReturn
})
