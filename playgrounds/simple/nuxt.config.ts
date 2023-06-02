export default defineNuxtConfig({
  modules: ["@hebilicious/vue-query-nuxt"],
  nitro: {
    preset: "cloudflare-module"
  },
  build: {
    analyze: true
  },
  experimental: {
  }
})
