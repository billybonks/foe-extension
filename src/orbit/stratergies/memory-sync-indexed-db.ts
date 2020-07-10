import { SyncStrategy }  from "@orbit/coordinator";

  // Sync all changes received from the indexdb to the memory source
export default new SyncStrategy({
  source: "memory",
  target: "indexedDB",
  blocking: true
})
