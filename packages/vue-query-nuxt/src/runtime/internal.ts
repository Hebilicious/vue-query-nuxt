import { type QueryClient } from "@tanstack/vue-query"

export type ReturnedByPlugin =
| void
| Promise<void>
| Promise<{ provide?: Record<string, unknown> | undefined }>
| { provide?: Record<string, unknown> | undefined }

export interface PluginCallbackParameters {
  queryClient: QueryClient
}
// "#build/internal.vue-query-plugin-callback will resolve to this file when building the library.
// The actual function will be defined by the user and injected in the .nuxt directory.
// Typescript will resolve this type regardless
// eslint-disable-next-line unused-imports/no-unused-vars
export const pluginCallback = (pluginCallbackParameters: PluginCallbackParameters): ReturnedByPlugin => ({})
