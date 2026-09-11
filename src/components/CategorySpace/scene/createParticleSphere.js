import * as THREE from 'three'

import {
  ORBIT,
  PARTICLE_SPHERE,
} from '../config/categorySpaceConfig'

import CATEGORY_PLANET_STYLES
  from '../config/categoryPlanetStyles'

import createPlanetParticleData
  from './createPlanetParticleData'

function createFallbackStyle(
  color
) {
  return {
    type: 'default',

    palette: [
      color,
      '#ffffff',
    ],

    bodyCount:
      PARTICLE_SPHERE.particleCount,

    radiusScale: 1,

    surfaceNoise: 0.03,

    particleSize: 1,

    opacity:
      PARTICLE_SPHERE.opacity,

    yScale: 1,

    motion: {
      rotationY: 0.1,

      rotationX: 0,

      sparkleAmplitude: 0.4,

      sparkleSpeed: 3,
    },
  }
}

export default function createParticleSphere(
  color,
  category,
  particleTexture
) {
  const style =
    CATEGORY_PLANET_STYLES[
      category
    ] ??
    createFallbackStyle(
      color
    )

  const {
    positions,
    colors,
    particleCount,
  } =
    createPlanetParticleData(
      style
    )

  const geometry =
    new THREE.BufferGeometry()

  geometry.setAttribute(
    'position',
    new THREE.BufferAttribute(
      positions,
      3
    )
  )

  geometry.setAttribute(
    'color',
    new THREE.BufferAttribute(
      colors,
      3
    )
  )

  geometry.computeBoundingSphere()

  const baseSize =
    PARTICLE_SPHERE.size *
    (
      style.particleSize ??
      1
    )

  const baseOpacity =
    style.opacity ??
    PARTICLE_SPHERE.opacity

  const material =
    new THREE.PointsMaterial({
      size:
        baseSize,

      vertexColors:
        true,

      transparent:
        true,

      opacity:
        baseOpacity,

      map:
        particleTexture,

      alphaTest:
        0.01,

      depthWrite:
        false,

      blending:
        THREE.AdditiveBlending,

      sizeAttenuation:
        true,
    })

  const sphere =
    new THREE.Points(
      geometry,
      material
    )

  sphere.scale.setScalar(
    ORBIT.objectScale
  )

  sphere.userData.category =
    category

  sphere.userData.planetType =
    style.type

  const colorAttribute =
    geometry.getAttribute(
      'color'
    )

  const colorArray =
    colorAttribute.array

  const baseColors =
    new Float32Array(
      colorArray
    )

  const sparkleIndices = []

  const sparkleStep =
    Math.max(
      1,
      Math.floor(
        particleCount /
        72
      )
    )

  for (
    let index = 0;
    index < particleCount;
    index += sparkleStep
  ) {
    sparkleIndices.push(
      index
    )
  }

  let animationElapsed =
    0

  let sparkleActive =
    false

  const restoreSparkles =
    () => {
      if (
        !sparkleActive
      ) {
        return
      }

      colorArray.set(
        baseColors
      )

      colorAttribute.needsUpdate =
        true

      sparkleActive =
        false
    }

  sphere.userData.updateFocusAnimation =
    (
      deltaMilliseconds,
      focused,
      performanceMode
    ) => {
      if (
        !focused ||
        performanceMode
      ) {
        restoreSparkles()

        material.size =
          baseSize

        return
      }

      const deltaSeconds =
        Math.min(
          deltaMilliseconds,
          50
        ) /
        1000

      animationElapsed +=
        deltaSeconds

      const motion =
        style.motion

      sphere.rotation.y +=
        motion.rotationY *
        deltaSeconds

      sphere.rotation.x +=
        motion.rotationX *
        deltaSeconds

      const sparkleSpeed =
        motion.sparkleSpeed

      const sparkleAmplitude =
        motion.sparkleAmplitude

      sparkleIndices.forEach(
        (
          particleIndex,
          sparkleIndex
        ) => {
          const offset =
            particleIndex *
            3

          const wave =
            Math.max(
              0,
              Math.sin(
                animationElapsed *
                  sparkleSpeed +
                sparkleIndex *
                  1.618
              )
            )

          const brightness =
            1 +
            wave *
              sparkleAmplitude

          colorArray[
            offset
          ] =
            Math.min(
              1,
              baseColors[
                offset
              ] *
                brightness
            )

          colorArray[
            offset +
            1
          ] =
            Math.min(
              1,
              baseColors[
                offset +
                1
              ] *
                brightness
            )

          colorArray[
            offset +
            2
          ] =
            Math.min(
              1,
              baseColors[
                offset +
                2
              ] *
                brightness
            )
        }
      )

      colorAttribute.needsUpdate =
        true

      sparkleActive =
        true
    }

  return sphere
}