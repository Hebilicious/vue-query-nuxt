import type { PluginHookParameters, PluginHookReturn } from "../types"

// @note the generic is needed to augment NuxtApp with the return type
export function defineVueQueryPluginHook<T extends PluginHookReturn>(callback: (pluginHookParameters: PluginHookParameters) => T) {
  return callback
}
