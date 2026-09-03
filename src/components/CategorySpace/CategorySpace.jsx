import { useEffect, useRef } from 'react'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from 'three'
import createParticleEarth from './ParticleEarth'

const SPACE = {
  starCount: 1500,
  starSize: 0.06,
  starColor: 0xffffff,
  starDepth: 30,

  moveX: 0.15,
  moveY: 0.1,

  rotationSpeed: 0.0007,
  twinkleSpeed: 0.002,
}

const ORBIT = {
  radius: 3.3,

  tilt: THREE.MathUtils.degToRad(8),

  dragSensitivity: 0.004,
  maxDragStep: 0.06,

  objectScale: 0.3,

  snapSpeed: 0.08,

  pauseDuration: 2000,
}

const CAMERA = {
  normalY: 0,
  normalZ: 6,

  introZ: 2.3,

  topY: 2.4,
  topZ: 5.5,

  transitionSpeed: 0.08,
}

const CONNECTION = {
  particleCount: 100,
  particleSizeMin: 0.10,
  particleSizeMax: 0.15,
  opacityMin: 0.5,
  opacityMax: 1.0,

  layerOffsets: [
    -0.055,
    0,
    0.055,
  ],
}

const CATEGORIES = [
  {
    name: 'MATERIAL',
    path: '/models/material.glb',
  },
  {
    name: 'SCULPT',
    path: '/models/sculpt.glb',
  },
  {
    name: 'SHADER',
    path: '/models/shader.glb',
  },
  {
    name: 'MODIFIER',
    path: '/models/modifier.glb',
  },
  {
    name: 'ANIMATION',
    path: '/models/animation.glb',
  },
  {
    name: 'TEXTURE',
    path: '/models/texture.glb',
  },
  {
    name: 'LIGHTING',
    path: '/models/lighting.glb',
  },
]

const FALLBACK_PATH = '/models/material.glb'

