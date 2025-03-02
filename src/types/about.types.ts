// types/about.types.ts
export interface Consultant {
  _id?: string;
  name: string;
  position: string;
  image: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  qrCode?: string;
  description?: string;
  order?: number;
  active?: boolean;
  headerImage?: string;
}

export interface SocialMission {
  text: string;
  backgroundImage: string;
}

export interface Location {
  address: string;
  mapUrl: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface AboutSettings {
  consultants: Consultant[];
  socialMission: SocialMission;
  location: Location;
}


export interface PublicConsultant {
  name: string;
  position: string;
  image: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  qrCode?: string;
  description?: string;
}

export interface PublicSocialMission {
  text: string;
  backgroundImage: string;
}

export interface PublicLocation {
  address: string;
  mapUrl: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface PublicAboutSettings {
  consultants: PublicConsultant[];
  socialMission: PublicSocialMission;
  location: PublicLocation;
}