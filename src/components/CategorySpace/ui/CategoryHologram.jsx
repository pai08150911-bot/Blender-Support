function CategoryHologram({
  hologramRef,
  titleRef,
  infoRef,
  imageRef,
  buttonRef,
  pageButtonRef,
}) {
  return (
    <div
      ref={hologramRef}
      className="
        pointer-events-none
        absolute
        z-20
        h-0
        w-0
        opacity-0
        transition-opacity
        duration-300
        ease-out
      "
    >
      <div
        className="
          hologram-title
          pointer-events-none
          absolute
        "
      >
        <div
          className="
            hologram-title-label
            mb-1
            font-mono
            text-[8px]
            tracking-[0.32em]
            text-cyan-300/70
            sm:text-[10px]
          "
        >
          CATEGORY
        </div>

        <div
          ref={titleRef}
          className="
            hologram-title-text
            whitespace-nowrap
            font-mono
            text-lg
            font-bold
            tracking-[0.18em]
            text-cyan-100
            sm:text-xl
          "
        />
      </div>

      <div
        className="
          holo-panel
          hologram-image-panel
          absolute
          top-1/2
          overflow-hidden
        "
      >
        <div className="holo-scan" />

        <div
          className="
            hologram-image-header
            relative
            z-[1]
            mb-3
            font-mono
            text-[9px]
            tracking-[0.25em]
            text-cyan-200
            sm:text-xs
          "
        >
          VISUAL DATA
        </div>

        <div className="hologram-image-frame">
          <img
            ref={imageRef}
            src=""
            alt=""
            className="
              aspect-video
              block
              w-full
              object-cover
              opacity-90
            "
          />
        </div>

        <div
          className="
            hologram-image-footer
            relative
            z-[1]
            flex
            items-center
            justify-between
            font-mono
          "
        >
          <span>
            CATEGORY VISUAL
          </span>

          <span>
            REFERENCE DATA
          </span>
        </div>
      </div>

      <div
        className="
          holo-panel
          hologram-info-panel
          absolute
          top-1/2
        "
      >
        <div className="holo-scan" />

        <div
          className="
            hologram-info-content
            relative
            z-[1]
          "
        >
          <div
            className="
              mb-4
              font-mono
              text-[9px]
              tracking-[0.25em]
              text-cyan-200
              sm:text-xs
            "
          >
            FIELD DATA
          </div>

          <p
            ref={infoRef}
            className="
              font-mono
              text-[11px]
              leading-relaxed
              text-cyan-50
              sm:text-sm
            "
          />
        </div>
      </div>

      <div
        className="
          hologram-action-area
          pointer-events-none
          absolute
          left-1/2
        "
      >
        <button
          ref={buttonRef}
          type="button"
          className="
            hologram-expand-button
            pointer-events-auto
            flex
            items-center
            justify-center
            gap-3
            whitespace-nowrap
            font-mono
            text-sm
            font-bold
            tracking-[0.14em]
            sm:text-base
          "
        >
          <span
            className="
              hologram-expand-button-icon
              text-lg
              leading-none
            "
          >
            ▶
          </span>

          <span>
            拡大
          </span>
        </button>

        <a
          ref={pageButtonRef}
          href="#"
          className="
            hologram-page-button
            pointer-events-auto
            hidden
            items-center
            justify-center
            gap-3
            whitespace-nowrap
            font-mono
            text-sm
            font-bold
            tracking-[0.14em]
            sm:text-base
          "
        >
          <span
            className="
              hologram-page-button-icon
              text-lg
              leading-none
            "
          >
            ▶
          </span>

          <span>
            ページへ移動
          </span>
        </a>
      </div>
    </div>
  )
}

export default CategoryHologram