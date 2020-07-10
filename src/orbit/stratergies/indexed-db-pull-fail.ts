import { RequestStrategy }  from "@orbit/coordinator";

export default new RequestStrategy({
  source: "indexedDB",
  on: "pullFail",
  action: function(_, e) {
    //https://github.com/orbitjs/orbit/blob/76e2046754aa889d2914f8b5527067d8b54236bb/packages/%40orbit/core/src/task-queue.ts#L244
    this.source.requestQueue.skip(e)
  },

  blocking: true
});
