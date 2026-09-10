import * as THREE from 'three'
import {
  ORBIT,
  PARTICLE_SPHERE,
} from '../config/categorySpaceConfig'

function createParticleSphere(
  color,
  category,
  particleTexture
) {
  const positions =
    new Float32Array(
      PARTICLE_SPHERE.particleCount * 3
    )

  for (
    let i = 0;
    i < PARTICLE_SPHERE.particleCount;
    i += 1
  ) {
    const theta =
      Math.random() *
      Math.PI *
      2

    const phi =
      Math.acos(
        2 * Math.random() - 1
      )

    const sinPhi =
      Math.sin(phi)

    const index =
      i * 3

    positions[index] =
      PARTICLE_SPHERE.radius *
      sinPhi *
      Math.cos(theta)

    positions[index + 1] =
      PARTICLE_SPHERE.radius *
      Math.cos(phi)

    positions[index + 2] =
      PARTICLE_SPHERE.radius *
      sinPhi *
      Math.sin(theta)
  }

  const geometry =
    new THREE.BufferGeometry()

  geometry.setAttribute(
    'position',
    new THREE.BufferAttribute(
      positions,
      3
    )
  )

  const material =
    new THREE.PointsMaterial({
      color,
      size:
        PARTICLE_SPHERE.size,
      transparent: true,
      opacity:
        PARTICLE_SPHERE.opacity,
      map: particleTexture,
      alphaTest: 0.01,
      depthWrite: false,
      blending:
        THREE.AdditiveBlending,
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

  return sphere
}

export default createParticleSphere