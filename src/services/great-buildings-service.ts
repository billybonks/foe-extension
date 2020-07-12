import Store from './../store';
import FoeProxy from './../foe-proxy/index';
import GreatBuildingServiceMessage from './../foe-proxy/messages/great-building-service-message'
// import Heimdall from 'heimdalljs';
// import { Promise } from 'rsvp';


const chunk = (input, size) => {
  return input.reduce((arr, item, idx) => {
    return idx % size === 0
      ? [...arr, [item]]
      : [...arr.slice(0, -1), [...arr.slice(-1)[0], item]];
  }, []);
};

export default class GreatBuildingsService extends EventTarget {
  store: Store;
  world: string;

  constructor(store, world) {
    super();
    this.store = store;
    this.world = world
  }

  bindHandlers(proxy: FoeProxy){
    proxy.addHandler('GreatBuildingsService', 'getContributions', this.getContributions.bind(this));
    proxy.addHandler('GreatBuildingsService', 'getOtherPlayerOverview', this.getOtherPlayerOverview.bind(this));
  }
  // visiting single greatbuilding pane
  getConstruction() {

  }

  // visiting contributions pane
  async getContributions(result: GreatBuildingServiceMessage) {
    let date = new Date();
    let playerGreatBuildings = await this.pushGreatBuildings(result.responseData, date);
    this.dispatchEvent(new CustomEvent('PlayerGreatBuildingsUpdated', {detail: {playerGreatBuildings, date}}))
  }

  // visiting players great building list
  async getOtherPlayerOverview(result: GreatBuildingServiceMessage) {
    console.log(result)
    let date = new Date();
    //lastSawGreatBuildings: date,
    let playerGreatBuildings = await this.pushGreatBuildings(result.responseData, date);
    this.dispatchEvent(new CustomEvent('PlayerGreatBuildingsUpdated', {detail: {playerGreatBuildings, date}}))
  }

  findPlayerGreatBuilding(playerGreatBuildingId){
    return this.store.where('playerGreatBuilding', {attribute:'id', value:playerGreatBuildingId})
  }

  async pushGreatBuildings(greatBuildings, date){
    let result = [];
    let chunkedGBs = chunk(greatBuildings, 10);
    let playerGretBuildings = chunkedGBs.map(() => {

    })//5,10
    performance.mark('startPushGreatBuildings');
    // let result = await Promise.all(greatBuildings.map(async(gb) => {
    for(let i = 0; i < greatBuildings.length; i++){
      let gb = greatBuildings[i];
      let playerId = gb.player.player_id;

      let playerGreatBuildingId = `${gb.entity_id}-${playerId}`;
      let playerGreatBuiding = await this.findPlayerGreatBuilding(playerGreatBuildingId);
      let playerGreatBuildingUpdateFunction = 'update';

      if(!playerGreatBuiding){
        const player = await this.store.findOrCreate({
          type: 'player',
          id: playerId,
          attributes: {
            name: gb.player.name,
          }
        });
        
        await this.store.findOrCreate({
          type: 'greatBuilding',
          id: gb.city_entity_id,
          attributes: {
            name: gb.name
          }
        });
        playerGreatBuildingUpdateFunction = 'insert';
      }

      // not actually sure about the semantics of insert or update in orbit, so i send the entire payload
      let playerGreatBuildings = await this.store[playerGreatBuildingUpdateFunction]({
        type: 'playerGreatBuilding',
        id: playerGreatBuildingId,
        attributes: {
          world: this.world,
          lastVisit: date,
        },
        relationships: {
          greatBuilding: { data: { type: "greatBuilding", id: gb.city_entity_id } },
          player: { data: {type: 'player', id: playerId } }
        }
      });


      if(gb.current_progress > 0) {
        let levelLog = await this.store.findOrCreate({
          type: 'greatBuildingLevelLog',
          id: `${gb.current_progress}-${gb.level}-${playerGreatBuildingId}`,
          attributes: {
            forgePoints: gb.current_progress,
            level: gb.level,
            createdAt: date
          },
          relationships: {
            playerGreatBuilding: { data: { type: "playerGreatBuilding", id: playerGreatBuildingId } }
          }
        });
        debugger
       let r = {
          playerName: gb.player.name,
          greatBuildingName: gb.name,
          lastChangedAt: levelLog.attributes.createdAt,
        }
        result.push(r);
      }
    }
   // return r
   // }))
    debugger
    performance.mark('stopPushGreatBuildings');
    performance.measure("measure time to push greatbuildings", 'startPushGreatBuildings', 'stopPushGreatBuildings');
    // Pull out all of the measurements.
    console.log(performance.getEntriesByType("measure"));

    // Finally, clean up the entries.
    performance.clearMarks();
    performance.clearMeasures();
    return result.filter((gb) => !!gb);
  }
}
