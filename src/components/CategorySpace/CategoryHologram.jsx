function CategoryHologram({
  hologramRef,
  infoRef,
  imageRef,
  buttonRef,
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
        transition-all
        duration-300
        ease-out
      "
    >
      <div
        className="
          holo-panel
          absolute
          right-[220px]
          top-1/2
          w-[min(44vw,440px)]
          -translate-y-1/2
          p-5
          sm:right-[260px]
          sm:p-6
        "
      >
        <div className="holo-scan" />

        <div
          className="
            mb-3
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

      <div
        className="
          holo-panel
          absolute
          left-[180px]
          top-1/2
          w-[min(44vw,420px)]
          -translate-y-1/2
          overflow-hidden
          p-4
          sm:left-[210px]
          sm:p-5
        "
      >
        <div className="holo-scan" />

        <img
          ref={imageRef}
          src=""
          alt=""
          className="
            aspect-video
            w-full
            object-cover
            opacity-80
          "
        />
      </div>

      <a
        ref={buttonRef}
        href="#"
        className="
          pointer-events-auto
          absolute
          left-1/2
          top-8
          flex
          -translate-x-1/2
          translate-y-full
          flex-row
          items-center
          gap-2
          whitespace-nowrap
          font-mono
          text-sm
          font-semibold
          tracking-[0.12em]
          text-cyan-200
          transition
          hover:text-white
          sm:top-10
          sm:gap-3
          sm:text-base
        "
      >
        <span
          className="
            text-xl
            leading-none
            sm:text-2xl
          "
        >
          △
        </span>

        <span>
          ページに移動
        </span>
      </a>
    </div>
  )
}

export default CategoryHologram