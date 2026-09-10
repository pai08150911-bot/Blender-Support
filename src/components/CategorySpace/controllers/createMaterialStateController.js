export default function createMaterialStateController({
  earth,
  categoryObjects,
  ringMaterials,
}) {
  const captureMaterialStates =
    (object) => {
      const states = []

      const found =
        new Set()

      object.traverse(
        (child) => {
          if (
            !child.material
          ) {
            return
          }

          const materials =
            Array.isArray(
              child.material
            )
              ? child.material
              : [
                  child.material,
                ]

          materials.forEach(
            (material) => {
              if (
                !material ||
                found.has(
                  material
                )
              ) {
                return
              }

              found.add(
                material
              )

              states.push({
                material,

                opacity:
                  typeof material.opacity ===
                  'number'
                    ? material.opacity
                    : 1,
              })
            }
          )
        }
      )

      return states
    }

  const earthMaterialStates =
    captureMaterialStates(
      earth
    )

  const categoryMaterialStates =
    categoryObjects.map(
      (object) =>
        captureMaterialStates(
          object
        )
    )

  const ringMaterialStates =
    ringMaterials.map(
      (material) => ({
        material,

        opacity:
          typeof material.opacity ===
          'number'
            ? material.opacity
            : 1,
      })
    )

  const setMaterialOpacity =
    (
      states,
      factor
    ) => {
      states.forEach(
        ({
          material,
          opacity,
        }) => {
          material.opacity =
            opacity * factor
        }
      )
    }

  return {
    earthMaterialStates,
    categoryMaterialStates,
    ringMaterialStates,
    setMaterialOpacity,
  }
}