export enum ResourceMessage {
  OK = 'ok',
  NOT_FOUND = 'not found'
}

export type PlayerResponse = {
  message: ResourceMessage;
  result: { properties: SwapiPlayer };
}

export type SwapiPlayer = {
  name: string;
  height: string;
  mass: string;
  gender: string;
  birth_year: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  homeworld: string;
  films: string[];
  species: string[];
  starships: string[];
  vehicles: string[];
  url: string;
}

export type ShipResponse = {
  message: ResourceMessage;
  result: { properties: SwapiShip };
}

export type SwapiShip = {
  name: string;
  model: string;
  manufacturer: string;
  cost_in_credits: string;
  length: string;
  max_atmosphering_speed: string;
  crew: string;
  passengers: string;
  cargo_capacity: string;
  consumables: string;
  hyperdrive_rating: string;
  MGLT: string;
  starship_class: string;
  pilots: string[];
  films: string[];
  url: string;
}
