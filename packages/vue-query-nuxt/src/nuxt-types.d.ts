import { NAME, type VueQueryOptions, configKey, defaults } from "./runtime/utils"

declare module "@nuxt/schema" {
  interface PublicRuntimeConfig {
    vueQuery: VueQueryOptions
  }
}

export {}
