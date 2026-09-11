import {
  useEffect,
  useRef,
  useState,
} from 'react'

import CategoryHologram
  from './ui/CategoryHologram'

import CategorySettings
  from './ui/CategorySettings'

import createCategoryScene
  from './scene/createCategoryScene'

import createHologramController
  from './controllers/createHologramController'

import createFocusController
  from './controllers/createFocusController'

import createMaterialStateController
  from './controllers/createMaterialStateController'

import createCategoryInteractionController
  from './controllers/createCategoryInteractionController'

import createCategoryAnimationController
  from './controllers/createCategoryAnimationController'

import {
  ORBIT,
} from './config/categorySpaceConfig'

import {
  CATEGORIES,
} from './config/categoryData'

import './styles/CategorySpace.css'

const SETTINGS_STORAGE_KEY =
  'idea3d-category-settings'

const DEFAULT_SETTINGS = {
  autoRotate: true,
  skipEarthAnimation: false,
  performanceMode: false,
}

const HOLOGRAM_FADE_DURATION =
  300

const FOCUS_TRANSITION_DURATION =
  900

function loadSettings() {
  try {
    const saved =
      localStorage.getItem(
        SETTINGS_STORAGE_KEY
      )

    if (!saved) {
      return DEFAULT_SETTINGS
    }

    return {
      ...DEFAULT_SETTINGS,
      ...JSON.parse(saved),
    }
  } catch {
    return DEFAULT_SETTINGS
  }
}

function CategorySpace() {
  const containerRef =
    useRef(null)

  const logoRef =
    useRef(null)

  const hologramRef =
    useRef(null)

  const titleRef =
    useRef(null)

  const infoRef =
    useRef(null)

  const imageRef =
    useRef(null)

  const buttonRef =
    useRef(null)

  const pageButtonRef =
    useRef(null)

  const focusBackdropRef =
    useRef(null)

  const animationControlRef =
    useRef(null)

  const [settings, setSettings] =
    useState(loadSettings)

  const settingsRef =
    useRef(settings)

  const [
    settingsOpen,
    setSettingsOpen,
  ] =
    useState(false)

  const handleSettingsOpenChange =
    (open) => {
      setSettingsOpen(open)

      if (open) {
        animationControlRef
          .current
          ?.pause()
      } else {
        animationControlRef
          .current
          ?.resume()
      }
    }

  const handleSettingChange =
    (
      settingName,
      value
    ) => {
      setSettings(
        (currentSettings) => {
          const nextSettings = {
            ...currentSettings,
            [settingName]:
              value,
          }

          settingsRef.current =
            nextSettings

          try {
            localStorage.setItem(
              SETTINGS_STORAGE_KEY,
              JSON.stringify(
                nextSettings
              )
            )
          } catch {
            // localStorageが使用できない場合は
            // 現在のセッションのみ設定を維持する
          }

          animationControlRef
            .current
            ?.applySettings(
              nextSettings
            )

          return nextSettings
        }
      )
    }

  useEffect(() => {
    const container =
      containerRef.current

    const logo =
      logoRef.current

    const hologram =
      hologramRef.current

    const focusBackdrop =
      focusBackdropRef.current

    const categoryScene =
      createCategoryScene({
        container,

        performanceMode:
          settingsRef.current
            .performanceMode,
      })

    const {
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
    } =
      categoryScene

    const materialStateController =
      createMaterialStateController({
        earth,
        categoryObjects,
        ringMaterials,
      })

    const {
      earthMaterialStates,
      categoryMaterialStates,
      ringMaterialStates,
      setMaterialOpacity,
    } =
      materialStateController

    const hologramController =
      createHologramController({
        hologram,

        titleRef,

        infoRef,

        imageRef,

        pageButtonRef,

        categories:
          CATEGORIES,

        categoryObjects,

        orbitGroup,

        camera,

        container,

        fadeDuration:
          HOLOGRAM_FADE_DURATION,
      })

    let interactionController =
      null

    const focusController =
      createFocusController({
        duration:
          FOCUS_TRANSITION_DURATION,

        orbitGroup,

        orbitTilt:
          ORBIT.tilt,

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

        onFinishedExit:
          () => {
            renderer.domElement.style.cursor =
              'grab'

            interactionController
              ?.delayAutoRotation()
          },
      })

    interactionController =
      createCategoryInteractionController({
        renderer,

        camera,

        orbitGroup,

        categoryObjects,

        hologramController,

        focusController,

        settingsRef,

        buttonRef,

        pageButtonRef,
      })

      const shouldAlignInitialCategory =
    !settingsRef.current
      .autoRotate ||
    settingsRef.current
      .skipEarthAnimation

  if (
    shouldAlignInitialCategory
  ) {
    interactionController
      .alignInitialCategory()
  }

    const animationController =
      createCategoryAnimationController({
        scene,

        renderer,

        camera,

        earth,

        stars,

        starMaterial,

        orbitGroup,

        focusController,

        hologramController,

        interactionController,

        settingsRef,

        logo,

        categoryObjects,
      })

    const applySettings =
      (
        nextSettings
      ) => {
        setRendererPixelRatio(
          nextSettings
            .performanceMode
        )
      }

    animationControlRef.current =
      {
        pause:
          animationController
            .pause,

        resume:
          animationController
            .resume,

        applySettings,
      }

    animationController.start()

    const handleResize =
      () => {
        categoryScene.resize(
          settingsRef.current
            .performanceMode
        )
      }

    window.addEventListener(
      'resize',
      handleResize
    )

    return () => {
      animationControlRef.current =
        null

      window.removeEventListener(
        'resize',
        handleResize
      )

      animationController.pause()

      interactionController.dispose()

      focusController.restoreScene()

      categoryScene.dispose()
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
        ref={logoRef}
        src="/logo.png"
        alt="IDEA 3D"
        className="
          pointer-events-none
          fixed
          left-1/2
          top-3
          z-10
          w-48
          -translate-x-1/2
          select-none
          opacity-0
          transition-opacity
          duration-1000
          ease-out
          sm:w-64
          md:w-72
          lg:w-80
          xl:w-96
        "
      />

      <div
        ref={focusBackdropRef}
        className="
          category-focus-backdrop
        "
      />

      <CategoryHologram
        hologramRef={
          hologramRef
        }
        titleRef={
          titleRef
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
        pageButtonRef={
          pageButtonRef
        }
      />

      <CategorySettings
        isOpen={
          settingsOpen
        }
        settings={
          settings
        }
        onOpenChange={
          handleSettingsOpenChange
        }
        onSettingChange={
          handleSettingChange
        }
      />
    </div>
  )
}

export default CategorySpace