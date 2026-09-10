export interface PlanetData {
  id: string;
  name: string;
  radius: number;
  distance: number;
  speed: number;
  rotationSpeed: number;
  axialTilt: number;
  color: string;
  hasAtmosphere?: boolean;
  hasRings?: boolean;
  ringInner?: number;
  ringOuter?: number;
  hasClouds?: boolean;
  moons?: {
    name: string;
    radius: number;
    distance: number;
    speed: number;
    color: string;
  }[];
}

export const SOLAR_SYSTEM_PLANETS: PlanetData[] = [
  {
    id: 'mercury',
    name: 'Mercury',
    radius: 1.4,
    distance: 28,
    speed: 1.6,
    rotationSpeed: 0.008,
    axialTilt: 0.03,
    color: '#8a837c',
  },
  {
    id: 'venus',
    name: 'Venus',
    radius: 2.6,
    distance: 42,
    speed: 1.18,
    rotationSpeed: -0.004,
    axialTilt: 177.3,
    color: '#e3bb7b',
    hasAtmosphere: true,
  },
  {
    id: 'earth',
    name: 'Earth',
    radius: 2.8,
    distance: 60,
    speed: 1.0,
    rotationSpeed: 0.02,
    axialTilt: 23.44,
    color: '#2b82c9',
    hasAtmosphere: true,
    hasClouds: true,
    moons: [
      {
        name: 'Moon',
        radius: 0.75,
        distance: 5.2,
        speed: 2.8,
        color: '#c5c5c5',
      },
    ],
  },
  {
    id: 'mars',
    name: 'Mars',
    radius: 1.8,
    distance: 80,
    speed: 0.8,
    rotationSpeed: 0.018,
    axialTilt: 25.19,
    color: '#c1440e',
    hasAtmosphere: true,
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    radius: 7.2,
    distance: 118,
    speed: 0.44,
    rotationSpeed: 0.04,
    axialTilt: 3.13,
    color: '#c88b3a',
    hasAtmosphere: true,
    moons: [
      {
        name: 'Io',
        radius: 0.6,
        distance: 10.5,
        speed: 3.2,
        color: '#e5ca55',
      },
      {
        name: 'Europa',
        radius: 0.5,
        distance: 13.5,
        speed: 2.4,
        color: '#d4cbb8',
      },
      {
        name: 'Ganymede',
        radius: 0.85,
        distance: 17.5,
        speed: 1.8,
        color: '#93897d',
      },
      {
        name: 'Callisto',
        radius: 0.75,
        distance: 22.0,
        speed: 1.2,
        color: '#716860',
      },
    ],
  },
  {
    id: 'saturn',
    name: 'Saturn',
    radius: 6.0,
    distance: 165,
    speed: 0.32,
    rotationSpeed: 0.038,
    axialTilt: 26.73,
    color: '#e4bf84',
    hasRings: true,
    ringInner: 8.5,
    ringOuter: 17.0,
    moons: [
      {
        name: 'Titan',
        radius: 0.8,
        distance: 22.5,
        speed: 1.5,
        color: '#d69e43',
      },
    ],
  },
  {
    id: 'uranus',
    name: 'Uranus',
    radius: 4.0,
    distance: 215,
    speed: 0.22,
    rotationSpeed: -0.025,
    axialTilt: 97.77,
    color: '#71b5ca',
    hasRings: true,
    ringInner: 5.5,
    ringOuter: 8.5,
  },
  {
    id: 'neptune',
    name: 'Neptune',
    radius: 3.8,
    distance: 265,
    speed: 0.18,
    rotationSpeed: 0.028,
    axialTilt: 28.32,
    color: '#274687',
    hasAtmosphere: true,
    moons: [
      {
        name: 'Triton',
        radius: 0.7,
        distance: 7.5,
        speed: -1.9,
        color: '#c2cbd9',
      },
    ],
  },
];
