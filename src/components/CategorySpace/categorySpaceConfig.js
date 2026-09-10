import * as THREE from 'three'

export const SPACE = {
  starCount: 1500,
  starSize: 0.06,
  starColor: 0xffffff,
  starDepth: 30,

  moveX: 0.15,
  moveY: 0.1,

  rotationSpeed: 0.0007,
  twinkleSpeed: 0.002,
}

export const ORBIT = {
  radius: 3.3,

  tilt: THREE.MathUtils.degToRad(8),

  dragSensitivity: 0.004,
  maxDragStep: 0.06,

  objectScale: 0.3,

  snapSpeed: 0.08,

  pauseDuration: 2000,

  centerThreshold:
    THREE.MathUtils.degToRad(8),

  frontCategoryCount: 3,
}

export const CAMERA = {
  normalY: 0,
  normalZ: 6,

  introZ: 2.3,

  topY: 2.4,
  topZ: 5.5,

  focusY: 0,
  focusZ: 4.5,

  transitionSpeed: 0.08,
}

export const CONNECTION = {
  particleCount: 100,
  particleSizeMin: 0.1,
  particleSizeMax: 0.15,
  opacityMin: 0.5,
  opacityMax: 1,

  layerOffsets: [
    -0.055,
    0,
    0.055,
  ],
}

export const PARTICLE_SPHERE = {
  particleCount: 900,
  radius: 1,
  size: 0.03,
  opacity: 0.9,
}