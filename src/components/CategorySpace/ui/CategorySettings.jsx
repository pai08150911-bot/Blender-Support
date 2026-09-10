import '../styles/CategorySettings.css'

function SettingToggle({
  label,
  description,
  checked,
  onChange,
}) {
  return (
    <div className="category-setting-row">
      <div className="category-setting-text">
        <p className="category-setting-label">
          {label}
        </p>

        <p className="category-setting-description">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        className={`
          category-setting-toggle
          ${
            checked
              ? 'category-setting-toggle-active'
              : ''
          }
        `}
        onClick={() =>
          onChange(!checked)
        }
      >
        <span className="category-setting-toggle-knob" />
      </button>
    </div>
  )
}

function CategorySettings({
  isOpen,
  settings,
  onOpenChange,
  onSettingChange,
}) {
  return (
    <>
      <button
        type="button"
        className="category-settings-button"
        aria-label="設定を開く"
        onClick={() =>
          onOpenChange(true)
        }
      >
        ⚙
      </button>

      {isOpen && (
        <div
          className="category-settings-backdrop"
          onPointerDown={() =>
            onOpenChange(false)
          }
        >
          <section
            className="
              holo-panel
              category-settings-panel
            "
            onPointerDown={(
              event
            ) =>
              event.stopPropagation()
            }
          >
            <div className="holo-scan" />

            <div className="category-settings-header">
              <div>
                <p className="category-settings-system">
                  SYSTEM CONTROL
                </p>

                <h2 className="category-settings-title">
                  SETTINGS
                </h2>
              </div>

              <button
                type="button"
                className="category-settings-close"
                aria-label="設定を閉じる"
                onClick={() =>
                  onOpenChange(false)
                }
              >
                ×
              </button>
            </div>

            <div className="category-settings-content">
              <SettingToggle
                label="自動回転"
                description="カテゴリー空間の自動回転を切り替えます。"
                checked={
                  settings.autoRotate
                }
                onChange={(
                  value
                ) =>
                  onSettingChange(
                    'autoRotate',
                    value
                  )
                }
              />

              <SettingToggle
                label="ロード演出を省略"
                description="粒子地球の形成アニメーションを省略します。"
                checked={
                  settings.skipEarthAnimation
                }
                onChange={(
                  value
                ) =>
                  onSettingChange(
                    'skipEarthAnimation',
                    value
                  )
                }
              />

              <SettingToggle
                label="作業用軽量化"
                description="装飾アニメーションなどを停止し、描画負荷を抑えます。"
                checked={
                  settings.performanceMode
                }
                onChange={(
                  value
                ) =>
                  onSettingChange(
                    'performanceMode',
                    value
                  )
                }
              />
            </div>
          </section>
        </div>
      )}
    </>
  )
}

export default CategorySettings