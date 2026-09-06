import {
  useEffect,
  useRef,
} from 'react'
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

  centerThreshold:
    THREE.MathUtils.degToRad(8),

  frontCategoryCount: 3,
}

const CAMERA = {
  normalY: 0,
  normalZ: 6,

  introZ: 2.3,

  topY: 2.4,
  topZ: 5.5,

  focusY: 0,
  focusZ: 4.5,

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

const PARTICLE_SPHERE = {
  particleCount: 900,
  radius: 1,
  size: 0.03,
  opacity: 0.9,
}

const CATEGORIES = [
  {
    name: 'MATERIAL',
    color: '#FF3B30',
    description:
      'マテリアルの基礎から、質感を表現するための設定まで学びます。',
    image: '/images/material.jpg',
    link: '/material',
  },
  {
    name: 'SCULPT',
    color: '#ffe838',
    description:
      'スカルプトを使って、モデルの形状を細かく作り込みます。',
    image: '/images/sculpt.jpg',
    link: '/sculpt',
  },
  {
    name: 'SHADER',
    color: '#FF6A00',
    description:
      'シェーダーを使って、光や質感を自由に表現します。',
    image: '/images/shader.jpg',
    link: '/shader',
  },
  {
    name: 'MODIFIER',
    color: '#34C759',
    description:
      'モディファイアを使って、モデルを効率的に加工します。',
    image: '/images/modifier.jpg',
    link: '/modifier',
  },
  {
    name: 'ANIMATION',
    color: '#007AFF',
    description:
      'アニメーションの基本から、オブジェクトを動かす方法まで学びます。',
    image: '/images/animation.jpg',
    link: '/animation',
  },
  {
    name: 'TEXTURE',
    color: '#5856D6',
    description:
      'テクスチャを使って、モデルに細かな表現を加えます。',
    image: '/images/texture.jpg',
    link: '/texture',
  },
  {
    name: 'LIGHTING',
    color: '#AF52DE',
    description:
      'ライティングを使って、シーン全体の雰囲気を作ります。',
    image: '/images/lighting.jpg',
    link: '/lighting',
  },
]

function createParticleSphere(
  color,
  category
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

  const material =
    new THREE.PointsMaterial({
      color,
      size: PARTICLE_SPHERE.size,
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

function CategorySpace() {
  const containerRef =
    useRef(null)

  const hologramRef =
    useRef(null)

  const infoRef =
    useRef(null)

  const imageRef =
    useRef(null)

  const buttonRef =
    useRef(null)

  useEffect(() => {
    const container =
      containerRef.current

    const hologram =
      hologramRef.current

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

    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio,
        2
      )
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

    const earth =
      createParticleEarth()

    scene.add(earth)

    const orbitGroup =
      new THREE.Group()

    orbitGroup.rotation.x =
      ORBIT.tilt

    scene.add(
      orbitGroup
    )

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
          categoryIndex <
          CATEGORIES.length;
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
                value:
                  particleTexture,
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

        orbitGroup.add(
          ring
        )

        ringGeometries.push(
          ringGeometry
        )

        ringMaterials.push(
          ringMaterial
        )
      }
    )

    const categoryPositions =
      CATEGORIES.map(
        (_, index) => {
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
        }
      )

    const categoryObjects = []

    CATEGORIES.forEach(
      (category, index) => {
        const object =
          createParticleSphere(
            category.color,
            category.name
          )

        object.position.copy(
          categoryPositions[index]
        )

        orbitGroup.add(
          object
        )

        categoryObjects.push(
          object
        )
      }
    )

    const mouse = {
      x: 0,
      y: 0,
    }

    const pointer =
      new THREE.Vector2()

    const raycaster =
      new THREE.Raycaster()

    raycaster.params.Points.threshold =
      0.15

    const drag = {
      active: false,
      previousX: 0,
      startX: 0,
      startY: 0,
      moved: false,
      pressedCategory: null,
    }

    const snap = {
      active: false,
      targetRotation: 0,
      categoryIndex: 0,
    }

    let hoveredCategory = null
    let hologramHovered = false
    let pausedUntil = 0

    let displayedCategory = null
    let hologramVisible = false

    let focusedCategoryIndex = null
    let focusActive = false

    const getCategoryFromPointer =
      (event) => {
        pointer.x =
          (event.clientX /
            renderer
              .domElement
              .clientWidth) *
            2 -
          1

        pointer.y =
          -(event.clientY /
            renderer
              .domElement
              .clientHeight) *
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

        if (
          intersections.length === 0
        ) {
          return null
        }

        let current =
          intersections[0].object

        while (
          current &&
          !current.userData.category
        ) {
          current =
            current.parent
        }

        return current
      }

    const getCategoryRotation =
      (index) => {
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

    const normalizeAngle =
      (angle) => {
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

    const getCategoryDistance =
      (index) => {
        const target =
          getCategoryRotation(
            index
          )

        return Math.abs(
          normalizeAngle(
            target -
              orbitGroup.rotation.y
          )
        )
      }

    const getFrontCategories =
      () => {
        const categories =
          CATEGORIES.map(
            (_, index) => ({
              index,
              distance:
                getCategoryDistance(
                  index
                ),
            })
          )

        categories.sort(
          (a, b) =>
            a.distance -
            b.distance
        )

        return categories
          .slice(
            0,
            ORBIT.frontCategoryCount
          )
          .map(
            (category) =>
              category.index
          )
      }

    const findNearestCategory =
      () => {
        let nearestIndex = 0
        let nearestDistance =
          Infinity

        CATEGORIES.forEach(
          (_, index) => {
            const distance =
              getCategoryDistance(
                index
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

    const isFrontCategory =
      (categoryObject) => {
        if (!categoryObject) {
          return false
        }

        const index =
          categoryObjects.indexOf(
            categoryObject
          )

        if (index === -1) {
          return false
        }

        return getFrontCategories().includes(
          index
        )
      }

    const showHologram = (
      categoryIndex
    ) => {
      const category =
        CATEGORIES[categoryIndex]

      if (!category) {
        return
      }

      if (
        displayedCategory ===
        category.name
      ) {
        if (hologram) {
          hologram.classList.remove(
            'opacity-0',
            'pointer-events-none'
          )

          hologram.classList.add(
            'opacity-100',
            'pointer-events-auto'
          )
        }

        hologramVisible = true
        return
      }

      displayedCategory =
        category.name

      if (infoRef.current) {
        infoRef.current.textContent =
          category.description
      }

      if (imageRef.current) {
        imageRef.current.src =
          category.image

        imageRef.current.alt =
          `${category.name} preview`
      }

      if (buttonRef.current) {
        buttonRef.current.href =
          category.link
      }

      if (hologram) {
        hologram.classList.remove(
          'opacity-0',
          'pointer-events-none'
        )

        hologram.classList.add(
          'opacity-100',
          'pointer-events-auto'
        )

        hologramVisible = true
      }
    }

    const hideHologram = () => {
      if (!hologramVisible) {
        return
      }

      if (hologram) {
        hologram.classList.remove(
          'opacity-100',
          'pointer-events-auto',
          'hologram-focused'
        )

        hologram.classList.add(
          'opacity-0',
          'pointer-events-none'
        )
      }

      hologramVisible = false
      displayedCategory = null
      hologramHovered = false
    }

    const startSnapToCategory =
      (categoryIndex) => {
        let target =
          getCategoryRotation(
            categoryIndex
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
          categoryIndex

        snap.active = true
        pausedUntil = 0
      }

    const setFocus =
      (active) => {
        focusActive =
          active

        if (hologram) {
          hologram.classList.toggle(
            'hologram-focused',
            active
          )
        }
      }

    const handleCategoryClick =
      (categoryObject) => {
        if (
          !isFrontCategory(
            categoryObject
          )
        ) {
          return
        }

        const index =
          categoryObjects.indexOf(
            categoryObject
          )

        if (index === -1) {
          return
        }

        const distance =
          getCategoryDistance(
            index
          )

        const isCenter =
          distance <
          ORBIT.centerThreshold

        if (!isCenter) {
          setFocus(false)
          startSnapToCategory(
            index
          )
          return
        }

        if (
          focusedCategoryIndex ===
          index
        ) {
          setFocus(false)
          focusedCategoryIndex =
            null
          return
        }

        focusedCategoryIndex =
          index

        snap.active = false
        pausedUntil = 0

        showHologram(index)
        setFocus(true)
      }

    const clearFocus =
      () => {
        focusedCategoryIndex =
          null

        setFocus(false)
      }

    const handlePointerDown =
      (event) => {
        const category =
          getCategoryFromPointer(
            event
          )

        const frontCategory =
          isFrontCategory(
            category
          )
            ? category
            : null

        drag.active = true
        drag.previousX =
          event.clientX

        drag.startX =
          event.clientX

        drag.startY =
          event.clientY

        drag.moved = false
        drag.pressedCategory =
          frontCategory

        snap.active = false

        if (
          focusedCategoryIndex !==
          null
        ) {
          clearFocus()
        }

        renderer
          .domElement
          .style
          .cursor =
          'grabbing'

        renderer
          .domElement
          .setPointerCapture(
            event.pointerId
          )
      }

    const handlePointerMove =
      (event) => {
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

        const category =
          getCategoryFromPointer(
            event
          )

        const frontCategory =
          isFrontCategory(
            category
          )
            ? category
            : null

        hoveredCategory =
          frontCategory

        if (!drag.active) {
          return
        }

        const distanceX =
          Math.abs(
            event.clientX -
              drag.startX
          )

        const distanceY =
          Math.abs(
            event.clientY -
              drag.startY
          )

        if (
          distanceX > 4 ||
          distanceY > 4
        ) {
          drag.moved = true
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

    const handlePointerUp =
      (event) => {
        const pressedCategory =
          drag.pressedCategory

        const wasClick =
          !drag.moved

        drag.active = false
        drag.pressedCategory =
          null

        renderer
          .domElement
          .style
          .cursor =
          'grab'

        if (
          renderer
            .domElement
            .hasPointerCapture(
              event.pointerId
            )
        ) {
          renderer
            .domElement
            .releasePointerCapture(
              event.pointerId
            )
        }

        if (
          wasClick &&
          pressedCategory
        ) {
          handleCategoryClick(
            pressedCategory
          )

          return
        }

        if (wasClick) {
          clearFocus()
          hideHologram()
          return
        }

        if (drag.moved) {
          const nearestIndex =
            findNearestCategory()

          startSnapToCategory(
            nearestIndex
          )
        }
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

    const hologramPanels =
      hologram
        ? hologram.querySelectorAll(
            '.holo-panel'
          )
        : []

    const handleHologramEnter =
      () => {
        hologramHovered = true
      }

    const handleHologramLeave =
      () => {
        hologramHovered = false
      }

    hologramPanels.forEach(
      (panel) => {
        panel.addEventListener(
          'pointerenter',
          handleHologramEnter
        )

        panel.addEventListener(
          'pointerleave',
          handleHologramLeave
        )
      }
    )

    if (buttonRef.current) {
      buttonRef.current.addEventListener(
        'pointerenter',
        handleHologramEnter
      )

      buttonRef.current.addEventListener(
        'pointerleave',
        handleHologramLeave
      )
    }

    const clock =
      new THREE.Clock()

    const projectedPosition =
      new THREE.Vector3()

    const animate = () => {
      const elapsedTime =
        clock.getElapsedTime()

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

      const earthProgress =
        earth.material
          .uniforms
          .uProgress
          .value

      const isLoading =
        earthProgress < 1

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
        const cameraTargetY =
          drag.active
            ? Math.max(
                0,
                mouse.y
              ) *
              CAMERA.topY
            : focusActive
              ? CAMERA.focusY
              : CAMERA.normalY

        const cameraTargetZ =
          drag.active
            ? CAMERA.normalZ -
              Math.max(
                0,
                mouse.y
              ) *
                (CAMERA.normalZ -
                  CAMERA.topZ)
            : focusActive
              ? CAMERA.focusZ
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
      }

      camera.lookAt(
        0,
        0,
        0
      )

      if (snap.active) {
        const difference =
          snap.targetRotation -
          orbitGroup.rotation.y

        orbitGroup.rotation.y +=
          difference *
          ORBIT.snapSpeed

        if (
          Math.abs(
            difference
          ) < 0.001
        ) {
          orbitGroup.rotation.y =
            snap.targetRotation

          snap.active = false

          pausedUntil =
            Date.now() +
            ORBIT.pauseDuration
        }
      }

      const isObjectHovered =
        hoveredCategory !== null

      const canAutoRotate =
        !drag.active &&
        !snap.active &&
        !isObjectHovered &&
        !hologramHovered &&
        !focusActive &&
        Date.now() >= pausedUntil

      if (canAutoRotate) {
        orbitGroup.rotation.y +=
          SPACE.rotationSpeed
      }

      if (!isLoading) {
        const nearestIndex =
          findNearestCategory()

        const distance =
          getCategoryDistance(
            nearestIndex
          )

        const showDistance =
          THREE.MathUtils.degToRad(
            28
          )

        const hideDistance =
          THREE.MathUtils.degToRad(
            45
          )

        if (
          focusActive &&
          focusedCategoryIndex !==
            null
        ) {
          showHologram(
            focusedCategoryIndex
          )
        } else if (
          !drag.active &&
          distance < showDistance
        ) {
          showHologram(
            nearestIndex
          )
        }

        if (
          drag.active ||
          (
            !focusActive &&
            distance > hideDistance
          )
        ) {
          hideHologram()
        }

        if (
          hologramVisible &&
          displayedCategory
        ) {
          const index =
            CATEGORIES.findIndex(
              (category) =>
                category.name ===
                displayedCategory
            )

          if (index !== -1) {
            const object =
              categoryObjects[index]

            projectedPosition.copy(
              object.position
            )

            orbitGroup.localToWorld(
              projectedPosition
            )

            projectedPosition.project(
              camera
            )

            const width =
              container.clientWidth

            const height =
              container.clientHeight

            const x =
              (projectedPosition.x *
                0.5 +
                0.5) *
              width

            const y =
              (-projectedPosition.y *
                0.5 +
                0.5) *
              height

            hologram.style.left =
              `${x}px`

            hologram.style.top =
              `${y}px`
          }
        }
      }

      renderer.render(
        scene,
        camera
      )
    }

    renderer.setAnimationLoop(
      animate
    )

    const handleResize =
      () => {
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

      hologramPanels.forEach(
        (panel) => {
          panel.removeEventListener(
            'pointerenter',
            handleHologramEnter
          )

          panel.removeEventListener(
            'pointerleave',
            handleHologramLeave
          )
        }
      )

      if (buttonRef.current) {
        buttonRef.current.removeEventListener(
          'pointerenter',
          handleHologramEnter
        )

        buttonRef.current.removeEventListener(
          'pointerleave',
          handleHologramLeave
        )
      }

      window.removeEventListener(
        'resize',
        handleResize
      )

      renderer.setAnimationLoop(
        null
      )

      categoryObjects.forEach(
        (object) => {
          object.geometry.dispose()
          object.material.map?.dispose()
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
    <div ref={containerRef} className=" category-space relative h-screen w-full overflow-hidden">
      {/* Logo */}
      <img src="/logo.png" alt="IDEA 3D" className=" pointer-events-none fixed left-1/2 top-3 z-10 w-40 -translate-x-1/2 select-none sm:w-56 md:w-64 lg:w-72 xl:w-80"/>

      {/* Hologram UI */}
      <div ref={hologramRef} className=" pointer-events-none absolute z-20 h-0 w-0 opacity-0 transition-all duration-300 ease-out">
        {/* Description */}
        <div className=" holo-panel absolute right-[220px] top-1/2 w-[min(44vw,440px)] -translate-y-1/2 p-5 sm:right-[260px] sm:p-6 ">
          <div className="holo-scan" />

          <div className=" mb-3 font-mono text-[9px] tracking-[0.25em] text-cyan-200 sm:text-xs">
            FIELD DATA
          </div>

          <p ref={infoRef} className=" font-mono text-[11px] leading-relaxed text-cyan-50 sm:text-sm"/>
        </div>

        {/* Image */}
        <div className=" holo-panel absolute left-[180px] top-1/2 w-[min(44vw,420px)] -translate-y-1/2 overflow-hidden p-4 sm:left-[210px] sm:p-5">
          <div className="holo-scan" />

          <img ref={imageRef} src="" alt="" className=" aspect-video w-full object-cover opacity-80"/>
        </div>

        {/* Page button */}
        <a ref={buttonRef} href="#" className=" pointer-events-auto absolute left-1/2 top-8 flex -translate-x-1/2 translate-y-full flex-row items-center gap-2 whitespace-nowrap font-mono text-sm font-semibold tracking-[0.12em] text-cyan-200 transition hover:text-white sm:top-10 sm:gap-3 sm:text-base">
          <span className="text-xl leading-none sm:text-2xl">
            △
          </span>

          <span>
            ページに移動
          </span>
        </a>
      </div>

      <style>
        {`
          .holo-panel {
            border: 1px solid
              rgba(100, 220, 255, 0.65);

            background:
              linear-gradient(
                135deg,
                rgba(0, 80, 110, 0.18),
                rgba(0, 20, 40, 0.45)
              );

            box-shadow:
              0 0 10px
                rgba(80, 210, 255, 0.18),
              inset 0 0 20px
                rgba(80, 210, 255, 0.06);

            clip-path:
              polygon(
                10px 0,
                calc(100% - 10px) 0,
                100% 10px,
                100% calc(100% - 10px),
                calc(100% - 10px) 100%,
                10px 100%,
                0 calc(100% - 10px),
                0 10px
              );

            animation:
              holoNoise 0.12s
              steps(2)
              infinite;
          }

          .hologram-focused {
            transform:
              scale(1.18);
            transform-origin:
              center center;
          }

          .holo-panel::before,
          .holo-panel::after {
            content: '';
            position: absolute;
            pointer-events: none;
          }

          .holo-panel::before {
            inset: 5px;

            border: 1px solid
              rgba(100, 220, 255, 0.16);
          }

          .holo-panel::after {
            top: 0;
            left: 0;
            width: 100%;
            height: 1px;

            background:
              rgba(170, 240, 255, 0.8);

            box-shadow:
              0 8px 0
                rgba(100, 220, 255, 0.12),
              0 16px 0
                rgba(100, 220, 255, 0.08);

            animation:
              holoScan 1.8s
              linear
              infinite;
          }

          .holo-scan {
            position: absolute;
            inset: 0;
            pointer-events: none;

            background:
              repeating-linear-gradient(
                0deg,
                transparent 0px,
                transparent 3px,
                rgba(100, 220, 255, 0.035) 4px
              );

            mix-blend-mode: screen;
          }

          @keyframes holoScan {
            from {
              transform:
                translateY(0);
              opacity: 0;
            }

            20% {
              opacity: 1;
            }

            80% {
              opacity: 0.8;
            }

            to {
              transform:
                translateY(100px);
              opacity: 0;
            }
          }

          @keyframes holoNoise {
            0% {
              filter:
                brightness(1)
                contrast(1);
            }

            20% {
              filter:
                brightness(1.18)
                contrast(1.15);
            }

            40% {
              filter:
                brightness(0.9)
                contrast(1.1);
            }

            60% {
              filter:
                brightness(1.1)
                contrast(1);
            }

            80% {
              filter:
                brightness(0.94)
                contrast(1.2);
            }

            100% {
              filter:
                brightness(1)
                contrast(1);
            }
          }

          @media (max-width: 640px) {
            .holo-panel {
              padding: 10px;
            }

            .hologram-focused {
              transform:
                scale(1.08);
            }
          }
        `}
      </style>
    </div>
  )
}

export default CategorySpace