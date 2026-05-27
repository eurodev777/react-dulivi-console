export interface CreativeData {
  title: string;
  hook: string;
  badge: string;
  accentColor: string;
  bgGradientStart: string;
  bgGradientEnd: string;
  bgImagePrompt: string;
}

export interface CityLead {
  name: string;
  metric: string;
}

export interface LeadData {
  state: string;
  uf: string;
  cities: CityLead[];
}
