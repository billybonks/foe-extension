import { Schema } from "@orbit/data";

export default new Schema({
  version: 3,
  models: {
    player: {
      attributes: {
        name: {
          type: "string",
        },
        lastSawGreatBuildings:{
          type:  "date",
        }
      },
      relationships: {
        greatBuildings: { type: "hasMany", model: "playerGreatBuilding", inverse: "player" },
      }
    },
    playerGreatBuilding: {
      attributes: {
        lastVisitedAt: { type: "date" }
      },
      relationships: {
        greatBuilding: { type: "hasOne", model: "greatBuilding", inverse: "playersGreatBuilding" },
        player: { type: "hasOne", model: "player", inverse: "greatBuildings" },
        levelLog: { type: "hasMany", model: "greatBuildingLevelLog", inverse: "playerGreatBuilding" },
      }
    },
    greatBuilding: {
      attributes: {
        name: { type: "string" },
      },
      relationships: {
        playersGreatBuilding: { type: "hasMany", model: "playerGreatBuilding", inverse: "greatBuilding" },
      }
    },
    greatBuildingLevelLog: {
      attributes: {
        forgePoints: { type: "number" },
        level: { type: "number" },
        createdAt: { type: "date" }
      },
      relationships: {
        playerGreatBuilding: { type: "hasOne", model: "playerGreatBuilding", inverse: "levelLog" },
      }
    }
  }
});
