import MemorySource from '@orbit/memory';
import IndexdbSource from '@orbit/indexeddb';
import Coordinator from "@orbit/coordinator";
import { EventLoggingStrategy } from "@orbit/coordinator";

import indexedDBPullFail from './stratergies/indexed-db-pull-fail';
import memoryBeforeQueryPullIndexedDB from './stratergies/memory-before-query-pull-indexed-db';
import memoryQueryFail from './stratergies/memory-query-fail';
import memorySyncIndexedDB from './stratergies/memory-sync-indexed-db';
import indexedDBSyncMemory from './stratergies/indexed-db-sync-memory';



const debug = false;
export default function(schema) {
  const memory = new MemorySource({ schema });
  const indexdbSource = new IndexdbSource({ schema });
  const stratergies = [indexedDBPullFail, memoryBeforeQueryPullIndexedDB, memoryQueryFail, memorySyncIndexedDB, indexedDBSyncMemory];
  const coordinator = new Coordinator({
    sources: [memory, indexdbSource],
    strategies: debug ? [...stratergies, new EventLoggingStrategy()] : stratergies
  });


  coordinator.activate().then(() => {
    console.log("Coordinator is active");
  });

  return memory;
}
