<script setup lang="ts">
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
