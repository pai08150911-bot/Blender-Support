import * as THREE from 'three'

export default function createHologramController({
  hologram,
  infoRef,
  imageRef,
  pageButtonRef,
  categories,
  categoryObjects,
  orbitGroup,
  camera,
  container,
  fadeDuration,
}) {
  const projectedPosition =
    new THREE.Vector3()

  let state =
    'hidden'

  let categoryIndex =
    null

  let transitionStartedAt =
    0

  const updateContent =
    (index) => {
      const category =
        categories[index]

      if (!category) {
        return
      }

      categoryIndex =
        index

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

      if (
        pageButtonRef.current
      ) {
        pageButtonRef.current.href =
          category.link
      }
    }

  const position =
    (index) => {
      if (
        !hologram ||
        index === null
      ) {
        return
      }

      const object =
        categoryObjects[index]

      if (!object) {
        return
      }

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

  const setOpacity =
    (visible) => {
      if (!hologram) {
        return
      }

      if (visible) {
        hologram.classList.remove(
          'opacity-0',
          'pointer-events-none'
        )

        hologram.classList.add(
          'opacity-100',
          'pointer-events-auto'
        )

        return
      }

      hologram.classList.remove(
        'opacity-100',
        'pointer-events-auto'
      )

      hologram.classList.add(
        'opacity-0',
        'pointer-events-none'
      )
    }

  const beginFadeIn =
    (
      index,
      now
    ) => {
      updateContent(index)
      position(index)

      setOpacity(false)

      state =
        'waiting'

      transitionStartedAt =
        now
    }

  const show =
    (index) => {
      const now =
        performance.now()

      if (
        state ===
          'visible' &&
        categoryIndex ===
          index
      ) {
        return
      }

      if (
        state ===
          'waiting' &&
        categoryIndex ===
          index
      ) {
        return
      }

      if (
        state ===
        'fading-out'
      ) {
        return
      }

      if (
        state ===
        'hidden'
      ) {
        beginFadeIn(
          index,
          now
        )

        return
      }

      setOpacity(false)

      state =
        'fading-out'

      transitionStartedAt =
        now
    }

  const hide =
    () => {
      if (
        state ===
          'hidden' ||
        state ===
          'fading-out'
      ) {
        return
      }

      if (
        state ===
        'waiting'
      ) {
        setOpacity(false)

        state =
          'hidden'

        categoryIndex =
          null

        return
      }

      setOpacity(false)

      state =
        'fading-out'

      transitionStartedAt =
        performance.now()
    }

  const update =
    (now) => {
      if (
        state ===
          'waiting' &&
        now -
          transitionStartedAt >
          16
      ) {
        setOpacity(true)

        state =
          'visible'
      }

      if (
        state ===
          'fading-out' &&
        now -
          transitionStartedAt >=
          fadeDuration
      ) {
        setOpacity(false)

        state =
          'hidden'

        categoryIndex =
          null
      }

      if (
        categoryIndex !==
          null &&
        (
          state ===
            'waiting' ||
          state ===
            'visible'
        )
      ) {
        position(
          categoryIndex
        )
      }
    }

  const setFocused =
    (focused) => {
      if (!hologram) {
        return
      }

      hologram.classList.toggle(
        'hologram-focused',
        focused
      )
    }

    return {
    show,
    hide,
    update,
    setFocused,

    getElement() {
        return hologram
    },

    getCategoryIndex() {
        return categoryIndex
    },

    getState() {
        return state
    },
    }
}