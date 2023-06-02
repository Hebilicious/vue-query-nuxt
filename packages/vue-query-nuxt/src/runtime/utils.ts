import type { QueryClientConfig, VueQueryPluginOptions } from "@tanstack/vue-query"
import type { RuntimeConfig } from "nuxt/schema"

export const NAME = "vue-query-nuxt" as const
export const configKey = "vueQuery" as const

export interface VueQueryOptions {
  stateKey: string
  queryClientOptions: QueryClientConfig | undefined
  vueQueryPluginOptions: VueQueryPluginOptions
}

export const defaults: VueQueryOptions = {
  stateKey: NAME,
  queryClientOptions: {
    defaultOptions: { queries: { staleTime: 5000 } }
  },
  vueQueryPluginOptions: {}
}

export function getVueQueryOptions(config: RuntimeConfig) {
  return config.public[configKey] as VueQueryOptions
}
