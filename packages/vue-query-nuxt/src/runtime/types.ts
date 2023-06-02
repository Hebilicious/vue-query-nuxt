import { type QueryClient } from "@tanstack/vue-query"

export type ReturnedByPlugin =
| void
| Promise<void>
| Promise<{ provide?: Record<string, unknown> | undefined }>
| { provide?: Record<string, unknown> | undefined }

export interface PluginCallbackParameters {
  queryClient: QueryClient
}
