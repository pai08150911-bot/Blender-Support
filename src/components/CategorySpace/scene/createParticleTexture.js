import * as THREE from 'three'

function createParticleTexture() {
  const svg = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
    >
      <circle
        cx="32"
        cy="32"
        r="30"
        fill="white"
      />
    </svg>
  `

  return new THREE.TextureLoader().load(
    `data:image/svg+xml,${encodeURIComponent(svg)}`
  )
}

export default createParticleTexture