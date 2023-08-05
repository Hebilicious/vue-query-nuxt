import type { NuxtApp } from "nuxt/app"
import type { QueryClient, VueQueryPluginOptions } from "@tanstack/vue-query"

export type NuxtPluginReturn =
| void
| Promise<void>
| Promise<{ provide?: Record<string, unknown> | undefined }>
| { provide?: Record<string, unknown> | undefined }

export interface PluginHookParameters {
  nuxt: NuxtApp
  queryClient: QueryClient
}

export interface PluginHookReturn { pluginReturn: NuxtPluginReturn; vueQueryPluginOptions?: VueQueryPluginOptions }
