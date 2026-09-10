import * as THREE from 'three'

import {
  ORBIT,
} from '../config/categorySpaceConfig'

import {
  CATEGORIES,
} from '../config/categoryData'

export default function createCategoryInteractionController({
  renderer,
  camera,
  orbitGroup,
  categoryObjects,
  hologramController,
  focusController,
  settingsRef,
  buttonRef,
  pageButtonRef,
}) {
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

  let hoveredCategory =
    null

  let hologramHovered =
    false

  let pausedUntil =
    0

  let pendingFocusAfterSnap =
    null

  const delayAutoRotation =
    () => {
      pausedUntil =
        Date.now() +
        ORBIT.pauseDuration
    }

  const getCategoryRotation =
    (index) => {
      const angle =
        (
          index /
          CATEGORIES.length
        ) *
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
      let nearestIndex =
        0

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

  const getNearestCategoryData =
    () => {
      const nearestIndex =
        findNearestCategory()

      return {
        nearestIndex,

        distance:
          getCategoryDistance(
            nearestIndex
          ),
      }
    }

  const isFrontCategory =
    (categoryObject) => {
      if (
        !categoryObject
      ) {
        return false
      }

      const index =
        categoryObjects.indexOf(
          categoryObject
        )

      if (
        index === -1
      ) {
        return false
      }

      return getFrontCategories().includes(
        index
      )
    }

  const getCategoryFromPointer =
    (event) => {
      pointer.x =
        (
          event.clientX /
          renderer
            .domElement
            .clientWidth
        ) *
          2 -
        1

      pointer.y =
        -(
          event.clientY /
          renderer
            .domElement
            .clientHeight
        ) *
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
        intersections[0]
          .object

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

      snap.active =
        true

      pausedUntil =
        0
    }

  const prepareFocus =
    (categoryIndex) => {
      pendingFocusAfterSnap =
        null

      snap.active =
        false

      hoveredCategory =
        null

      hologramHovered =
        false

      pausedUntil =
        0

      const started =
        focusController.enter(
          categoryIndex
        )

      if (started) {
        renderer.domElement.style.cursor =
          'pointer'
      }
    }

  const handleCategoryClick =
    (categoryObject) => {
      if (
        !focusController.isIdle()
      ) {
        return
      }

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

      if (
        index === -1
      ) {
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
        pendingFocusAfterSnap =
          null

        startSnapToCategory(
          index
        )

        return
      }

      prepareFocus(
        index
      )
    }

  const handleExpandClick =
    (event) => {
      event.preventDefault()
      event.stopPropagation()

      if (
        !focusController.isIdle()
      ) {
        return
      }

      const categoryIndex =
        hologramController
          .getCategoryIndex()

      if (
        categoryIndex ===
        null
      ) {
        return
      }

      const distance =
        getCategoryDistance(
          categoryIndex
        )

      hologramController.hide()

      if (
        distance <
        ORBIT.centerThreshold
      ) {
        prepareFocus(
          categoryIndex
        )

        return
      }

      pendingFocusAfterSnap =
        categoryIndex

      startSnapToCategory(
        categoryIndex
      )
    }

  const handlePointerDown =
    (event) => {
      const focusState =
        focusController
          .getState()

      if (
        focusState ===
          'entering' ||
        focusState ===
          'exiting'
      ) {
        return
      }

      const category =
        getCategoryFromPointer(
          event
        )

      if (
        focusController.isFocused()
      ) {
        drag.active =
          true

        drag.startX =
          event.clientX

        drag.startY =
          event.clientY

        drag.previousX =
          event.clientX

        drag.moved =
          false

        drag.pressedCategory =
          category

        renderer
          .domElement
          .setPointerCapture(
            event.pointerId
          )

        return
      }

      const frontCategory =
        isFrontCategory(
          category
        )
          ? category
          : null

      pendingFocusAfterSnap =
        null

      drag.active =
        true

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

      renderer.domElement.style.cursor =
        'grabbing'

      renderer
        .domElement
        .setPointerCapture(
          event.pointerId
        )
    }

  const handlePointerMove =
    (event) => {
      if (
        !settingsRef.current
          .performanceMode
      ) {
        mouse.x =
          (
            event.clientX /
            window.innerWidth
          ) *
            2 -
          1

        mouse.y =
          (
            event.clientY /
            window.innerHeight
          ) *
            2 -
          1
      }

      if (
        !focusController.isIdle()
      ) {
        if (
          drag.active
        ) {
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
        }

        return
      }

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

      const previousHoveredCategory =
        hoveredCategory

      hoveredCategory =
        frontCategory

      if (
        previousHoveredCategory &&
        !frontCategory
      ) {
        delayAutoRotation()
      }

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

  const releasePointer =
    (event) => {
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
    }

  const handlePointerUp =
    (event) => {
      if (
        !drag.active
      ) {
        return
      }

      const pressedCategory =
        drag.pressedCategory

      const wasClick =
        !drag.moved

      drag.active =
        false

      drag.pressedCategory =
        null

      releasePointer(
        event
      )

      if (
        focusController.isFocused()
      ) {
        if (wasClick) {
          focusController.exit()
        }

        return
      }

      renderer.domElement.style.cursor =
        'grab'

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
        hologramController.hide()

        delayAutoRotation()

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

  const hologram =
    hologramController
      .getElement()

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

      if (
        focusController.isIdle()
      ) {
        delayAutoRotation()
      }
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

    buttonRef.current.addEventListener(
      'click',
      handleExpandClick
    )
  }

  if (
    pageButtonRef.current
  ) {
    pageButtonRef.current.addEventListener(
      'pointerenter',
      handleHologramEnter
    )

    pageButtonRef.current.addEventListener(
      'pointerleave',
      handleHologramLeave
    )
  }

  const updateSnap =
    () => {
      if (
        !snap.active ||
        !focusController.isIdle()
      ) {
        return
      }

      const difference =
        snap.targetRotation -
        orbitGroup.rotation.y

      orbitGroup.rotation.y +=
        difference *
        ORBIT.snapSpeed

      if (
        Math.abs(
          difference
        ) >= 0.001
      ) {
        return
      }

      orbitGroup.rotation.y =
        snap.targetRotation

      const completedIndex =
        snap.categoryIndex

      snap.active =
        false

      if (
        pendingFocusAfterSnap ===
        completedIndex
      ) {
        pendingFocusAfterSnap =
          null

        prepareFocus(
          completedIndex
        )

        return
      }

      delayAutoRotation()
    }

  const canAutoRotate =
    () => {
      return (
        settingsRef.current
          .autoRotate &&
        focusController.isIdle() &&
        !drag.active &&
        !snap.active &&
        hoveredCategory ===
          null &&
        !hologramHovered &&
        Date.now() >=
          pausedUntil
      )
    }

  const dispose =
    () => {
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

        buttonRef.current.removeEventListener(
          'click',
          handleExpandClick
        )
      }

      if (
        pageButtonRef.current
      ) {
        pageButtonRef.current.removeEventListener(
          'pointerenter',
          handleHologramEnter
        )

        pageButtonRef.current.removeEventListener(
          'pointerleave',
          handleHologramLeave
        )
      }
    }

  return {
    mouse,
    drag,

    updateSnap,
    canAutoRotate,

    delayAutoRotation,
    getNearestCategoryData,

    dispose,
  }
}