import GreatBuilding from './great-building';

export default interface GreatBuildingServiceMessage {
  requestClass: string
  requestId: number
  requestMethod: string
  responseData: Array<GreatBuilding>
}
