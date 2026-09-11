import * as THREE from 'three'

import {
  PARTICLE_SPHERE,
} from '../config/categorySpaceConfig'

function hash(
  index,
  salt = 0
) {
  const value =
    Math.sin(
      (
        index +
        1
      ) *
        12.9898 +
        (
          salt +
          1
        ) *
          78.233
    ) *
    43758.5453

  return (
    value -
    Math.floor(
      value
    )
  )
}

function angularDistance(
  first,
  second
) {
  return Math.abs(
    Math.atan2(
      Math.sin(
        first -
          second
      ),
      Math.cos(
        first -
          second
      )
    )
  )
}

function createPalette(
  palette
) {
  return palette.map(
    (color) =>
      new THREE.Color(
        color
      )
  )
}

function samplePalette(
  palette,
  value
) {
  const clamped =
    THREE.MathUtils.clamp(
      value,
      0,
      1
    )

  const position =
    clamped *
    (
      palette.length -
      1
    )

  const lowerIndex =
    Math.floor(
      position
    )

  const upperIndex =
    Math.min(
      lowerIndex + 1,
      palette.length - 1
    )

  const mix =
    position -
    lowerIndex

  return palette[
    lowerIndex
  ]
    .clone()
    .lerp(
      palette[
        upperIndex
      ],
      mix
    )
}

function getBodyColor(
  style,
  palette,
  normalizedY,
  theta,
  index
) {
  const randomA =
    hash(
      index,
      8
    )

  const randomB =
    hash(
      index,
      13
    )

  let value =
    randomA

  switch (
    style.type
  ) {
    case 'sun': {
      value =
        0.5 +
        0.5 *
          Math.sin(
            theta *
              5 +
            normalizedY *
              9 +
            randomA *
              2.2
          )

      if (
        randomB >
        0.91
      ) {
        value = 1
      }

      break
    }

    case 'venus': {
      value =
        0.5 +
        0.42 *
          Math.sin(
            normalizedY *
              14 +
            theta *
              0.65
          )

      value +=
        (
          randomA -
          0.5
        ) *
        0.14

      break
    }

    case 'mars': {
      value =
        0.48 +
        randomA *
          0.42

      if (
        randomB >
        0.76
      ) {
        value *=
          0.28
      }

      break
    }

    case 'earth': {
      const landPattern =
        Math.sin(
          theta *
            3.2 +
          normalizedY *
            7
        ) +
        Math.sin(
          theta *
            6.5 -
          normalizedY *
            4
        )

      value =
        landPattern >
        0.3
          ? 0.25 +
            randomA *
              0.45
          : 0.72 +
            randomA *
              0.28

      break
    }

    case 'mercury': {
      value =
        0.28 +
        randomA *
          0.58

      if (
        randomB >
        0.82
      ) {
        value *=
          0.24
      }

      break
    }

    case 'jupiter': {
      const band =
        0.5 +
        0.46 *
          Math.sin(
            normalizedY *
              23 +
            Math.sin(
              theta *
                2
            ) *
              0.6
          )

      const isStorm =
        normalizedY >
          -0.32 &&
        normalizedY <
          -0.08 &&
        angularDistance(
          theta,
          0.45
        ) <
          0.48

      if (
        isStorm
      ) {
        return new THREE.Color(
          style.stormColor
        )
      }

      value =
        band +
        (
          randomA -
          0.5
        ) *
          0.12

      break
    }

    case 'saturn': {
      value =
        0.48 +
        0.32 *
          Math.sin(
            normalizedY *
              17
          ) +
        (
          randomA -
          0.5
        ) *
          0.08

      break
    }

    default:
      break
  }

  return samplePalette(
    palette,
    value
  )
}

function pushPoint(
  positions,
  colors,
  x,
  y,
  z,
  color
) {
  positions.push(
    x,
    y,
    z
  )

  colors.push(
    color.r,
    color.g,
    color.b
  )
}

