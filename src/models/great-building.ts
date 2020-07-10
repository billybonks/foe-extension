export const schema = {
  attributes: {
    name: { type: "string" },
  },
  relationships: {
    playersGreatBuilding: { type: "hasMany", model: "playerGreatBuilding", inverse: "greatBuilding" },
  }
}
