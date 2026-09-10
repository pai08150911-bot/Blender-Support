import * as THREE from 'three'
import {
  CONNECTION,
  ORBIT,
} from './categorySpaceConfig'
import {
  CATEGORIES,
} from './categoryData'

function createOrbitRing(
  orbitGroup,
  particleTexture
) {
  const ringGeometries = []
  const ringMaterials = []

  const particleColors = [
    new THREE.Color(0xffffff),
    new THREE.Color(0xd8edff),
    new THREE.Color(0x8ec5ff),
    new THREE.Color(0x63b4f5),
  ]

  CONNECTION.layerOffsets.forEach(
    (
      radiusOffset,
      layerIndex
    ) => {
      const ringGeometry =
        new THREE.BufferGeometry()

      const ringPositions = []
      const ringSizes = []
      const ringOpacities = []
      const ringColors = []

      for (
        let categoryIndex = 0;
        categoryIndex <
        CATEGORIES.length;
        categoryIndex += 1
      ) {
        const startAngle =
          (categoryIndex /
            CATEGORIES.length) *
          Math.PI *
          2

        const endAngle =
          ((categoryIndex + 1) /
            CATEGORIES.length) *
          Math.PI *
          2

        for (
          let particleIndex = 0;
          particleIndex <
          CONNECTION.particleCount;
          particleIndex += 1
        ) {
          const progress =
            (particleIndex + 1) /
            (
              CONNECTION.particleCount +
              1
            )

          const angle =
            THREE.MathUtils.lerp(
              startAngle,
              endAngle,
              progress
            )

          const radius =
            ORBIT.radius +
            radiusOffset

          ringPositions.push(
            Math.cos(angle) *
              radius,
            0,
            Math.sin(angle) *
              radius
          )

          ringSizes.push(
            THREE.MathUtils.randFloat(
              CONNECTION.particleSizeMin,
              CONNECTION.particleSizeMax
            )
          )

          const layerOpacity =
            layerIndex === 1
              ? 1
              : 0.85

          ringOpacities.push(
            THREE.MathUtils.randFloat(
              CONNECTION.opacityMin,
              CONNECTION.opacityMax
            ) *
              layerOpacity
          )

          const colorIndex =
            THREE.MathUtils.randInt(
              0,
              particleColors.length -
                1
            )

          const color =
            particleColors[
              colorIndex
            ]

          ringColors.push(
            color.r,
            color.g,
            color.b
          )
        }
      }

      ringGeometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(
          ringPositions,
          3
        )
      )

      ringGeometry.setAttribute(
        'aSize',
        new THREE.Float32BufferAttribute(
          ringSizes,
          1
        )
      )

      ringGeometry.setAttribute(
        'aOpacity',
        new THREE.Float32BufferAttribute(
          ringOpacities,
          1
        )
      )

      ringGeometry.setAttribute(
        'aColor',
        new THREE.Float32BufferAttribute(
          ringColors,
          3
        )
      )

      const ringMaterial =
        new THREE.ShaderMaterial({
          uniforms: {
            uTexture: {
              value:
                particleTexture,
            },
          },

          vertexShader: `
            attribute float aSize;
            attribute float aOpacity;
            attribute vec3 aColor;

            varying float vOpacity;
            varying vec3 vColor;

            void main() {
              vOpacity = aOpacity;
              vColor = aColor;

              vec4 modelPosition =
                modelViewMatrix *
                vec4(position, 1.0);

              gl_Position =
                projectionMatrix *
                modelPosition;

              gl_PointSize =
                aSize *
                100.0 /
                -modelPosition.z;
            }
          `,

          fragmentShader: `
            uniform sampler2D uTexture;

            varying float vOpacity;
            varying vec3 vColor;

            void main() {
              vec4 textureColor =
                texture2D(
                  uTexture,
                  gl_PointCoord
                );

              if (
                textureColor.a <
                0.01
              ) {
                discard;
              }

              float distance =
                length(
                  gl_PointCoord -
                  vec2(0.5)
                );

              float glow =
                1.0 -
                smoothstep(
                  0.15,
                  0.5,
                  distance
                );

              gl_FragColor =
                vec4(
                  vColor,
                  textureColor.a *
                  vOpacity *
                  (
                    0.8 +
                    glow * 0.2
                  )
                );
            }
          `,

          transparent: true,
          depthWrite: false,
          blending:
            THREE.AdditiveBlending,
        })

      const ring =
        new THREE.Points(
          ringGeometry,
          ringMaterial
        )

      orbitGroup.add(ring)

      ringGeometries.push(
        ringGeometry
      )

      ringMaterials.push(
        ringMaterial
      )
    }
  )

  return {
    ringGeometries,
    ringMaterials,
  }
}

export default createOrbitRing