import type { QueryClientConfig, VueQueryPluginOptions, DehydrateOptions } from "@tanstack/vue-query"
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

type VueQueryComposables = typeof composables
export const dehydrateOptionKeys = ['shouldDehydrateMutation', 'shouldDehydrateQuery', 'shouldRedactErrors'] as Array<keyof DehydrateOptions>;
export interface ModuleOptions {
  stateKey: string
  autoImports: VueQueryComposables | false
  queryClientOptions: QueryClientConfig | undefined
  vueQueryPluginOptions: VueQueryPluginOptions,
  dehydrateOptions: { [P in typeof dehydrateOptionKeys[number]]?: boolean }
}

export const defaults: ModuleOptions = {
  stateKey: NAME,
  autoImports: [...composables],
  queryClientOptions: {
    defaultOptions: { queries: { staleTime: 5000 } }
  },
  vueQueryPluginOptions: {},
  dehydrateOptions: {}
}
export function getVueQueryOptions(config: RuntimeConfig) {
  return config.public[configKey] as ModuleOptions
}
