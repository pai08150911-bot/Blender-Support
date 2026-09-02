import * as THREE from 'three'

const EARTH = {
  particleCount: 12000,
  oceanParticleCount: 3500,
  radius: 1.5,

  particleSize: 0.036,
  oceanParticleSize: 0.090,

  formationDuration: 5000,
  rotationSpeed: 0.002,

  gridParticleSize: 0.012,
  gridParticleCount: 900,
}

const vertexShader = `
  attribute vec3 aStartPosition;
  attribute vec2 aUv;

  varying vec2 vUv;

  uniform float uProgress;

  void main() {
    vUv = aUv;

    float eased =
      1.0 - pow(1.0 - uProgress, 3.0);

    vec3 currentPosition =
      mix(
        aStartPosition,
        position,
        eased
      );

    vec4 mvPosition =
      modelViewMatrix *
      vec4(currentPosition, 1.0);

    gl_PointSize =
      ${EARTH.particleSize.toFixed(3)} *
      (300.0 / -mvPosition.z);

    gl_Position =
      projectionMatrix *
      mvPosition;
  }
`

const fragmentShader = `
  uniform sampler2D uMap;

  varying vec2 vUv;

  void main() {
    vec2 point =
      gl_PointCoord - 0.5;

    float distance =
      length(point);

    if (distance > 0.5) {
      discard;
    }

    float land =
      texture2D(uMap, vUv).r;

    float landMask =
      smoothstep(0.35, 0.65, land);

    vec3 oceanColor =
      vec3(0.08, 0.25, 0.5);

    vec3 landColor =
      vec3(0.95, 1.0, 1.0);

    vec3 color =
      mix(
        oceanColor,
        landColor,
        landMask
      );

    float alpha =
      mix(
        0.16,
        1.0,
        landMask
      );

    float glow =
      1.0 - distance * 1.5;

    gl_FragColor =
      vec4(
        color,
        alpha * glow
      );
  }
`

const oceanVertexShader = `
  attribute vec3 aStartPosition;

  uniform float uProgress;

  void main() {
    float eased =
      1.0 - pow(1.0 - uProgress, 3.0);

    vec3 currentPosition =
      mix(
        aStartPosition,
        position,
        eased
      );

    vec4 mvPosition =
      modelViewMatrix *
      vec4(currentPosition, 1.0);

    gl_PointSize =
      ${EARTH.oceanParticleSize.toFixed(3)} *
      (300.0 / -mvPosition.z);

    gl_Position =
      projectionMatrix *
      mvPosition;
  }
`

const oceanFragmentShader = `
  void main() {
    vec2 point =
      gl_PointCoord - 0.5;

    float distance =
      length(point);

    if (distance > 0.5) {
      discard;
    }

    float glow =
      1.0 - distance * 1.5;

    gl_FragColor =
      vec4(
        0.12,
        0.38,
        0.7,
        0.38 * glow
      );
  }
`

const gridVertexShader = `
  void main() {
    vec4 mvPosition =
      modelViewMatrix *
      vec4(position, 1.0);

    gl_PointSize =
      ${EARTH.gridParticleSize.toFixed(3)} *
      (300.0 / -mvPosition.z);

    gl_Position =
      projectionMatrix *
      mvPosition;
  }
`

const gridFragmentShader = `
  void main() {
    vec2 point =
      gl_PointCoord - 0.5;

    float distance =
      length(point);

    if (distance > 0.5) {
      discard;
    }

    gl_FragColor =
      vec4(
        0.35,
        0.65,
        0.85,
        0.28
      );
  }
`

function createGridParticles() {
  const geometry =
    new THREE.BufferGeometry()

  const positions =
    new Float32Array(
      EARTH.gridParticleCount * 3
    )

  let index = 0

  const lineCount = 16

  const pointsPerLine =
    Math.floor(
      EARTH.gridParticleCount /
        lineCount
    )

  for (
    let line = 0;
    line < lineCount;
    line++
  ) {
    const angle =
      (line / lineCount) *
      Math.PI *
      2

    for (
      let point = 0;
      point < pointsPerLine;
      point++
    ) {
      const latitude =
        -Math.PI / 2 +
        (point /
          (pointsPerLine - 1)) *
          Math.PI

      const radius =
        EARTH.radius *
        Math.cos(latitude)

      const y =
        EARTH.radius *
        Math.sin(latitude)

      positions[index] =
        radius *
        Math.sin(angle)

      positions[index + 1] =
        y

      positions[index + 2] =
        radius *
        Math.cos(angle)

      index += 3
    }
  }

  geometry.setAttribute(
    'position',
    new THREE.BufferAttribute(
      positions,
      3
    )
  )

  const material =
    new THREE.ShaderMaterial({
      vertexShader:
        gridVertexShader,

      fragmentShader:
        gridFragmentShader,

      transparent: true,
      depthWrite: false,
    })

  return new THREE.Points(
    geometry,
    material
  )
}

