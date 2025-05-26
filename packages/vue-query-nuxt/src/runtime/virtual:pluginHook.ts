import type { PluginHookParameters, PluginHookReturn } from "./types"

// "#build/internal.vue-query-plugin-callback will resolve to this file when building the library.
// The actual function will be defined by the user and injected in the .nuxt directory.
// Typescript will resolve this type regardless

// eslint-disable-next-line unused-imports/no-unused-vars
export function pluginHook(pluginHookParameters: PluginHookParameters): PluginHookReturn {
  return {}
}
