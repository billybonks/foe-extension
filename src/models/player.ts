export const schema = {
  attributes: {
    name: { type: "string" },
  },
  relationships: {
    greatBuildings: { type: "hasMany", model: "playerGreatBuilding", inverse: "player" }
  }
}
