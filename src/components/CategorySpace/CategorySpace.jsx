import {
  useEffect,
  useRef,
} from 'react'
import * as THREE from 'three'

import createParticleEarth from './ParticleEarth'
import CategoryHologram from './CategoryHologram'

import {
  SPACE,
  ORBIT,
  CAMERA,
} from './categorySpaceConfig'

import {
  CATEGORIES,
} from './categoryData'

import createParticleTexture from './createParticleTexture'
import createParticleSphere from './createParticleSphere'
import createStarField from './createStarField'
import createOrbitRing from './createOrbitRing'

import './CategorySpace.css'

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

    let displayedCategory =
      null

    let hologramVisible =
      false

    let focusedCategoryIndex =
      null

    let focusActive =
      false

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
          intersections.length ===
          0
        ) {
          return null
        }

        let current =
          intersections[0].object

        while (
          current &&
          !current.userData
            .category
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
              orbitGroup
                .rotation.y
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

    const showHologram =
      (categoryIndex) => {
        const category =
          CATEGORIES[
            categoryIndex
          ]

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

          hologramVisible =
            true

          return
        }

        displayedCategory =
          category.name

        if (
          infoRef.current
        ) {
          infoRef.current.textContent =
            category.description
        }

        if (
          imageRef.current
        ) {
          imageRef.current.src =
            category.image

          imageRef.current.alt =
            `${category.name} preview`
        }

        if (
          buttonRef.current
        ) {
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

          hologramVisible =
            true
        }
      }

    const hideHologram =
      () => {
        if (
          !hologramVisible
        ) {
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

        hologramVisible =
          false

        displayedCategory =
          null

        hologramHovered =
          false
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
            target -
              current
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

        showHologram(
          index
        )

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

        drag.moved =
          false

        drag.pressedCategory =
          frontCategory

        snap.active =
          false

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
          drag.moved =
            true
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

    renderer
      .domElement
      .addEventListener(
        'pointerdown',
        handlePointerDown
      )

    renderer
      .domElement
      .addEventListener(
        'pointermove',
        handlePointerMove
      )

    renderer
      .domElement
      .addEventListener(
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
        hologramHovered =
          true
      }

    const handleHologramLeave =
      () => {
        hologramHovered =
          false
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

    if (
      buttonRef.current
    ) {
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
                (
                  CAMERA.normalZ -
                  CAMERA.topZ
                )
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

          snap.active =
            false

          pausedUntil =
            Date.now() +
            ORBIT.pauseDuration
        }
      }

      const isObjectHovered =
        hoveredCategory !==
        null

      const canAutoRotate =
        !drag.active &&
        !snap.active &&
        !isObjectHovered &&
        !hologramHovered &&
        !focusActive &&
        Date.now() >=
          pausedUntil

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
          distance <
            showDistance
        ) {
          showHologram(
            nearestIndex
          )
        }

        if (
          drag.active ||
          (
            !focusActive &&
            distance >
              hideDistance
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
              categoryObjects[
                index
              ]

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
              (
                projectedPosition.x *
                  0.5 +
                0.5
              ) *
              width

            const y =
              (
                -projectedPosition.y *
                  0.5 +
                0.5
              ) *
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

      renderer
        .domElement
        .removeEventListener(
          'pointerdown',
          handlePointerDown
        )

      renderer
        .domElement
        .removeEventListener(
          'pointermove',
          handlePointerMove
        )

      renderer
        .domElement
        .removeEventListener(
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

      if (
        buttonRef.current
      ) {
        buttonRef.current.removeEventListener(
          'pointerenter',
          handleHologramEnter
        )

        buttonRef.current.removeEventListener(
          'pointerleave',
          handleHologramLeave
        )
      }

      renderer.setAnimationLoop(
        null
      )

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
      className="
        category-space
        relative
        h-screen
        w-full
        overflow-hidden
      "
    >
      <img
        src="/logo.png"
        alt="IDEA 3D"
        className="
          pointer-events-none
          fixed
          left-1/2
          top-3
          z-10
          w-40
          -translate-x-1/2
          select-none
          sm:w-56
          md:w-64
          lg:w-72
          xl:w-80
        "
      />

      <CategoryHologram
        hologramRef={
          hologramRef
        }
        infoRef={
          infoRef
        }
        imageRef={
          imageRef
        }
        buttonRef={
          buttonRef
        }
      />
    </div>
  )
}

export default CategorySpace