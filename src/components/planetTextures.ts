import * as THREE from 'three';

class SimpleNoise {
  private p: number[] = [];
  constructor(seed = 1337) {
    const permutation = [];
    for (let i = 0; i < 256; i++) permutation[i] = i;
    let s = seed;
    for (let i = 255; i > 0; i--) {
      s = (s * 16807) % 2147483647;
      const j = Math.floor((s / 2147483647) * (i + 1));
      [permutation[i], permutation[j]] = [permutation[j], permutation[i]];
    }
    for (let i = 0; i < 512; i++) {
      this.p[i] = permutation[i & 255];
    }
  }

  private fade(t: number) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  private lerp(t: number, a: number, b: number) {
    return a + t * (b - a);
  }

  private grad(hash: number, x: number, y: number) {
    const h = hash & 7;
    const u = h < 4 ? x : y;
    const v = h < 4 ? y : x;
    return (h & 1 ? -u : u) + (h & 2 ? -2.0 * v : 2.0 * v);
  }

  noise2D(x: number, y: number) {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);

    const u = this.fade(xf);
    const v = this.fade(yf);

    const aa = this.p[this.p[X] + Y];
    const ab = this.p[this.p[X] + Y + 1];
    const ba = this.p[this.p[X + 1] + Y];
    const bb = this.p[this.p[X + 1] + Y + 1];

    const x1 = this.lerp(u, this.grad(aa, xf, yf), this.grad(ba, xf - 1, yf));
    const x2 = this.lerp(u, this.grad(ab, xf, yf - 1), this.grad(bb, xf - 1, yf - 1));
    return (this.lerp(v, x1, x2) + 1) * 0.5;
  }

  fbm(x: number, y: number, octaves = 5) {
    let total = 0;
    let frequency = 1;
    let amplitude = 1;
    let maxValue = 0;
    for (let i = 0; i < octaves; i++) {
      total += this.noise2D(x * frequency, y * frequency) * amplitude;
      maxValue += amplitude;
      amplitude *= 0.5;
      frequency *= 2;
    }
    return total / maxValue;
  }
}

