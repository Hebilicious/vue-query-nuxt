import type { PluginCallbackParameters, ReturnedByPlugin } from "#build/internal.vue-query-plugin-callback"

export const defineVueQueryPluginCallback = (callback: (pluginCallbackParameters: PluginCallbackParameters) => ReturnedByPlugin): typeof callback => callback
