// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "../../packages/vue-query-nuxt/src/module.ts"
    // "@hebilicious/vue-query-nuxt"
  ],
  vueQuery: {
    stateKey: "advanced-key",
    queryClientOptions: {
      defaultOptions: {
        queries: { staleTime: 1000 }
      }
    }
    // vueQueryPluginOptions: {
    //   queryClientKey: "custom-key"
    // }
  },
  devtools: {
    enabled: true
  },
  experimental: {
    componentIslands: true,
    renderJsonPayloads: true,
    viewTransition: true,
    typedPages: true,
    payloadExtraction: true
  }
})