function CategorySpace() {
  const containerRef = useRef(null)
  const logoRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(
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

    camera.lookAt(0, 0, 0)

    const renderer =
      new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      })

    renderer.setSize(
      container.clientWidth,
      container.clientHeight
    )

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 2)
    )

    renderer.domElement.style.touchAction =
      'none'

    renderer.domElement.style.cursor =
      'grab'

    container.appendChild(
      renderer.domElement
    )

    // Lights
    const ambientLight =
      new THREE.AmbientLight(
        0xffffff,
        1.2
      )

    scene.add(ambientLight)

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

    scene.add(keyLight)

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

    scene.add(fillLight)

    // Particle texture
    const particleTexture =
      new THREE.TextureLoader().load(
        'data:image/svg+xml,' +
          encodeURIComponent(`
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
            >
              <circle
                cx="32"
                cy="32"
                r="30"
                fill="white"
              />
            </svg>
          `)
      )

    // Stars
    const starGeometry =
      new THREE.BufferGeometry()

    const starPositions =
      new Float32Array(
        SPACE.starCount * 3
      )

    for (
      let i = 0;
      i < SPACE.starCount * 3;
      i += 3
    ) {
      starPositions[i] =
        (Math.random() - 0.5) *
        SPACE.starDepth

      starPositions[i + 1] =
        (Math.random() - 0.5) *
        SPACE.starDepth

      starPositions[i + 2] =
        (Math.random() - 0.5) *
        SPACE.starDepth
    }

    starGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(
        starPositions,
        3
      )
    )

    const starMaterial =
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
        starGeometry,
        starMaterial
      )

    scene.add(stars)

    // Earth
    const earth =
      createParticleEarth()

    scene.add(earth)

    // Orbit group
    const orbitGroup =
      new THREE.Group()

    orbitGroup.rotation.x =
      ORBIT.tilt

    scene.add(orbitGroup)

    // Particle ring
    const ringGeometries = []
    const ringMaterials = []

    const particleColors = [
      new THREE.Color(0xffffff),
      new THREE.Color(0xd8edff),
      new THREE.Color(0x8ec5ff),
      new THREE.Color(0x63b4f5),
    ]

    CONNECTION.layerOffsets.forEach(
      (radiusOffset, layerIndex) => {
        const ringGeometry =
          new THREE.BufferGeometry()

        const ringPositions = []
        const ringSizes = []
        const ringOpacities = []
        const ringColors = []

        for (
          let categoryIndex = 0;
          categoryIndex < CATEGORIES.length;
          categoryIndex += 1
        ) {
          const startAngle =
            (categoryIndex /
              CATEGORIES.length) *
            Math.PI *
            2

          const endAngle =
            ((categoryIndex + 1) /
              CATEGORIES.length) *
            Math.PI *
            2

          for (
            let particleIndex = 0;
            particleIndex <
            CONNECTION.particleCount;
            particleIndex += 1
          ) {
            const progress =
              (particleIndex + 1) /
              (CONNECTION.particleCount + 1)

            const angle =
              THREE.MathUtils.lerp(
                startAngle,
                endAngle,
                progress
              )

            const radius =
              ORBIT.radius +
              radiusOffset

            ringPositions.push(
              Math.cos(angle) *
                radius,
              0,
              Math.sin(angle) *
                radius
            )

            ringSizes.push(
              THREE.MathUtils.randFloat(
                CONNECTION.particleSizeMin,
                CONNECTION.particleSizeMax
              )
            )

            const layerOpacity =
              layerIndex === 1
                ? 1
                : 0.85

            ringOpacities.push(
              THREE.MathUtils.randFloat(
                CONNECTION.opacityMin,
                CONNECTION.opacityMax
              ) *
                layerOpacity
            )

            const color =
              THREE.MathUtils.randInt(
                0,
                particleColors.length - 1
              )

            ringColors.push(
              particleColors[color].r,
              particleColors[color].g,
              particleColors[color].b
            )
          }
        }

        ringGeometry.setAttribute(
          'position',
          new THREE.Float32BufferAttribute(
            ringPositions,
            3
          )
        )

        ringGeometry.setAttribute(
          'aSize',
          new THREE.Float32BufferAttribute(
            ringSizes,
            1
          )
        )

        ringGeometry.setAttribute(
          'aOpacity',
          new THREE.Float32BufferAttribute(
            ringOpacities,
            1
          )
        )

        ringGeometry.setAttribute(
          'aColor',
          new THREE.Float32BufferAttribute(
            ringColors,
            3
          )
        )

        const ringMaterial =
          new THREE.ShaderMaterial({
            uniforms: {
              uTexture: {
                value: particleTexture,
              },
            },

            vertexShader: `
              attribute float aSize;
              attribute float aOpacity;
              attribute vec3 aColor;

              varying float vOpacity;
              varying vec3 vColor;

              void main() {
                vOpacity = aOpacity;
                vColor = aColor;

                vec4 modelPosition =
                  modelViewMatrix *
                  vec4(position, 1.0);

                gl_Position =
                  projectionMatrix *
                  modelPosition;

                gl_PointSize =
                  aSize *
                  100.0 /
                  -modelPosition.z;
              }
            `,

            fragmentShader: `
              uniform sampler2D uTexture;

              varying float vOpacity;
              varying vec3 vColor;

              void main() {
                vec4 textureColor =
                  texture2D(
                    uTexture,
                    gl_PointCoord
                  );

                if (
                  textureColor.a <
                  0.01
                ) {
                  discard;
                }

                float distance =
                  length(
                    gl_PointCoord -
                    vec2(0.5)
                  );

                float glow =
                  1.0 -
                  smoothstep(
                    0.15,
                    0.5,
                    distance
                  );

                gl_FragColor =
                  vec4(
                    vColor,
                    textureColor.a *
                    vOpacity *
                    (0.8 + glow * 0.2)
                  );
              }
            `,

            transparent: true,
            depthWrite: false,
            blending:
              THREE.AdditiveBlending,
          })

        const ring =
          new THREE.Points(
            ringGeometry,
            ringMaterial
          )

        orbitGroup.add(ring)

        ringGeometries.push(
          ringGeometry
        )

        ringMaterials.push(
          ringMaterial
        )
      }
    )

    // Category positions
    const categoryPositions =
      CATEGORIES.map((_, index) => {
        const angle =
          (index /
            CATEGORIES.length) *
          Math.PI *
          2

        return new THREE.Vector3(
          Math.cos(angle) *
            ORBIT.radius,
          0,
          Math.sin(angle) *
            ORBIT.radius
        )
      })

    // Category objects
    const loader =
      new GLTFLoader()

    const categoryObjects = []

    const loadModel = (
      path,
      position,
      category
    ) => {
      loader.load(
        path,
        (gltf) => {
          const object =
            gltf.scene

          object.position.copy(
            position
          )

          object.scale.setScalar(
            ORBIT.objectScale
          )

          object.userData.category =
            category

          orbitGroup.add(
            object
          )

          categoryObjects.push(
            object
          )
        },
        undefined,
        () => {
          if (
            path === FALLBACK_PATH
          ) {
            return
          }

          loadModel(
            FALLBACK_PATH,
            position,
            category
          )
        }
      )
    }

    CATEGORIES.forEach(
      (category, index) => {
        loadModel(
          category.path,
          categoryPositions[index],
          category.name
        )
      }
    )

    // Interaction
    const mouse = {
      x: 0,
      y: 0,
    }

    const pointer =
      new THREE.Vector2()

    const raycaster =
      new THREE.Raycaster()

    const drag = {
      active: false,
      previousX: 0,
    }

    const snap = {
      active: false,
      targetRotation: 0,
      categoryIndex: 0,
    }

    let hoveredCategory = null
    let pausedUntil = 0

    const getCategoryRotation = (
      index
    ) => {
      const angle =
        (index /
          CATEGORIES.length) *
        Math.PI *
        2

      return (
        angle -
        Math.PI / 2
      )
    }

    const normalizeAngle = (
      angle
    ) => {
      while (
        angle > Math.PI
      ) {
        angle -=
          Math.PI * 2
      }

      while (
        angle < -Math.PI
      ) {
        angle +=
          Math.PI * 2
      }

      return angle
    }

    const findNearestCategory = () => {
      let nearestIndex = 0
      let nearestDistance =
        Infinity

      categoryPositions.forEach(
        (position, index) => {
          const angle =
            Math.atan2(
              position.z,
              position.x
            )

          const target =
            getCategoryRotation(
              index
            )

          const distance =
            Math.abs(
              normalizeAngle(
                target -
                  orbitGroup.rotation.y
              )
            )

          if (
            distance <
            nearestDistance
          ) {
            nearestDistance =
              distance

            nearestIndex =
              index
          }
        }
      )

      return nearestIndex
    }

    const startSnap = () => {
      const index =
        findNearestCategory()

      let target =
        getCategoryRotation(
          index
        )

      const current =
        orbitGroup.rotation.y

      target =
        current +
        normalizeAngle(
          target - current
        )

      snap.targetRotation =
        target

      snap.categoryIndex =
        index

      snap.active = true
    }

    const handlePointerDown = (
      event
    ) => {
      drag.active = true

      drag.previousX =
        event.clientX

      snap.active = false
      pausedUntil = 0

      renderer.domElement.style.cursor =
        'grabbing'

      renderer.domElement.setPointerCapture(
        event.pointerId
      )
    }

    const handlePointerMove = (
      event
    ) => {
      mouse.x =
        (event.clientX /
          window.innerWidth) *
          2 -
        1

      mouse.y =
        (event.clientY /
          window.innerHeight) *
          2 -
        1

      pointer.x =
        (event.clientX /
          renderer.domElement.clientWidth) *
          2 -
        1

      pointer.y =
        -(event.clientY /
          renderer.domElement.clientHeight) *
          2 +
        1

      raycaster.setFromCamera(
        pointer,
        camera
      )

      const intersections =
        raycaster.intersectObjects(
          categoryObjects,
          true
        )

      let selectedCategory = null

      if (
        intersections.length > 0
      ) {
        let current =
          intersections[0].object

        while (
          current &&
          !current.userData.category
        ) {
          current =
            current.parent
        }

        selectedCategory =
          current
      }

      if (
        selectedCategory &&
        selectedCategory !==
          hoveredCategory
      ) {
        hoveredCategory =
          selectedCategory

        pausedUntil =
          Date.now() +
          ORBIT.pauseDuration
      }

      if (
        !selectedCategory
      ) {
        hoveredCategory =
          null
      }

      if (!drag.active) {
        return
      }

      const deltaX =
        event.clientX -
        drag.previousX

      const rotation =
        THREE.MathUtils.clamp(
          deltaX *
            ORBIT.dragSensitivity,
          -ORBIT.maxDragStep,
          ORBIT.maxDragStep
        )

      orbitGroup.rotation.y +=
        rotation

      drag.previousX =
        event.clientX
    }

    const handlePointerUp = (
      event
    ) => {
      drag.active = false

      renderer.domElement.style.cursor =
        'grab'

      renderer.domElement.releasePointerCapture(
        event.pointerId
      )

      startSnap()
    }

    renderer.domElement.addEventListener(
      'pointerdown',
      handlePointerDown
    )

    renderer.domElement.addEventListener(
      'pointermove',
      handlePointerMove
    )

    renderer.domElement.addEventListener(
      'pointerup',
      handlePointerUp
    )

    // Animation
    const clock =
      new THREE.Clock()

    const animate = () => {
      const elapsedTime =
        clock.getElapsedTime()

      // Stars
      stars.position.x =
        mouse.x *
        SPACE.moveX

      stars.position.y =
        -mouse.y *
        SPACE.moveY

      stars.rotation.y =
        elapsedTime *
        SPACE.rotationSpeed

      starMaterial.opacity =
        0.65 +
        Math.sin(
          elapsedTime *
            SPACE.twinkleSpeed *
            1000
        ) *
          0.15

      // Earth
      const earthProgress =
        earth.material.uniforms
          .uProgress.value

      const isLoading =
        earthProgress < 1

      // Logo appearance
      if (
        logoRef.current &&
        earthProgress >= 0.65
      ) {
        logoRef.current.classList.remove(
          'opacity-0'
        )

        logoRef.current.classList.add(
          'opacity-100'
        )
      }

      // Camera
      if (isLoading) {
        const introProgress =
          THREE.MathUtils.smoothstep(
            earthProgress,
            0,
            1
          )

        const cameraTargetZ =
          THREE.MathUtils.lerp(
            CAMERA.introZ,
            CAMERA.normalZ,
            introProgress
          )

        camera.position.y =
          THREE.MathUtils.lerp(
            camera.position.y,
            CAMERA.normalY,
            CAMERA.transitionSpeed
          )

        camera.position.z =
          THREE.MathUtils.lerp(
            camera.position.z,
            cameraTargetZ,
            CAMERA.transitionSpeed
          )
      } else {
        const topAmount =
          Math.max(
            0,
            mouse.y
          )

        const cameraTargetY =
          drag.active
            ? topAmount *
              CAMERA.topY
            : CAMERA.normalY

        const cameraTargetZ =
          drag.active
            ? CAMERA.normalZ -
              topAmount *
                (CAMERA.normalZ -
                  CAMERA.topZ)
            : CAMERA.normalZ

        camera.position.y =
          THREE.MathUtils.lerp(
            camera.position.y,
            cameraTargetY,
            CAMERA.transitionSpeed
          )

        camera.position.z =
          THREE.MathUtils.lerp(
            camera.position.z,
            cameraTargetZ,
            CAMERA.transitionSpeed
          )

        // Logo transparency
        if (
          logoRef.current &&
          earthProgress >= 0.65
        ) {
          const logoOpacity =
            drag.active &&
            mouse.y > 0
              ? '0.45'
              : '1'

          logoRef.current.style.opacity =
            logoOpacity
        }
      }

      camera.lookAt(
        0,
        0,
        0
      )

      // Snap
      if (snap.active) {
        const difference =
          snap.targetRotation -
          orbitGroup.rotation.y

        orbitGroup.rotation.y +=
          difference *
          ORBIT.snapSpeed

        if (
          Math.abs(difference) <
          0.001
        ) {
          orbitGroup.rotation.y =
            snap.targetRotation

          snap.active = false

          pausedUntil =
            Date.now() +
            ORBIT.pauseDuration
        }
      }

      // Automatic rotation
      if (
        !drag.active &&
        !snap.active &&
        Date.now() >= pausedUntil
      ) {
        orbitGroup.rotation.y +=
          SPACE.rotationSpeed
      }

      renderer.render(
        scene,
        camera
      )
    }

    renderer.setAnimationLoop(
      animate
    )

    // Resize
    const handleResize = () => {
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
    }

    window.addEventListener(
      'resize',
      handleResize
    )

    // Cleanup
    return () => {
      window.removeEventListener(
        'resize',
        handleResize
      )

      renderer.domElement.removeEventListener(
        'pointerdown',
        handlePointerDown
      )

      renderer.domElement.removeEventListener(
        'pointermove',
        handlePointerMove
      )

      renderer.domElement.removeEventListener(
        'pointerup',
        handlePointerUp
      )

      renderer.setAnimationLoop(
        null
      )

      categoryObjects.forEach(
        (object) => {
          object.traverse(
            (child) => {
              if (child.geometry) {
                child.geometry.dispose()
              }

              if (child.material) {
                const materials =
                  Array.isArray(
                    child.material
                  )
                    ? child.material
                    : [child.material]

                materials.forEach(
                  (material) => {
                    material.dispose()
                  }
                )
              }
            }
          )
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
  }, [])

  return (
    <div
      ref={containerRef}
      className="category-space"
    >
      <img
        ref={logoRef}
        src="/logo.png"
        alt="IDEA 3D"
        className="pointer-events-none fixed left-1/2 top-3 z-10 w-56 -translate-x-1/2 select-none opacity-0 transition-opacity duration-500 sm:top-4 sm:w-72 md:top-5 md:w-80 lg:top-6 lg:w-96 xl:w-[28rem]"
      />
    </div>
  )
}

export default CategorySpace