<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query"

const { $createHooks, $test } = useNuxtApp()
$test.log("hello")

const { data, isLoading } = useQuery({
  queryKey: ["todos"],
  queryFn: () => $fetch("/api/todos")
})
</script>

<template>
  <h1>Advanced Example</h1>
  <pre>
    {{ typeof $createHooks }}
  </pre>
  <div>
    <h2>Todos</h2>
    <p v-if="isLoading">
      Loading
    </p>
    <pre>{{ data }}</pre>
  </div>
</template>
