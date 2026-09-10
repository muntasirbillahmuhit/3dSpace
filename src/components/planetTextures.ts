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

      imgData.data[idx] = Math.min(255, Math.floor(255 * (0.85 + heat * 0.15)));
      imgData.data[idx + 1] = Math.min(255, Math.floor(180 + heat * 70));
      imgData.data[idx + 2] = Math.min(255, Math.floor(40 + heat * 60));
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
