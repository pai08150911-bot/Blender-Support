import * as THREE from 'three'

import {
  SPACE,
  CAMERA,
} from '../config/categorySpaceConfig'

export default function createCategoryAnimationController({
  renderer,
  camera,
  earth,
  scene,
  stars,
  starMaterial,
  orbitGroup,
  focusController,
  hologramController,
  interactionController,
  settingsRef,
  logo,
}) {
  let logoVisible =
    false

  let lastFrameTime =
    performance.now()

  const animate =
    () => {
      const now =
        performance.now()

      const deltaMilliseconds =
        Math.min(
          now -
            lastFrameTime,
          100
        )

      lastFrameTime =
        now

      focusController.update(
        now
      )

      if (
        !focusController.isFocused()
      ) {
        earth.userData.update(
          deltaMilliseconds,
          {
            skipFormation:
              settingsRef.current
                .skipEarthAnimation,

            rotate:
              !settingsRef.current
                .performanceMode,
          }
        )
      }

      const elapsedTime =
        now / 1000

      if (
        !settingsRef.current
          .performanceMode
      ) {
        stars.position.x =
          interactionController
            .mouse.x *
          SPACE.moveX

        stars.position.y =
          -interactionController
            .mouse.y *
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
      }

      hologramController.update(
        now
      )

      const earthProgress =
        earth.material
          .uniforms
          .uProgress
          .value

      const isLoading =
        earthProgress < 1

      if (
        !isLoading &&
        !logoVisible &&
        logo
      ) {
        logo.classList.remove(
          'opacity-0'
        )

        if (
          focusController.isIdle()
        ) {
          logo.classList.add(
            'opacity-100'
          )
        }

        logoVisible =
          true
      }

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
      } else if (
        !focusController.isIdle()
      ) {
        const focusProgress =
          focusController
            .getProgress()

        camera.position.y =
          THREE.MathUtils.lerp(
            CAMERA.normalY,
            CAMERA.focusY,
            focusProgress
          )

        camera.position.z =
          THREE.MathUtils.lerp(
            CAMERA.normalZ,
            CAMERA.focusZ,
            focusProgress
          )
      } else {
        const cameraTargetY =
          interactionController
            .drag.active
            ? Math.max(
                0,
                interactionController
                  .mouse.y
              ) *
              CAMERA.topY
            : CAMERA.normalY

        const cameraTargetZ =
          interactionController
            .drag.active
            ? CAMERA.normalZ -
              Math.max(
                0,
                interactionController
                  .mouse.y
              ) *
                (
                  CAMERA.normalZ -
                  CAMERA.topZ
                )
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

      interactionController.updateSnap()

      if (
        interactionController.canAutoRotate()
      ) {
        orbitGroup.rotation.y +=
          SPACE.rotationSpeed
      }

      if (!isLoading) {
        if (
          focusController.isFocused()
        ) {
          const focusedIndex =
            focusController
              .getFocusedCategoryIndex()

          if (
            focusedIndex !==
            null
          ) {
            hologramController.show(
              focusedIndex
            )
          }
        }

        if (
          focusController.isIdle()
        ) {
          const {
            nearestIndex,
            distance,
          } =
            interactionController
              .getNearestCategoryData()

          const showDistance =
            THREE.MathUtils.degToRad(
              28
            )

          const hideDistance =
            THREE.MathUtils.degToRad(
              45
            )

          if (
            !interactionController
              .drag.active &&
            distance <
              showDistance
          ) {
            hologramController.show(
              nearestIndex
            )
          }

          if (
            interactionController
              .drag.active ||
            distance >
              hideDistance
          ) {
            hologramController.hide()
          }
        }
      }

      renderer.render(
        scene,
        camera
      )
    }

  const start =
    () => {
      renderer.setAnimationLoop(
        animate
      )
    }

  const pause =
    () => {
      renderer.setAnimationLoop(
        null
      )
    }

  const resume =
    () => {
      lastFrameTime =
        performance.now()

      renderer.setAnimationLoop(
        animate
      )
    }

  return {
    start,
    pause,
    resume,
  }
}