function createBody(
  style,
  positions,
  colors
) {
  const palette =
    createPalette(
      style.palette
    )

  const count =
    style.bodyCount ??
    PARTICLE_SPHERE.particleCount

  const radius =
    PARTICLE_SPHERE.radius *
    (
      style.radiusScale ??
      1
    )

  const yScale =
    style.yScale ??
    1

  const noise =
    style.surfaceNoise ??
    0

  for (
    let index = 0;
    index < count;
    index += 1
  ) {
    const theta =
      hash(
        index,
        1
      ) *
      Math.PI *
      2

    const vertical =
      hash(
        index,
        2
      ) *
        2 -
      1

    const phi =
      Math.acos(
        vertical
      )

    const sinPhi =
      Math.sin(
        phi
      )

    const radiusOffset =
      1 +
      (
        hash(
          index,
          3
        ) -
        0.5
      ) *
        noise

    const currentRadius =
      radius *
      radiusOffset

    const x =
      currentRadius *
      sinPhi *
      Math.cos(
        theta
      )

    const y =
      currentRadius *
      Math.cos(
        phi
      ) *
      yScale

    const z =
      currentRadius *
      sinPhi *
      Math.sin(
        theta
      )

    const color =
      getBodyColor(
        style,
        palette,
        vertical,
        theta,
        index
      )

    pushPoint(
      positions,
      colors,
      x,
      y,
      z,
      color
    )
  }

  return count
}

function createCorona(
  style,
  positions,
  colors
) {
  if (
    !style.corona
  ) {
    return
  }

  const palette =
    createPalette(
      style.corona
        .colors
    )

  const {
    count,
    minRadius,
    maxRadius,
  } =
    style.corona

  for (
    let index = 0;
    index < count;
    index += 1
  ) {
    const theta =
      hash(
        index,
        21
      ) *
      Math.PI *
      2

    const vertical =
      hash(
        index,
        22
      ) *
        2 -
      1

    const phi =
      Math.acos(
        vertical
      )

    const sinPhi =
      Math.sin(
        phi
      )

    const radius =
      THREE.MathUtils.lerp(
        minRadius,
        maxRadius,
        Math.pow(
          hash(
            index,
            23
          ),
          2
        )
      )

    const color =
      samplePalette(
        palette,
        hash(
          index,
          24
        )
      )

    pushPoint(
      positions,
      colors,

      radius *
        sinPhi *
        Math.cos(
          theta
        ),

      radius *
        Math.cos(
          phi
        ),

      radius *
        sinPhi *
        Math.sin(
          theta
        ),

      color
    )
  }
}

function createRing(
  style,
  positions,
  colors
) {
  if (
    !style.ring
  ) {
    return
  }

  const ring =
    style.ring

  const palette =
    createPalette(
      ring.colors
    )

  const tilt =
    ring.tilt ??
    0

  for (
    let index = 0;
    index < ring.count;
    index += 1
  ) {
    const angle =
      hash(
        index,
        31
      ) *
      Math.PI *
      2

    const radius =
      THREE.MathUtils.lerp(
        ring.innerRadius,
        ring.outerRadius,
        hash(
          index,
          32
        )
      )

    const x =
      Math.cos(
        angle
      ) *
      radius

    const baseY =
      (
        hash(
          index,
          33
        ) -
        0.5
      ) *
      ring.thickness

    const baseZ =
      Math.sin(
        angle
      ) *
      radius

    const y =
      baseY *
        Math.cos(
          tilt
        ) -
      baseZ *
        Math.sin(
          tilt
        )

    const z =
      baseY *
        Math.sin(
          tilt
        ) +
      baseZ *
        Math.cos(
          tilt
        )

    const color =
      samplePalette(
        palette,
        hash(
          index,
          34
        )
      )

    pushPoint(
      positions,
      colors,
      x,
      y,
      z,
      color
    )
  }
}

export default function createPlanetParticleData(
  style
) {
  const positions = []

  const colors = []

  const bodyCount =
    createBody(
      style,
      positions,
      colors
    )

  createCorona(
    style,
    positions,
    colors
  )

  createRing(
    style,
    positions,
    colors
  )

  return {
    positions:
      new Float32Array(
        positions
      ),

    colors:
      new Float32Array(
        colors
      ),

    bodyCount,

    particleCount:
      positions.length /
      3,
  }
}