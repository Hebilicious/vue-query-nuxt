import type { PluginCallbackParameters, ReturnedByPlugin } from "../types"

export function defineVueQueryPluginCallback<T extends ReturnedByPlugin>(
  callback: (callbackParameters: PluginCallbackParameters) => T
): (callbackParameters: PluginCallbackParameters) => T {
  return callback
}
