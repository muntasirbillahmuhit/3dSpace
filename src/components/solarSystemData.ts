export interface CelestialInfo {
  tagline: string;
  type: string;
  diameterKm: string;
  distanceFromSun: string;
  orbitalPeriod: string;
  dayLength: string;
  temperature: string;
  gravity: string;
  atmosphere: string;
  notableFeatures: string[];
  summary: string;
}

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
  info: CelestialInfo;
  moons?: {
    name: string;
    radius: number;
    distance: number;
    speed: number;
    color: string;
  }[];
}

export const SUN_DATA = {
  id: 'sun',
  name: 'Sun',
  radius: 12,
  distance: 0,
  speed: 0,
  rotationSpeed: 0.005,
  axialTilt: 7.25,
  color: '#f59e0b',
  info: {
    tagline: 'Heart of the Solar System',
    type: 'G-Type Main-Sequence Star (Yellow Dwarf)',
    diameterKm: '1,392,700 km (109 Earths)',
    distanceFromSun: 'Center (0 AU)',
    orbitalPeriod: '230 Million Years (Galactic Orbit)',
    dayLength: '27 Earth Days (Differential)',
    temperature: '5,500°C (Surface) / 15,000,000°C (Core)',
    gravity: '274.0 m/s² (27.9g)',
    atmosphere: '73.4% Hydrogen, 25.0% Helium, trace heavier elements',
    notableFeatures: ['Corona & Coronal Loops', 'Sunspot Pairs & Solar Flares', 'Photosphere Granulation'],
    summary: 'The Sun comprises 99.86% of the Solar System\'s total mass. Its radiant nuclear fusion converts 600 million tons of hydrogen into helium every second, sustaining all life, planetary climates, and orbital gravity across interplanetary space.',
  },
};

