<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query"

const { data, suspense } = useQuery({
  queryKey: ["todos"],
  queryFn: () => $fetch("/api/todos")
})

onServerPrefetch(async () => {
  await suspense()
})
</script>

<template>
  <pre>
    {{ data }}
  </pre>
</template>
