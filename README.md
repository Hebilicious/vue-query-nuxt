# ⚗️ Vue Query Nuxt

[![CI](https://github.com/Hebilicious/vue-query-nuxt/actions/workflows/ci.yaml/badge.svg)](https://github.com/Hebilicious/vue-query-nuxt/actions/workflows/ci.yaml)
[![npm version](https://badge.fury.io/js/@hebilicious%2Fvue-query-nuxt.svg)](https://badge.fury.io/js/@hebilicious%2Fvue-query-nuxt)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

🚀 Welcome to __Vue Query Nuxt__!  

This Nuxt Module automatically installs and configure Vue Query for your Nuxt application.
It has 0 config out-of-the box and extremely lightweight.

##  ⚠️ Disclaimer

_🧪 This module is in active development._

Refer to the [Vue Query documentation](https://tanstack.com/query/latest/docs/vue/quick-start) for more information about Vue Query.

## 📦 Installation


1. Use npm, pnpm or yarn to install the dependencies.

```bash
npm i @hebilicious/vue-query-nuxt @tanstack/vue-query  
```

```bash
pnpm i @hebilicious/vue-query-nuxt @tanstack/vue-query  
```

```bash
yarn i @hebilicious/vue-query-nuxt @tanstack/vue-query  
```

2. Add the modules to your Nuxt modules

```ts
// In nuxt.config.ts
export default defineNuxtConfig({
  modules: ["@hebilicious/vue-query-nuxt"]
})
```

3. Use right away

```html
<script setup>
import { useQueryClient, useQuery, useMutation } from '@tanstack/vue-query'

// Access QueryClient instance
const queryClient = useQueryClient()

// Query
const { isLoading, isError, data, error } = useQuery({
  queryKey: ['todos'],
  queryFn: () => $fetch("/api/todos"), // Use $fetch with your api routes to get typesafety 
})

// Mutation
const { mutate } = useMutation({
  mutationFn: (newTodo) => $fetch("/api/todos", { method: "POST", body: newTodo })
  onSuccess: () => {
    // Invalidate and refetch
    queryClient.invalidateQueries({ queryKey: ['todos'] })
  },
})

function onButtonClick() {
   mutate({
    id: Date.now(),
    title: 'Do Laundry',
  })
}
</script>

<template>
  <span v-if="isLoading">Loading...</span>
  <span v-else-if="isError">Error: {{ error.message }}</span>
  <!-- We can assume by this point that `isSuccess === true` -->
  <ul v-else>
    <li v-for="todo in data" :key="todo.id">{{ todo.title }}</li>
  </ul>
  <button @click="onButtonClick">Add Todo</button>
</template>
```

4. Advanced configuration

You can specify the options under the vueQuery key in your nuxt.config.ts file.
Everything is typed.

```ts
// In nuxt.config.ts
export default defineNuxtConfig({
  modules: ["@hebilicious/vue-query-nuxt"],
  vueQuery: {
    stateKey: "vue-query-nuxt",
    queryClientOptions: {
      defaultOptions: { queries: { staleTime: 5000 } } // default
    },
    vueQueryPluginOptions: {}
  }
})
```
If you need to modify the plugin that installs vue query, you can create a `vue-query.config.ts` file at the root of your project.

```ts
// vue-query.config.ts
import { library } from "@example/libray"

export default defineVueQueryPluginCallback((vueQueryOptions) => {
  console.log(vueQueryOptions) // You can access the queryClient here
  return { provide: { library, test: console } }
})
```

This callback will be run *directly* after the Vue Query plugin is installed, so you can use it to `provide` something.
This can be useful if you want to configure something that needs the `queryClient` or you want to provide a library in the same plugin.

## 📦 Contributing

Contributions, issues and feature requests are welcome!

1. Fork this repo

2. Install `node` and `pnpm` _Use `corepack enable && corepack prepare pnpm@latest --activate` to install pnpm easily_

3. Use `pnpm i` at the mono-repo root.

4. Make modifications and follow conventional commits.

5. Open a PR 🚀🚀🚀
