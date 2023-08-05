import type { QueryClientConfig, VueQueryPluginOptions } from "@tanstack/vue-query"
import type { RuntimeConfig } from "nuxt/schema"

export const NAME = "vue-query-nuxt" as const
export const configKey = "vueQuery" as const

const composables = [
  "useQuery",
  "useQueries",
  "useInfiniteQuery",
  "useMutation",
  "useIsFetching",
  "useIsMutating",
  "useQueryClient"
] as const

type VueQueryComposables = typeof composables[number]
export interface VueQueryOptions {
  stateKey: string
  autoImports: VueQueryComposables[] | false
  queryClientOptions: QueryClientConfig | undefined
  vueQueryPluginOptions: VueQueryPluginOptions
}

export const defaults: VueQueryOptions = {
  stateKey: NAME,
  autoImports: [...composables],
  queryClientOptions: {
    defaultOptions: { queries: { staleTime: 5000 } }
  },
  vueQueryPluginOptions: {}
}

export function getVueQueryOptions(config: RuntimeConfig) {
  return config.public[configKey] as VueQueryOptions
}
