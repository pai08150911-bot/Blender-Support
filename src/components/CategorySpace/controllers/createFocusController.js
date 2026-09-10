import * as THREE from 'three'

function easeOutCubic(value) {
  return (
    1 -
    Math.pow(
      1 - value,
      3
    )
  )
}

export default function createFocusController({
  duration,
  orbitGroup,
  orbitTilt,
  earth,
  categoryObjects,
  ringMaterials,
  earthMaterialStates,
  categoryMaterialStates,
  ringMaterialStates,
  setMaterialOpacity,
  focusBackdrop,
  hologramController,
  logo,
  onFinishedExit,
}) {
  let state =
    'idle'

  let progress =
    0

  let transitionStartedAt =
    0

  let transitionStartProgress =
    0

  let focusedCategoryIndex =
    null

  const applyScene =
    (value) => {
      const normalOpacity =
        1 - value

      orbitGroup.rotation.x =
        THREE.MathUtils.lerp(
          orbitTilt,
          0,
          value
        )

      categoryObjects.forEach(
        (
          object,
          index
        ) => {
          const selected =
            index ===
            focusedCategoryIndex

          if (selected) {
            object.visible =
              true

            setMaterialOpacity(
              categoryMaterialStates[
                index
              ],
              1
            )

            return
          }

          setMaterialOpacity(
            categoryMaterialStates[
              index
            ],
            normalOpacity
          )

          object.visible =
            normalOpacity >
            0.01
        }
      )

      ringMaterialStates.forEach(
        ({
          material,
          opacity,
        }) => {
          material.opacity =
            opacity *
            normalOpacity

          material.visible =
            normalOpacity >
            0.01
        }
      )

      setMaterialOpacity(
        earthMaterialStates,
        normalOpacity
      )

      earth.visible =
        normalOpacity >
        0.08
    }

  const restoreScene =
    () => {
      setMaterialOpacity(
        earthMaterialStates,
        1
      )

      earth.visible =
        true

      categoryObjects.forEach(
        (
          object,
          index
        ) => {
          object.visible =
            true

          setMaterialOpacity(
            categoryMaterialStates[
              index
            ],
            1
          )
        }
      )

      ringMaterialStates.forEach(
        ({
          material,
          opacity,
        }) => {
          material.visible =
            true

          material.opacity =
            opacity
        }
      )

      orbitGroup.rotation.x =
        orbitTilt
    }

  const enter =
    (categoryIndex) => {
      if (
        state !==
        'idle'
      ) {
        return false
      }

      focusedCategoryIndex =
        categoryIndex

      hologramController.hide()

      state =
        'entering'

      transitionStartedAt =
        performance.now()

      transitionStartProgress =
        progress

      if (focusBackdrop) {
        focusBackdrop.classList.add(
          'is-visible'
        )
      }

      if (logo) {
        logo.classList.remove(
          'opacity-100'
        )

        logo.classList.add(
          'opacity-0'
        )
      }

      return true
    }

  const exit =
    () => {
      if (
        state ===
          'idle' ||
        state ===
          'exiting'
      ) {
        return false
      }

      hologramController.hide()

      state =
        'exiting'

      transitionStartedAt =
        performance.now()

      transitionStartProgress =
        progress

      earth.visible =
        true

      categoryObjects.forEach(
        (object) => {
          object.visible =
            true
        }
      )

      ringMaterials.forEach(
        (material) => {
          material.visible =
            true
        }
      )

      if (focusBackdrop) {
        focusBackdrop.classList.remove(
          'is-visible'
        )
      }

      if (logo) {
        logo.classList.remove(
          'opacity-0'
        )

        logo.classList.add(
          'opacity-100'
        )
      }

      return true
    }

  const update =
    (now) => {
      if (
        state !==
          'entering' &&
        state !==
          'exiting'
      ) {
        return
      }

      const elapsed =
        now -
        transitionStartedAt

      const linearProgress =
        THREE.MathUtils.clamp(
          elapsed /
            duration,
          0,
          1
        )

      const easedProgress =
        easeOutCubic(
          linearProgress
        )

      const target =
        state ===
        'entering'
          ? 1
          : 0

      progress =
        THREE.MathUtils.lerp(
          transitionStartProgress,
          target,
          easedProgress
        )

      applyScene(
        progress
      )

      if (
        linearProgress <
        1
      ) {
        return
      }

      if (
        state ===
        'entering'
      ) {
        progress =
          1

        applyScene(1)

        state =
          'focused'

        hologramController.setFocused(
          true
        )

        hologramController.show(
          focusedCategoryIndex
        )

        return
      }

      progress =
        0

      restoreScene()

      state =
        'idle'

      hologramController.setFocused(
        false
      )

      focusedCategoryIndex =
        null

      onFinishedExit?.()
    }

  return {
    enter,
    exit,
    update,
    restoreScene,

    getState() {
      return state
    },

    getProgress() {
      return progress
    },

    getFocusedCategoryIndex() {
      return focusedCategoryIndex
    },

    isFocused() {
      return (
        state ===
        'focused'
      )
    },

    isIdle() {
      return (
        state ===
        'idle'
      )
    },
  }
}