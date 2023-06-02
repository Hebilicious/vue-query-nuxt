export default defineEventHandler(() => {
  // eslint-disable-next-line no-console
  console.log("Fetching todos ...")
  return [{ id: 1, todo: "Hello" }, { id: 2, todo: "World" }]
})