// 1. Sun Photosphere Texture
export function createSunTexture(): THREE.CanvasTexture {
  const width = 1024;
  const height = 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  const imgData = ctx.createImageData(width, height);
  const noise = new SimpleNoise(1001);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const u = x / width;
      const v = y / height;
      const n = noise.fbm(u * 12.0, v * 12.0, 5);
      const granule = noise.noise2D(u * 32.0, v * 32.0);

      const heat = n * 0.75 + granule * 0.25;
      const idx = (y * width + x) * 4;

      const coreIntensity = Math.min(1.0, heat * 1.2);
      imgData.data[idx] = 255;
      imgData.data[idx + 1] = Math.min(255, Math.floor(205 + coreIntensity * 50));
      imgData.data[idx + 2] = Math.min(255, Math.floor(95 + coreIntensity * 135));
      imgData.data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

// 2. Mercury Texture
export function createMercuryTexture(): THREE.CanvasTexture {
  const width = 512;
  const height = 256;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  const imgData = ctx.createImageData(width, height);
  const noise = new SimpleNoise(2002);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const u = x / width;
      const v = y / height;
      const val = noise.fbm(u * 14.0, v * 14.0, 5);
      const crater = Math.sin(u * 50.0) * Math.cos(v * 50.0) * 0.15;
      const c = Math.floor((val * 0.85 + crater * 0.15) * 140 + 70);

      const idx = (y * width + x) * 4;
      imgData.data[idx] = c;
      imgData.data[idx + 1] = Math.floor(c * 0.95);
      imgData.data[idx + 2] = Math.floor(c * 0.9);
      imgData.data[idx + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// 3. Venus Texture
export function createVenusTexture(): THREE.CanvasTexture {
  const width = 512;
  const height = 256;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  const imgData = ctx.createImageData(width, height);
  const noise = new SimpleNoise(3003);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const u = x / width;
      const v = y / height;
      const shear = Math.sin(v * Math.PI * 4) * 0.2;
      const val = noise.fbm((u + shear) * 6.0, v * 8.0, 4);

      const idx = (y * width + x) * 4;
      imgData.data[idx] = Math.floor(220 + val * 30);
      imgData.data[idx + 1] = Math.floor(180 + val * 35);
      imgData.data[idx + 2] = Math.floor(120 + val * 30);
      imgData.data[idx + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// 4. Earth Texture
export function createEarthTexture(): THREE.CanvasTexture {
  const width = 1024;
  const height = 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  const imgData = ctx.createImageData(width, height);
  const noise = new SimpleNoise(4004);

  for (let y = 0; y < height; y++) {
    const lat = (y / height) * Math.PI - Math.PI / 2;
    const absLat = Math.abs(lat) / (Math.PI / 2);
    const cosLat = Math.cos(lat);

    for (let x = 0; x < width; x++) {
      const lon = (x / width) * Math.PI * 2;
      const nx = cosLat * Math.cos(lon);
      const ny = Math.sin(lat);
      const nz = cosLat * Math.sin(lon);

      const elevation = noise.fbm(nx * 2.8 + 4.0, ny * 2.8 + nz * 2.8 + 4.0, 6);
      const idx = (y * width + x) * 4;

      if (absLat > 0.85) {
        imgData.data[idx] = 245;
        imgData.data[idx + 1] = 250;
        imgData.data[idx + 2] = 255;
      } else if (elevation < 0.48) {
        const depth = elevation / 0.48;
        imgData.data[idx] = Math.floor(10 + depth * 20);
        imgData.data[idx + 1] = Math.floor(55 + depth * 60);
        imgData.data[idx + 2] = Math.floor(130 + depth * 90);
      } else {
        const land = (elevation - 0.48) / 0.52;
        if (land < 0.1) {
          imgData.data[idx] = 210;
          imgData.data[idx + 1] = 195;
          imgData.data[idx + 2] = 145;
        } else if (land < 0.6) {
          imgData.data[idx] = Math.floor(35 + land * 40);
          imgData.data[idx + 1] = Math.floor(120 + land * 30);
          imgData.data[idx + 2] = Math.floor(45 + land * 20);
        } else {
          imgData.data[idx] = Math.floor(130 + (land - 0.6) * 100);
          imgData.data[idx + 1] = Math.floor(115 + (land - 0.6) * 100);
          imgData.data[idx + 2] = Math.floor(95 + (land - 0.6) * 100);
        }
      }
      imgData.data[idx + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

// 5. Earth Clouds Texture
export function createEarthCloudTexture(): THREE.CanvasTexture {
  const width = 1024;
  const height = 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  const imgData = ctx.createImageData(width, height);
  const noise = new SimpleNoise(4554);

  for (let y = 0; y < height; y++) {
    const lat = (y / height) * Math.PI - Math.PI / 2;
    const cosLat = Math.cos(lat);

    for (let x = 0; x < width; x++) {
      const lon = (x / width) * Math.PI * 2;
      const nx = cosLat * Math.cos(lon);
      const ny = Math.sin(lat);
      const nz = cosLat * Math.sin(lon);

      const swirl = Math.sin(lat * 6.0) * 0.3;
      const density = noise.fbm(nx * 3.5 + swirl, ny * 3.5 + nz * 3.5, 5);
      const idx = (y * width + x) * 4;

      if (density > 0.52) {
        const alpha = Math.min(255, Math.floor(((density - 0.52) / 0.35) * 225));
        imgData.data[idx] = 255;
        imgData.data[idx + 1] = 255;
        imgData.data[idx + 2] = 255;
        imgData.data[idx + 3] = alpha;
      } else {
        imgData.data[idx] = 255;
        imgData.data[idx + 1] = 255;
        imgData.data[idx + 2] = 255;
        imgData.data[idx + 3] = 0;
      }
    }
  }
  ctx.putImageData(imgData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

// 6. Mars Texture
export function createMarsTexture(): THREE.CanvasTexture {
  const width = 512;
  const height = 256;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  const imgData = ctx.createImageData(width, height);
  const noise = new SimpleNoise(5005);

  for (let y = 0; y < height; y++) {
    const lat = (y / height) * Math.PI - Math.PI / 2;
    const absLat = Math.abs(lat) / (Math.PI / 2);

    for (let x = 0; x < width; x++) {
      const u = x / width;
      const v = y / height;
      const val = noise.fbm(u * 10.0, v * 10.0, 5);
      const idx = (y * width + x) * 4;

      if (absLat > 0.88) {
        imgData.data[idx] = 240;
        imgData.data[idx + 1] = 240;
        imgData.data[idx + 2] = 245;
      } else {
        imgData.data[idx] = Math.floor(180 + val * 45);
        imgData.data[idx + 1] = Math.floor(65 + val * 35);
        imgData.data[idx + 2] = Math.floor(25 + val * 25);
      }
      imgData.data[idx + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// 7. Jupiter Texture
export function createJupiterTexture(): THREE.CanvasTexture {
  const width = 1024;
  const height = 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  const imgData = ctx.createImageData(width, height);
  const noise = new SimpleNoise(6006);

  for (let y = 0; y < height; y++) {
    const v = y / height;
    const bandFrequency = Math.sin(v * Math.PI * 22.0) * 0.5 + 0.5;

    for (let x = 0; x < width; x++) {
      const u = x / width;
      const turbulence = noise.fbm(u * 16.0, v * 4.0, 4) * 0.25;
      const combined = Math.min(1, Math.max(0, bandFrequency + turbulence));

      const spotDistX = Math.abs(u - 0.65) * 6.0;
      const spotDistY = Math.abs(v - 0.68) * 12.0;
      const inSpot = Math.sqrt(spotDistX * spotDistX + spotDistY * spotDistY) < 0.4;

      const idx = (y * width + x) * 4;

      if (inSpot) {
        imgData.data[idx] = 205;
        imgData.data[idx + 1] = 65;
        imgData.data[idx + 2] = 40;
      } else {
        imgData.data[idx] = Math.floor(190 + combined * 45);
        imgData.data[idx + 1] = Math.floor(140 + combined * 35);
        imgData.data[idx + 2] = Math.floor(80 + combined * 40);
      }
      imgData.data[idx + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

// 8. Saturn Texture
export function createSaturnTexture(): THREE.CanvasTexture {
  const width = 512;
  const height = 256;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  const imgData = ctx.createImageData(width, height);
  const noise = new SimpleNoise(7007);

  for (let y = 0; y < height; y++) {
    const v = y / height;
    const band = Math.sin(v * Math.PI * 18.0) * 0.15;

    for (let x = 0; x < width; x++) {
      const u = x / width;
      const val = noise.fbm(u * 12.0, v * 3.0, 3) * 0.1;
      const factor = band + val;

      const idx = (y * width + x) * 4;
      imgData.data[idx] = Math.floor(225 + factor * 25);
      imgData.data[idx + 1] = Math.floor(190 + factor * 25);
      imgData.data[idx + 2] = Math.floor(135 + factor * 20);
      imgData.data[idx + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// 9. Saturn Ring Texture
export function createSaturnRingTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  const gradient = ctx.createLinearGradient(0, 0, 1024, 0);
  gradient.addColorStop(0.0, 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(0.08, 'rgba(180, 150, 110, 0.25)');
  gradient.addColorStop(0.22, 'rgba(215, 185, 140, 0.7)');
  gradient.addColorStop(0.42, 'rgba(235, 205, 155, 0.95)');
  gradient.addColorStop(0.58, 'rgba(240, 215, 165, 0.9)');
  gradient.addColorStop(0.62, 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(0.66, 'rgba(220, 190, 145, 0.85)');
  gradient.addColorStop(0.88, 'rgba(200, 175, 135, 0.6)');
  gradient.addColorStop(0.92, 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(0.96, 'rgba(180, 150, 115, 0.3)');
  gradient.addColorStop(1.0, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1024, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// 10. Uranus Texture
export function createUranusTexture(): THREE.CanvasTexture {
  const width = 512;
  const height = 256;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  const imgData = ctx.createImageData(width, height);
  const noise = new SimpleNoise(8008);

  for (let y = 0; y < height; y++) {
    const v = y / height;
    for (let x = 0; x < width; x++) {
      const u = x / width;
      const subtle = noise.fbm(u * 6.0, v * 2.0, 3) * 15;
      const idx = (y * width + x) * 4;

      imgData.data[idx] = Math.floor(135 + subtle);
      imgData.data[idx + 1] = Math.floor(205 + subtle * 0.8);
      imgData.data[idx + 2] = Math.floor(215 + subtle * 0.5);
      imgData.data[idx + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// 11. Neptune Texture
export function createNeptuneTexture(): THREE.CanvasTexture {
  const width = 512;
  const height = 256;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  const imgData = ctx.createImageData(width, height);
  const noise = new SimpleNoise(9009);

  for (let y = 0; y < height; y++) {
    const v = y / height;
    const band = Math.sin(v * Math.PI * 14.0) * 0.1;

    for (let x = 0; x < width; x++) {
      const u = x / width;
      const streak = noise.fbm(u * 16.0, v * 3.0, 4) * 0.15;
      const combined = band + streak;
      const idx = (y * width + x) * 4;

      imgData.data[idx] = Math.floor(35 + combined * 30);
      imgData.data[idx + 1] = Math.floor(75 + combined * 45);
      imgData.data[idx + 2] = Math.floor(190 + combined * 35);
      imgData.data[idx + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// 12. Generic Moon Texture
export function createMoonTexture(): THREE.CanvasTexture {
  const width = 256;
  const height = 128;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  const imgData = ctx.createImageData(width, height);
  const noise = new SimpleNoise(9999);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const u = x / width;
      const v = y / height;
      const val = noise.fbm(u * 12.0, v * 12.0, 4);
      const c = Math.floor(val * 120 + 90);

      const idx = (y * width + x) * 4;
      imgData.data[idx] = c;
      imgData.data[idx + 1] = c;
      imgData.data[idx + 2] = c;
      imgData.data[idx + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// 13. Pluto Texture (featuring Tombaugh Regio / Sputnik Planitia heart and tholin terrain)
export function createPlutoTexture(): THREE.CanvasTexture {
  const width = 512;
  const height = 256;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  const imgData = ctx.createImageData(width, height);
  const noise = new SimpleNoise(8888);

  for (let y = 0; y < height; y++) {
    const v = y / height;
    const lat = (v - 0.5) * Math.PI;

    for (let x = 0; x < width; x++) {
      const u = x / width;

      // Base terrain noise (cratered highlands and rolling tholin ridges)
      const baseNoise = noise.fbm(u * 14.0, v * 14.0, 5);
      const fineNoise = noise.noise2D(u * 28.0, v * 28.0);
      const mountainNoise = noise.fbm(u * 22.0, v * 22.0, 4);

      // Cthulhu Macula (dark equatorial tholin band)
      const eqDist = Math.abs(v - 0.56);
      const cthulhuU = Math.max(0, 1 - Math.abs(u - 0.28) / 0.15);
      const cthulhu = Math.max(0, 1 - eqDist / 0.12) * cthulhuU;

      // Tombaugh Regio (The Heart):
      // Left lobe: Sputnik Planitia (smooth, high-albedo nitrogen ice plain)
      const spDist = Math.hypot((u - 0.52) * 1.5, (v - 0.56) * 1.0);
      const sputnik = Math.max(0, 1 - spDist / 0.11);

      // Right lobe of the heart
      const erDist = Math.hypot((u - 0.61) * 1.4, (v - 0.53) * 1.1);
      const eastHeart = Math.max(0, 1 - erDist / 0.10);

      // Southern tip of the heart
      const tipDist = Math.hypot((u - 0.56) * 1.8, (v - 0.65) * 1.0);
      const heartTip = Math.max(0, 1 - tipDist / 0.08);

      const heart = Math.min(1, sputnik * 1.3 + eastHeart * 0.95 + heartTip * 0.85);

      // Polar frost caps
      const polarCap = Math.max(0, Math.abs(lat) - 1.05) / 0.52;

      // Color composition: Rich contrast between dark tholins and bright nitrogen ice
      let r = 162 + baseNoise * 50 - cthulhu * 85 + fineNoise * 15;
      let g = 115 + baseNoise * 35 - cthulhu * 75 + fineNoise * 10;
      let b = 85 + baseNoise * 25 - cthulhu * 65 + fineNoise * 10;

      // Water ice mountain ranges (Hillary & Norgay Montes)
      if (mountainNoise > 0.58) {
        const peak = (mountainNoise - 0.58) * 2.8;
        r += peak * 45;
        g += peak * 40;
        b += peak * 40;
      }

      // Heart / Sputnik Planitia: brilliant creamy white / pale ivory nitrogen frost
      if (heart > 0.01) {
        const hFactor = Math.pow(heart, 0.75);
        const cellNoise = noise.noise2D(u * 40.0, v * 40.0) * 0.08;
        const iceR = 250 + cellNoise * 5;
        const iceG = 240 + cellNoise * 5;
        const iceB = 228 + cellNoise * 10;

        r = r * (1 - hFactor) + iceR * hFactor;
        g = g * (1 - hFactor) + iceG * hFactor;
        b = b * (1 - hFactor) + iceB * hFactor;
      }

      // Polar methane caps
      if (polarCap > 0) {
        const frost = Math.min(1, polarCap * 0.85);
        r = r * (1 - frost) + 215 * frost;
        g = g * (1 - frost) + 205 * frost;
        b = b * (1 - frost) + 195 * frost;
      }

      const idx = (y * width + x) * 4;
      imgData.data[idx] = Math.min(255, Math.max(0, Math.floor(r)));
      imgData.data[idx + 1] = Math.min(255, Math.max(0, Math.floor(g)));
      imgData.data[idx + 2] = Math.min(255, Math.max(0, Math.floor(b)));
      imgData.data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// 14. Charon Texture (Pluto's moon with reddish Mordor Macula north polar cap)
export function createCharonTexture(): THREE.CanvasTexture {
  const width = 256;
  const height = 128;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  const imgData = ctx.createImageData(width, height);
  const noise = new SimpleNoise(7777);

  for (let y = 0; y < height; y++) {
    const v = y / height;
    const isNorthPole = Math.max(0, 1 - v / 0.35); // Dark reddish Mordor Macula
    for (let x = 0; x < width; x++) {
      const u = x / width;
      const n = noise.fbm(u * 12.0, v * 12.0, 4);
      const chasm = Math.abs(Math.sin(v * Math.PI * 2 + u * 5)) < 0.08 ? 30 : 0;

      let baseGrey = Math.floor(n * 75 + 115 - chasm);
      let r = baseGrey;
      let g = baseGrey - 4;
      let b = baseGrey - 8;

      if (isNorthPole > 0) {
        const mordor = isNorthPole * (0.8 + noise.noise2D(u * 10, v * 10) * 0.2);
        r = Math.floor(r * (1 - mordor) + 155 * mordor);
        g = Math.floor(g * (1 - mordor) + 72 * mordor);
        b = Math.floor(b * (1 - mordor) + 52 * mordor);
      }

      const idx = (y * width + x) * 4;
      imgData.data[idx] = Math.min(255, Math.max(0, r));
      imgData.data[idx + 1] = Math.min(255, Math.max(0, g));
      imgData.data[idx + 2] = Math.min(255, Math.max(0, b));
      imgData.data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}
