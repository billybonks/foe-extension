import FoeProxy from './foe-proxy/index'
import xhrPatch from './foe-proxy/xhr-patch'
import bootOrbit from './orbit/boot-orbit';
import schema from './schema';
import Store from './store';
import GreatBuildingsService from './services/great-buildings-service';
import GreatBuildingsProgressionList from './ui/great-builing-progression-list';

const memory = bootOrbit(schema);

let store = new Store(memory);
let proxy = new FoeProxy();
let currentPLayerId;

xhrPatch(proxy);

let currentWorld = window.location.hostname.split('.')[0];

let greatBuildingsService = new GreatBuildingsService(store, currentWorld);
let greatBuildingsProgressionList = new GreatBuildingsProgressionList(store);

greatBuildingsService.addEventListener('PlayerGreatBuildingsUpdated', greatBuildingsProgressionList.displayList.bind(greatBuildingsProgressionList))
greatBuildingsService.bindHandlers(proxy);

proxy.addHandler('StartupService', 'getData', (data) => {
    currentPLayerId = data.responseData.user_data.player_id
});