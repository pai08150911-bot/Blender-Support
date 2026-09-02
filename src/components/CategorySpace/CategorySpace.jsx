import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import createParticleEarth from './ParticleEarth'

const SPACE = {
  starCount: 1500,
  starSize: 0.06,
  starColor: 0xffffff,
  starDepth: 30,

  moveX: 0.15,
  moveY: 0.1,

  rotationSpeed: 0.005,
  twinkleSpeed: 0.002,
}

function CategorySpace() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current

    // ==============================
    // Scene
    // ==============================

    const scene = new THREE.Scene()

    // ==============================
    // Camera
    // ==============================

    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    )

    camera.position.z = 5

    // ==============================
    // Renderer
    // ==============================

    const renderer = new THREE.WebGLRenderer({
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

    container.appendChild(renderer.domElement)

    // ==============================
    // Star texture
    // ==============================

    const starTexture = new THREE.TextureLoader().load(
      'data:image/svg+xml,' +
      encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">
          <circle
            cx="32"
            cy="32"
            r="30"
            fill="white"
          />
        </svg>
      `)
    )

    // ==============================
    // Star positions
    // ==============================

    const starGeometry = new THREE.BufferGeometry()

    const positions = new Float32Array(
      SPACE.starCount * 3
    )

    for (let i = 0; i < SPACE.starCount * 3; i += 3) {
      positions[i] =
        (Math.random() - 0.5) * SPACE.starDepth

      positions[i + 1] =
        (Math.random() - 0.5) * SPACE.starDepth

      positions[i + 2] =
        (Math.random() - 0.5) * SPACE.starDepth
    }

    starGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    )

    // ==============================
    // Star material
    // ==============================

    const starMaterial = new THREE.PointsMaterial({
      size: SPACE.starSize,
      color: SPACE.starColor,
      transparent: true,
      opacity: 0.8,
      map: starTexture,
      alphaTest: 0.01,
      depthWrite: false,
    })

    // ==============================
    // Stars
    // ==============================

    const stars = new THREE.Points(
      starGeometry,
      starMaterial
    )

    scene.add(stars)

    // ==============================
    // Particle Earth
    // ==============================

    const earth = createParticleEarth()

    scene.add(earth)

    // ==============================
    // Mouse
    // ==============================

    const mouse = {
      x: 0,
      y: 0,
    }

    const handleMouseMove = (event) => {
      mouse.x =
        (event.clientX / window.innerWidth) * 2 - 1

      mouse.y =
        -(event.clientY / window.innerHeight) * 2 + 1
    }

    window.addEventListener(
      'mousemove',
      handleMouseMove
    )

    // ==============================
    // Animation
    // ==============================

    const clock = new THREE.Clock()

    const animate = () => {
      const elapsedTime = clock.getElapsedTime()

      // 星全体をカーソルに合わせて移動
      stars.position.x =
        mouse.x * SPACE.moveX

      stars.position.y =
        mouse.y * SPACE.moveY

      // 星をゆっくり回転
      stars.rotation.y =
        elapsedTime * SPACE.rotationSpeed

      // 星をゆっくり明滅
      starMaterial.opacity =
        0.65 +
        Math.sin(
          elapsedTime * SPACE.twinkleSpeed * 1000
        ) * 0.15

      renderer.render(scene, camera)
    }

    renderer.setAnimationLoop(animate)

    // ==============================
    // Resize
    // ==============================

    const handleResize = () => {
      const width = container.clientWidth
      const height = container.clientHeight

      camera.aspect = width / height
      camera.updateProjectionMatrix()

      renderer.setSize(width, height)
    }

    window.addEventListener(
      'resize',
      handleResize
    )

    // ==============================
    // Cleanup
    // ==============================

    return () => {
      window.removeEventListener(
        'mousemove',
        handleMouseMove
      )

      window.removeEventListener(
        'resize',
        handleResize
      )

      renderer.setAnimationLoop(null)

      starGeometry.dispose()
      starMaterial.dispose()
      starTexture.dispose()

      earth.geometry.dispose()
      earth.material.dispose()

      renderer.dispose()

      container.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="category-space"
    />
  )
}

export default CategorySpace