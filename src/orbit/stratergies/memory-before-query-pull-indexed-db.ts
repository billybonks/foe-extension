import { RequestStrategy }  from "@orbit/coordinator";

export default new RequestStrategy({
  source: "memory",
  on: "beforeQuery",

  target: "indexedDB",
  action: "pull",

  blocking: true
})
