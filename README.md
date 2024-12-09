# ⚗️ Vue Query Nuxt

[![CI](https://github.com/Hebilicious/vue-query-nuxt/actions/workflows/ci.yaml/badge.svg)](https://github.com/Hebilicious/vue-query-nuxt/actions/workflows/ci.yaml)
[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[npm-version-src]: https://img.shields.io/npm/v/@hebilicious/vue-query-nuxt
[npm-version-href]: https://npmjs.com/package/@hebilicious/vue-query-nuxt
[npm-downloads-src]: https://img.shields.io/npm/dm/@hebilicious/vue-query-nuxt
[npm-downloads-href]: https://npmjs.com/package/@hebilicious/vue-query-nuxt

🚀 Welcome to __Vue Query Nuxt__!  

This Nuxt Module automatically installs and configure Vue Query for your Nuxt application.
It has 0 config out-of-the box and extremely lightweight.

## Features

- 0 config out-of-the box
- All configurations options available
- Auto Imports for Vue Query composables

Refer to the [Vue Query documentation](https://tanstack.com/query/latest/docs/vue/quick-start) for more information about Vue Query.

## 📦 How to use

### 1. Use npm, pnpm or yarn to install the dependencies.

```bash
npx nuxi@latest module add vue-query
npm i @tanstack/vue-query
```

### 2. Add the modules to your Nuxt modules

In `nuxt.config.ts` :

```ts
export default defineNuxtConfig({
  modules: ["@hebilicious/vue-query-nuxt"]
})
```

### 3. Use right away

In a vue component :

```html
<script setup lang="ts">
// Access QueryClient instance
const queryClient = useQueryClient()

// Query
const { isLoading, isError, data, suspense, error } = useQuery({
  queryKey: ['todos'],
  queryFn: () => $fetch("/api/todos"), // Use $fetch with your api routes to get typesafety 
})

//Suspense
onServerPrefetch(suspense)

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

### 4. Advanced configuration

You can specify the options under the vueQuery key in your nuxt.config.ts file.
Everything is typed.

In `nuxt.config.ts` :

```ts
export default defineNuxtConfig({
  modules: ["@hebilicious/vue-query-nuxt"],
  vueQuery: {
    // useState key used by nuxt for the vue query state.
    stateKey: "vue-query-nuxt", // default
    // If you only want to import some functions, specify them here.
    // You can pass false or an empty array to disable this feature.
    // default: ["useQuery", "useQueries", "useInfiniteQuery", "useMutation", "useIsFetching", "useIsMutating", "useQueryClient"]
    autoImports: ["useQuery"],
    // Pass the vue query client options here ...
    queryClientOptions: {
      defaultOptions: { queries: { staleTime: 5000 } } // default
    },
    // Pass the vue query plugin options here ....
    vueQueryPluginOptions: {
      enableDevtoolsV6Plugin: true, // enable integrate with the official vue devtools
    }
  }
})
```

If you need to modify the plugin that installs vue query, you can create a `vue-query.config.ts` file at the root of your project.

In `vue-query.config.ts` :

```ts
import { library } from "@example/libray"

export default defineVueQueryPluginHook(({ queryClient, nuxt }) => {
  console.log(queryClient, nuxt) // You can access the queryClient here
  return {
    pluginReturn: { provide: { library, test: console } }, // nuxt plugin return value
    vueQueryPluginOptions: { queryClient } // You can pass dynamic options
  }
})
```

This hook will be run within the nuxt plugin installed by the module, so you can use it to `provide` something or replace the vue query options.
This can be useful if you need to run custom logic when the `queryClient` is being installed.

## 📦 Contributing

Contributions, issues and feature requests are welcome!

1. Fork this repo

2. Install `node` and `pnpm` _Use `corepack enable && corepack prepare pnpm@latest --activate` to install pnpm easily_

3. Use `pnpm i` at the mono-repo root.

4. Make modifications and follow conventional commits.

5. Open a PR 🚀🚀🚀
