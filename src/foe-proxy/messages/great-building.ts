import Player from './player';

export default interface GreatBuilding {
    city_entity_id: string
    current_progress: number
    entity_id: number
    level: number
    max_progress: number
    name: string
    player: Player
}
