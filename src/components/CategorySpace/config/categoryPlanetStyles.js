const CATEGORY_PLANET_STYLES = {
  MATERIAL: {
    type: 'sun',

    palette: [
      '#ff3b16',
      '#ff7417',
      '#ffad22',
      '#ffd95c',
      '#fff1ad',
    ],

    bodyCount: 1050,

    radiusScale: 0.92,

    surfaceNoise: 0.075,

    particleSize: 1.15,

    opacity: 0.96,

    yScale: 1,

    corona: {
      count: 260,

      minRadius: 1.04,

      maxRadius: 1.3,

      colors: [
        '#ff7417',
        '#ffd95c',
        '#fff4bd',
      ],
    },

    motion: {
      rotationY: 0.18,

      rotationX: 0.025,

      sparkleAmplitude: 0.9,

      sparkleSpeed: 5.2,
    },
  },

  SCULPT: {
    type: 'venus',

    palette: [
      '#8f6812',
      '#c49320',
      '#f0c84e',
      '#ffe88a',
      '#fff2bd',
    ],

    bodyCount: 950,

    radiusScale: 1,

    surfaceNoise: 0.025,

    particleSize: 1,

    opacity: 0.92,

    yScale: 0.98,

    motion: {
      rotationY: 0.07,

      rotationX: 0.008,

      sparkleAmplitude: 0.38,

      sparkleSpeed: 3,
    },
  },

  SHADER: {
    type: 'mars',

    palette: [
      '#642415',
      '#9d3417',
      '#d54c1d',
      '#ff7024',
      '#ff9b4a',
    ],

    bodyCount: 930,

    radiusScale: 0.96,

    surfaceNoise: 0.055,

    particleSize: 1,

    opacity: 0.92,

    yScale: 0.99,

    motion: {
      rotationY: 0.13,

      rotationX: 0.012,

      sparkleAmplitude: 0.42,

      sparkleSpeed: 3.6,
    },
  },

  MODIFIER: {
    type: 'earth',

    palette: [
      '#075f50',
      '#0a8b66',
      '#25bd72',
      '#67e59c',
      '#41cfe0',
    ],

    bodyCount: 980,

    radiusScale: 1,

    surfaceNoise: 0.04,

    particleSize: 1,

    opacity: 0.92,

    yScale: 1,

    motion: {
      rotationY: 0.14,

      rotationX: 0.01,

      sparkleAmplitude: 0.55,

      sparkleSpeed: 4,
    },
  },

  ANIMATION: {
    type: 'mercury',

    palette: [
      '#16436d',
      '#28669c',
      '#4d91c7',
      '#83c6e7',
      '#c5e8f7',
    ],

    bodyCount: 860,

    radiusScale: 0.88,

    surfaceNoise: 0.085,

    particleSize: 0.95,

    opacity: 0.9,

    yScale: 1,

    motion: {
      rotationY: 0.2,

      rotationX: 0.018,

      sparkleAmplitude: 0.7,

      sparkleSpeed: 4.8,
    },
  },

  TEXTURE: {
    type: 'jupiter',

    palette: [
      '#401738',
      '#70204e',
      '#a83365',
      '#d35b79',
      '#e99087',
      '#efd0b3',
    ],

    bodyCount: 1150,

    radiusScale: 1.08,

    surfaceNoise: 0.018,

    particleSize: 1.02,

    opacity: 0.94,

    yScale: 0.88,

    stormColor:
      '#ff8f78',

    motion: {
      rotationY: 0.24,

      rotationX: 0,

      sparkleAmplitude: 0.38,

      sparkleSpeed: 3.5,
    },
  },

  LIGHTING: {
    type: 'saturn',

    palette: [
      '#482b68',
      '#704590',
      '#a16ac2',
      '#c89ddb',
      '#e1c9ec',
    ],

    bodyCount: 900,

    radiusScale: 0.94,

    surfaceNoise: 0.018,

    particleSize: 0.95,

    opacity: 0.92,

    yScale: 0.9,

    ring: {
      count: 520,

      innerRadius: 1.22,

      outerRadius: 1.82,

      thickness: 0.025,

      tilt: 0.32,

      colors: [
        '#6b4a8a',
        '#9e76bc',
        '#d5bce5',
      ],
    },

    motion: {
      rotationY: 0.1,

      rotationX: 0.01,

      sparkleAmplitude: 0.62,

      sparkleSpeed: 4.2,
    },
  },
}

export default CATEGORY_PLANET_STYLES