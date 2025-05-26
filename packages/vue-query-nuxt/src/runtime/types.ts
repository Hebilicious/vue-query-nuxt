import type { NuxtApp } from "nuxt/app"
import type { DehydrateOptions, HydrateOptions, QueryClient, VueQueryPluginOptions } from "@tanstack/vue-query"

export type NuxtPluginReturn =
| void
| Promise<void>
| Promise<{ provide?: Record<string, unknown> | undefined }>
| { provide?: Record<string, unknown> | undefined }

// NuxtApp & _NuxtApp are different so we use any
export interface PluginHookParameters {
  nuxt: NuxtApp & any
  queryClient: QueryClient
}

export interface PluginHookReturn { pluginReturn: NuxtPluginReturn; vueQueryPluginOptions?: VueQueryPluginOptions, hydrateOptions?: HydrateOptions, dehydrateOptions?: DehydrateOptions }
