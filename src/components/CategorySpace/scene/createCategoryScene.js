import * as THREE from 'three'

import createParticleEarth
  from './ParticleEarth'

import createParticleTexture
  from './createParticleTexture'

import createParticleSphere
  from './createParticleSphere'

import createStarField
  from './createStarField'

import createOrbitRing
  from './createOrbitRing'

import {
  ORBIT,
  CAMERA,
} from '../config/categorySpaceConfig'

import {
  CATEGORIES,
} from '../config/categoryData'

export default function createCategoryScene({
  container,
  performanceMode,
}) {
  const scene =
    new THREE.Scene()

  const camera =
    new THREE.PerspectiveCamera(
      60,
      container.clientWidth /
        container.clientHeight,
      0.1,
      1000
    )

  camera.position.set(
    0,
    CAMERA.normalY,
    CAMERA.introZ
  )

  camera.lookAt(
    0,
    0,
    0
  )

  const renderer =
    new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    })

  renderer.setSize(
    container.clientWidth,
    container.clientHeight
  )

  const setRendererPixelRatio =
    (
      nextPerformanceMode
    ) => {
      renderer.setPixelRatio(
        nextPerformanceMode
          ? 1
          : Math.min(
              window.devicePixelRatio,
              2
            )
      )

      renderer.setSize(
        container.clientWidth,
        container.clientHeight
      )
    }

  setRendererPixelRatio(
    performanceMode
  )

  renderer.domElement.style.touchAction =
    'none'

  renderer.domElement.style.cursor =
    'grab'

  container.appendChild(
    renderer.domElement
  )

  const ambientLight =
    new THREE.AmbientLight(
      0xffffff,
      1.2
    )

  scene.add(
    ambientLight
  )

  const keyLight =
    new THREE.DirectionalLight(
      0xffffff,
      3
    )

  keyLight.position.set(
    3,
    4,
    5
  )

  scene.add(
    keyLight
  )

  const fillLight =
    new THREE.PointLight(
      0x8ec5ff,
      15,
      10
    )

  fillLight.position.set(
    -3,
    1,
    3
  )

  scene.add(
    fillLight
  )

  const particleTexture =
    createParticleTexture()

  const {
    stars,
    geometry:
      starGeometry,
    material:
      starMaterial,
  } =
    createStarField(
      particleTexture
    )

  scene.add(
    stars
  )

  const earth =
    createParticleEarth()

  scene.add(
    earth
  )

  const orbitGroup =
    new THREE.Group()

  orbitGroup.rotation.x =
    ORBIT.tilt

  scene.add(
    orbitGroup
  )

  const {
    ringGeometries,
    ringMaterials,
  } =
    createOrbitRing(
      orbitGroup,
      particleTexture
    )

  const categoryPositions =
    CATEGORIES.map(
      (_, index) => {
        const angle =
          (
            index /
            CATEGORIES.length
          ) *
          Math.PI *
          2

        return new THREE.Vector3(
          Math.cos(angle) *
            ORBIT.radius,
          0,
          Math.sin(angle) *
            ORBIT.radius
        )
      }
    )

  const categoryObjects =
    []

  CATEGORIES.forEach(
    (
      category,
      index
    ) => {
      const object =
        createParticleSphere(
          category.color,
          category.name,
          particleTexture
        )

      object.position.copy(
        categoryPositions[
          index
        ]
      )

      orbitGroup.add(
        object
      )

      categoryObjects.push(
        object
      )
    }
  )

  const resize =
    (
      nextPerformanceMode
    ) => {
      const width =
        container.clientWidth

      const height =
        container.clientHeight

      camera.aspect =
        width / height

      camera.updateProjectionMatrix()

      renderer.setSize(
        width,
        height
      )

      setRendererPixelRatio(
        nextPerformanceMode
      )
    }

  const dispose =
    () => {
      categoryObjects.forEach(
        (object) => {
          object.geometry.dispose()
          object.material.dispose()
        }
      )

      ringGeometries.forEach(
        (geometry) => {
          geometry.dispose()
        }
      )

      ringMaterials.forEach(
        (material) => {
          material.dispose()
        }
      )

      starGeometry.dispose()
      starMaterial.dispose()

      earth.userData.dispose()

      particleTexture.dispose()

      renderer.dispose()

      if (
        container.contains(
          renderer.domElement
        )
      ) {
        container.removeChild(
          renderer.domElement
        )
      }
    }

  return {
    scene,
    camera,
    renderer,

    stars,
    starMaterial,

    earth,

    orbitGroup,

    ringMaterials,

    categoryObjects,

    setRendererPixelRatio,
    resize,
    dispose,
  }
}