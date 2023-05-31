// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@hebilicious/vue-query-nuxt"],
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
