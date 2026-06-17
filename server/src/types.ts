export interface TimelineEvent {
  year: string;
  event: string;
}

export interface Headline {
  year: string;
  outlet: string;
  headline: string;
  summary: string;
}

export interface TopEconomy {
  country: string;
  gdpTrillions: number;
  note: string;
}

export interface Economy {
  globalGdpTrillions: number;
  summary: string;
  topEconomies: TopEconomy[];
}

export interface FamousPerson {
  name: string;
  role: string;
  bio: string;
}

export interface MapRegion {
  name: string;
  status: string;
  description: string;
  color: string;
}

export interface MapData {
  summary: string;
  regions: MapRegion[];
}

export interface ScenarioData {
  title: string;
  premise: string;
  divergencePoint: string;
  timeline: TimelineEvent[];
  headlines: Headline[];
  economy: Economy;
  famousPeople: FamousPerson[];
  map: MapData;
}