function createOceanParticles() {
  const geometry =
    new THREE.BufferGeometry()

  const positions =
    new Float32Array(
      EARTH.oceanParticleCount * 3
    )

  const startPositions =
    new Float32Array(
      EARTH.oceanParticleCount * 3
    )

  for (
    let i = 0;
    i < EARTH.oceanParticleCount;
    i++
  ) {
    const phi = Math.acos(
      1 -
        (2 * (i + 0.5)) /
          EARTH.oceanParticleCount
    )

    const theta =
      Math.PI *
      (1 + Math.sqrt(5)) *
      i

    const sinPhi =
      Math.sin(phi)

    const index = i * 3

    positions[index] =
      EARTH.radius *
      sinPhi *
      Math.cos(theta)

    positions[index + 1] =
      EARTH.radius *
      Math.cos(phi)

    positions[index + 2] =
      EARTH.radius *
      sinPhi *
      Math.sin(theta)

    startPositions[index] =
      (Math.random() - 0.5) * 8

    startPositions[index + 1] =
      (Math.random() - 0.5) * 8

    startPositions[index + 2] =
      (Math.random() - 0.5) * 8
  }

  geometry.setAttribute(
    'position',
    new THREE.BufferAttribute(
      positions,
      3
    )
  )

  geometry.setAttribute(
    'aStartPosition',
    new THREE.BufferAttribute(
      startPositions,
      3
    )
  )

  const material =
    new THREE.ShaderMaterial({
      vertexShader:
        oceanVertexShader,

      fragmentShader:
        oceanFragmentShader,

      uniforms: {
        uProgress: {
          value: 0,
        },
      },

      transparent: true,
      depthWrite: false,

      blending:
        THREE.AdditiveBlending,
    })

  return {
    points:
      new THREE.Points(
        geometry,
        material
      ),
    material,
  }
}

function createParticleEarth() {
  const geometry =
    new THREE.BufferGeometry()

  const positions =
    new Float32Array(
      EARTH.particleCount * 3
    )

  const startPositions =
    new Float32Array(
      EARTH.particleCount * 3
    )

  const uvs =
    new Float32Array(
      EARTH.particleCount * 2
    )

  for (
    let i = 0;
    i < EARTH.particleCount;
    i++
  ) {
    const phi = Math.acos(
      1 -
        (2 * (i + 0.5)) /
          EARTH.particleCount
    )

    const theta =
      Math.PI *
      (1 + Math.sqrt(5)) *
      i

    const sinPhi =
      Math.sin(phi)

    const x =
      EARTH.radius *
      sinPhi *
      Math.cos(theta)

    const y =
      EARTH.radius *
      Math.cos(phi)

    const z =
      EARTH.radius *
      sinPhi *
      Math.sin(theta)

    const index = i * 3
    const uvIndex = i * 2

    positions[index] = x
    positions[index + 1] = y
    positions[index + 2] = z

    startPositions[index] =
      (Math.random() - 0.5) * 8

    startPositions[index + 1] =
      (Math.random() - 0.5) * 8

    startPositions[index + 2] =
      (Math.random() - 0.5) * 8

    const latitude =
      Math.asin(
        y / EARTH.radius
      )

    const longitude =
      Math.atan2(x, z)

    uvs[uvIndex] =
      longitude /
        (Math.PI * 2) +
      0.5

    uvs[uvIndex + 1] =
      0.5 -
      latitude / Math.PI
  }

  geometry.setAttribute(
    'position',
    new THREE.BufferAttribute(
      positions,
      3
    )
  )

  geometry.setAttribute(
    'aStartPosition',
    new THREE.BufferAttribute(
      startPositions,
      3
    )
  )

  geometry.setAttribute(
    'aUv',
    new THREE.BufferAttribute(
      uvs,
      2
    )
  )

  const textureLoader =
    new THREE.TextureLoader()

  const texture =
    textureLoader.load(
      '/earth-map.jpg'
    )

  texture.flipY = false
  texture.colorSpace =
    THREE.NoColorSpace

  const material =
    new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,

      uniforms: {
        uMap: {
          value: texture,
        },

        uProgress: {
          value: 0,
        },
      },

      transparent: true,
      depthWrite: false,

      blending:
        THREE.AdditiveBlending,
    })

  const earth =
    new THREE.Points(
      geometry,
      material
    )

  const ocean =
    createOceanParticles()

  earth.add(
    ocean.points
  )

  const grid =
    createGridParticles()

  earth.add(grid)

  const startTime =
    performance.now()

  const animateFormation = () => {
    const elapsed =
      performance.now() -
      startTime

    const progress =
      Math.min(
        elapsed /
          EARTH.formationDuration,
        1
      )

    material.uniforms.uProgress.value =
      progress

    ocean.material.uniforms.uProgress.value =
      progress

    if (progress < 1) {
      requestAnimationFrame(
        animateFormation
      )
    }
  }

  animateFormation()

  const rotationAxis =
    new THREE.Vector3(
      0.4,
      1,
      0
    ).normalize()

  const rotate = () => {
    earth.rotateOnAxis(
      rotationAxis,
      EARTH.rotationSpeed
    )

    requestAnimationFrame(
      rotate
    )
  }

  rotate()

  return earth
}

export default createParticleEarth