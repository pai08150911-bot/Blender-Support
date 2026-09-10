import * as THREE from 'three'
import {
  SPACE,
} from './categorySpaceConfig'

function createStarField(
  particleTexture
) {
  const geometry =
    new THREE.BufferGeometry()

  const positions =
    new Float32Array(
      SPACE.starCount * 3
    )

  for (
    let i = 0;
    i < SPACE.starCount * 3;
    i += 3
  ) {
    positions[i] =
      (Math.random() - 0.5) *
      SPACE.starDepth

    positions[i + 1] =
      (Math.random() - 0.5) *
      SPACE.starDepth

    positions[i + 2] =
      (Math.random() - 0.5) *
      SPACE.starDepth
  }

  geometry.setAttribute(
    'position',
    new THREE.BufferAttribute(
      positions,
      3
    )
  )

  const material =
    new THREE.PointsMaterial({
      size: SPACE.starSize,
      color: SPACE.starColor,
      transparent: true,
      opacity: 0.8,
      map: particleTexture,
      alphaTest: 0.01,
      depthWrite: false,
    })

  const stars =
    new THREE.Points(
      geometry,
      material
    )

  return {
    stars,
    geometry,
    material,
  }
}

export default createStarField