export const COMET_DATA = {
  id: 'comet',
  name: '1P/Halley',
  radius: 0.7,
  distance: 120,
  speed: 0.35,
  rotationSpeed: 0.02,
  axialTilt: 18,
  color: '#67e8f9',
  info: {
    tagline: 'The Legendary Cosmic Wanderer',
    type: 'Periodic Halley-Type Comet',
    diameterKm: '15 × 8 × 8 km (Nucleus)',
    distanceFromSun: '0.59 to 35.1 AU (Eccentric Orbit)',
    orbitalPeriod: '75.3 Earth Years',
    dayLength: '52.8 Hours (Tumbling spin)',
    temperature: '-200°C to 77°C (Near perihelion)',
    gravity: '0.002 m/s² (Microgravity)',
    atmosphere: 'Transient Coma: Water vapor (80%), CO, Methane, Ammonia',
    notableFeatures: ['Dual Dust & Ion Gas Tails (stretching up to 100M km)', 'Sublimating icy cryo-jets erupting from dark crust', 'Parent body of the Orionid & Eta Aquariid meteor showers'],
    summary: 'The most famous periodic comet in recorded human history, Halley’s Comet sweeps past Earth once every 75–76 years. Solar radiation sublimates volatile surface ices into a luminous glowing coma and ion tail that always streams directly away from the Sun.',
  },
};

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
    info: {
      tagline: 'The Swift Iron World',
      type: 'Terrestrial Planet',
      diameterKm: '4,879 km',
      distanceFromSun: '0.39 AU (57.9M km)',
      orbitalPeriod: '88 Earth Days',
      dayLength: '58.6 Earth Days',
      temperature: '-180°C to 430°C',
      gravity: '3.7 m/s² (0.38g)',
      atmosphere: 'Trace Exosphere (Oxygen, Sodium, Hydrogen)',
      notableFeatures: ['Caloris Basin impact crater', 'Lobate Scarps (planetary shrinkage cliffs)', 'Permanently shadowed polar ice traps'],
      summary: 'The smallest and innermost planet, Mercury possesses a gigantic metallic iron core occupying 85% of its radius and experiences extreme thermal swings between scorching sunlight and freezing vacuum.',
    },
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
    info: {
      tagline: 'The Morning Star & Runaway Greenhouse',
      type: 'Terrestrial Planet',
      diameterKm: '12,104 km',
      distanceFromSun: '0.72 AU (108.2M km)',
      orbitalPeriod: '224.7 Earth Days',
      dayLength: '243 Earth Days (Retrograde)',
      temperature: '465°C (Average constant)',
      gravity: '8.87 m/s² (0.90g)',
      atmosphere: '96.5% Carbon Dioxide, 3.5% Nitrogen, Sulfuric Acid clouds',
      notableFeatures: ['Maxwell Montes (11km high mountain)', 'Pancake Domes (volcanic lava blisters)', 'Retrograde clockwise rotation'],
      summary: 'Shrouded in opaque reflective sulfuric acid clouds, Venus is the hottest planet in the Solar System due to an uninhibited runaway greenhouse effect, with surface pressure equal to 900 meters underwater on Earth.',
    },
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
    info: {
      tagline: 'The Blue Marble & Haven for Life',
      type: 'Terrestrial Planet',
      diameterKm: '12,742 km',
      distanceFromSun: '1.00 AU (149.6M km)',
      orbitalPeriod: '365.25 Earth Days',
      dayLength: '24 Hours',
      temperature: '-89°C to 57°C (Average 15°C)',
      gravity: '9.81 m/s² (1.00g)',
      atmosphere: '78.1% Nitrogen, 20.9% Oxygen, 0.9% Argon, trace CO₂/H₂O',
      notableFeatures: ['Global liquid water oceans (71% surface)', 'Dynamic plate tectonics & continents', 'Protective geomagnetic field shielding magnetosphere'],
      summary: 'The only known world harboring life, Earth features extensive liquid surface oceans, active plate tectonics, an oxygen-rich atmosphere, and a stabilizing large natural moon that moderates axial wobble and ocean tides.',
    },
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
    info: {
      tagline: 'The Red Planet',
      type: 'Terrestrial Planet',
      diameterKm: '6,779 km',
      distanceFromSun: '1.52 AU (227.9M km)',
      orbitalPeriod: '687 Earth Days (1.88 yrs)',
      dayLength: '24h 37m (1 Sol)',
      temperature: '-140°C to 20°C (Average -63°C)',
      gravity: '3.72 m/s² (0.38g)',
      atmosphere: '95.3% Carbon Dioxide, 2.6% Nitrogen, 1.9% Argon',
      notableFeatures: ['Olympus Mons (highest shield volcano in Solar System, 21.9km)', 'Valles Marineris (4,000km grand canyon system)', 'Water ice and dry ice polar caps'],
      summary: 'Stained reddish-ochre by surface iron oxide dust, Mars exhibits ancient river valleys, dried lakebeds, massive extinct volcanoes, and polar ice caps that expand and contract with the changing Martian seasons.',
    },
    moons: [
      {
        name: 'Phobos',
        radius: 0.35,
        distance: 3.2,
        speed: 4.2,
        color: '#8a7d72',
      },
      {
        name: 'Deimos',
        radius: 0.24,
        distance: 4.8,
        speed: 3.1,
        color: '#9a8d80',
      },
    ],
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
    info: {
      tagline: 'The King of Planets',
      type: 'Gas Giant',
      diameterKm: '139,820 km (11 Earths)',
      distanceFromSun: '5.20 AU (778.5M km)',
      orbitalPeriod: '11.86 Earth Years',
      dayLength: '9h 55m (Fastest planetary spin)',
      temperature: '-110°C (Cloud tops)',
      gravity: '24.79 m/s² (2.53g)',
      atmosphere: '89.8% Hydrogen, 10.2% Helium, traces of Ammonia & Methane',
      notableFeatures: ['The Great Red Spot (century-old anticyclonic superstorm)', 'Alternating dark belts and bright zones', 'Massive magnetosphere extending millions of km'],
      summary: 'With twice the mass of all other Solar System planets combined, Jupiter acts as a gravitational shield against cosmic debris. Its atmospheric bands whip along with supersonic jet streams around its liquid metallic hydrogen interior.',
    },
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
    info: {
      tagline: 'The Jewel of the Solar System',
      type: 'Gas Giant',
      diameterKm: '116,460 km (9.5 Earths)',
      distanceFromSun: '9.58 AU (1.43B km)',
      orbitalPeriod: '29.45 Earth Years',
      dayLength: '10h 33m',
      temperature: '-140°C (Cloud tops)',
      gravity: '10.44 m/s² (1.06g)',
      atmosphere: '96.3% Hydrogen, 3.25% Helium, traces of Methane',
      notableFeatures: ['Majestic icy ring system (spanning 282,000 km, only ~10m thick)', 'North Polar Hexagonal atmospheric jet wave', 'Less dense than liquid water (0.687 g/cm³)'],
      summary: 'Celebrated for its awe-inspiring ring system made of billions of chunks of water ice and rock dust, Saturn is a low-density gas giant adorned with a fascinating family of moons including smog-cloaked Titan and geyser-active Enceladus.',
    },
    moons: [
      {
        name: 'Titan',
        radius: 0.8,
        distance: 22.5,
        speed: 1.5,
        color: '#d69e43',
      },
      {
        name: 'Enceladus',
        radius: 0.42,
        distance: 14.5,
        speed: 2.8,
        color: '#eef4ff',
      },
      {
        name: 'Rhea',
        radius: 0.48,
        distance: 18.0,
        speed: 2.1,
        color: '#cfc9be',
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
    info: {
      tagline: 'The Sideways Ice Giant',
      type: 'Ice Giant',
      diameterKm: '50,724 km (4 Earths)',
      distanceFromSun: '19.2 AU (2.87B km)',
      orbitalPeriod: '84 Earth Years',
      dayLength: '17h 14m (Retrograde)',
      temperature: '-224°C (Coldest atmosphere recorded)',
      gravity: '8.69 m/s² (0.89g)',
      atmosphere: '82.5% Hydrogen, 15.2% Helium, 2.3% Methane (giving its cyan hue)',
      notableFeatures: ['Extreme 98° axial tilt (rolls on its side along orbit)', '13 faint dark rings', 'Complex offset tilted magnetic field'],
      summary: 'Uranus rotates almost completely on its side, likely due to a cataclysmic collision with an Earth-sized protoplanet billions of years ago, resulting in extreme 42-year seasons of continuous sunlight followed by 42 years of dark winter.',
    },
    moons: [
      {
        name: 'Miranda',
        radius: 0.36,
        distance: 7.0,
        speed: 3.1,
        color: '#d0d8df',
      },
      {
        name: 'Titania',
        radius: 0.65,
        distance: 11.2,
        speed: 1.8,
        color: '#b8c2cc',
      },
      {
        name: 'Oberon',
        radius: 0.6,
        distance: 14.5,
        speed: 1.4,
        color: '#9fa8b3',
      },
    ],
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
    info: {
      tagline: 'The Supersonic Winds World',
      type: 'Ice Giant',
      diameterKm: '49,244 km (3.88 Earths)',
      distanceFromSun: '30.1 AU (4.50B km)',
      orbitalPeriod: '164.8 Earth Years',
      dayLength: '16h 6m',
      temperature: '-218°C',
      gravity: '11.15 m/s² (1.14g)',
      atmosphere: '80.0% Hydrogen, 19.0% Helium, 1.5% Methane',
      notableFeatures: ['Fastest winds in Solar System (up to 2,100 km/h)', 'Great Dark Spot cyclonic storm systems', 'Cryovolcanic geysers on moon Triton'],
      summary: 'The most distant major planet in the Solar System, deep-azure Neptune is whipped by ferocious supersonic methane windstorms and radiates 2.6 times more heat into space than it receives from the distant Sun.',
    },
    moons: [
      {
        name: 'Triton',
        radius: 0.7,
        distance: 7.5,
        speed: -1.9,
        color: '#c2cbd9',
      },
      {
        name: 'Proteus',
        radius: 0.38,
        distance: 5.2,
        speed: 2.6,
        color: '#828a96',
      },
    ],
  },
  {
    id: 'pluto',
    name: 'Pluto',
    radius: 1.15,
    distance: 315,
    speed: 0.13,
    rotationSpeed: -0.012,
    axialTilt: 122.53,
    color: '#c49a7a',
    info: {
      tagline: 'The Heart of the Kuiper Belt',
      type: 'Dwarf Planet & Plutoid',
      diameterKm: '2,376 km (0.18 Earths)',
      distanceFromSun: '39.5 AU (5.91B km)',
      orbitalPeriod: '248 Earth Years',
      dayLength: '6.4 Earth Days (Retrograde)',
      temperature: '-230°C to -220°C',
      gravity: '0.62 m/s² (0.063g)',
      atmosphere: 'Tenuous Nitrogen, Methane, Carbon Monoxide',
      notableFeatures: ['Tombaugh Regio (the vast nitrogen ice heart)', 'Sputnik Planitia convection glaciers', 'Water-ice mountains rising 3,500m into nitrogen skies'],
      summary: 'Located in the Kuiper Belt, Pluto forms a binary gravitational dance with its huge moon Charon. New Horizons revealed a geologically active world of flowing nitrogen glaciers, icy peaks, and red tholin hydrocarbon deposits.',
    },
    moons: [
      {
        name: 'Charon',
        radius: 0.52,
        distance: 3.8,
        speed: 2.1,
        color: '#9f9b94',
      },
    ],
  },
];

