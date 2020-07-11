import Store from './../store';
import FoeProxy from './../foe-proxy/index';
import GreatBuildingServiceMessage from './../foe-proxy/messages/great-building-service-message'
// import Heimdall from 'heimdalljs';
// import { Promise } from 'rsvp';
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
    performance.mark('startPushGreatBuildings');
    let result = await Promise.all(greatBuildings.map(async(gb) => {
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


      if(gb.current_progress > 0){
        this.store.findOrCreate({
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
      }
      return playerGreatBuildings;
    }));
    performance.mark('stopPushGreatBuildings');
    performance.measure("measure time to push greatbuildings", 'startPushGreatBuildings', 'stopPushGreatBuildings');
    // Pull out all of the measurements.
    console.log(performance.getEntriesByType("measure"));

    // Finally, clean up the entries.
    performance.clearMarks();
    performance.clearMeasures();
    return result;
  }
}
