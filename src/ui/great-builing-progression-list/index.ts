import Store from './../../store';

export default class GreatBuildingProgressionList {
  store: Store;
  window: any;

  constructor(store: Store){
    this.store = store;
    this.window = null;
  }

  async displayList({detail:{playerGreatBuildings, date}}){
    let results = [];
    for(let i = 0; i < playerGreatBuildings.length; i++){
      let gb = playerGreatBuildings[i]
      //110-3-1878-12925106
      let greatBuilding = await this.store.memory.query(q =>
        q.findRelatedRecord({ type: "playerGreatBuilding", id: gb.id }, "greatBuilding")
      );
      let player = await this.store.memory.query(q =>
        q.findRelatedRecord({ type: "playerGreatBuilding", id: gb.id }, "player")
      );
      let levelLog = await this.store.memory.query(q =>
        q.findRelatedRecords({ type: "playerGreatBuilding", id: gb.id }, "levelLog").sort('-createdAt')
      );

      const intl:any  = Intl
      const rtf1 = new intl.RelativeTimeFormat('en', { style: 'narrow' });

      // 'formatRangeToParts' does not exist on type 'DateTimeFormat'. it's a super early api so can't find ts support

      results.push({
        playerName: player.attributes.name,
        greatBuildingName: greatBuilding.attributes.name,
        current: levelLog[0].attributes.forgePoints,
        lastChanged: rtf1.format((levelLog[0].attributes.createdAt - date) / 36e5, 'hours'),
        lastChangedDate: levelLog[0].attributes.createdAt
      });
    }
    console.table(results.sort((a, b) => b.lastChangedDate - a.lastChangedDate))
    if(!this.window) {
      let element:any = document.querySelector('body').appendChild(document.createElement('my-thing'))
      element.title = "Great Building Investment Changes"
      element.addEventListener("close", function(event: CustomEvent){
        document.querySelector('body').removeChild(event.detail)
        event.detail.$destroy()
        this.window = null;
      }.bind(this));
      this.window = element
    }

    this.window.data = results;
  }
}
