
>ファイル全体責任一覧


CategorySpace.jsx => Three.jsシーン全体・カメラ・操作・クリック・ドラッグ・スナップ・自動回転・ホログラム表示制御・animation loop・cleanup

ParticleEarth.jsx => Particle Earthの生成・形成アニメーション・海・グリッド・回転

CategoryHologram.jsx => 概要・画像・ページ移動ボタンのHTML/JSXと配置

CategorySpace.css => ホログラムの枠・発光・走査線・ノイズなどのデザイン

categorySpaceConfig.js => Category Space全体の調整用数値

categoryData.js => MATERIALなど7カテゴリーの名前・色・説明・画像・リンク

createParticleTexture.js => 共通Particle Texture

createParticleSphere.js => 7カテゴリーのParticle Sphere生成

createStarField.js => 背景の星空生成

createOrbitRing.js => カテゴリー同士をつなぐParticle Ring生成

<!-- ---------------------------------- - ---------------------------------- -->

>宇宙・星空(categorySpaceConfig.js)


SPACE.starCount => 背景に表示する星の数。大きくすると星が増える ：components/CategorySpace/categorySpaceConfig.js

SPACE.starSize => 背景の星1粒の大きさ ：components/CategorySpace/categorySpaceConfig.js

SPACE.starColor => 背景の星の基本色 ：components/CategorySpace/categorySpaceConfig.js

SPACE.starDepth => 星空が配置される空間の広さ。大きくすると星がより広い範囲に散らばる ：components/CategorySpace/categorySpaceConfig.js

SPACE.moveX => マウスを左右に動かしたときの星空の移動量 ：components/CategorySpace/categorySpaceConfig.js

SPACE.moveY => マウスを上下に動かしたときの星空の移動量 ：components/CategorySpace/categorySpaceConfig.js

SPACE.rotationSpeed => 星空とCategory Spaceの自動回転速度。大きくすると速くなる ：components/CategorySpace/categorySpaceConfig.js

SPACE.twinkleSpeed => 星空の明滅速度。大きくすると明滅が速くなる ：components/CategorySpace/categorySpaceConfig.js

<!-- ---------------------------------- - ---------------------------------- -->

>カテゴリーの軌道(categorySpaceConfig.js)


ORBIT.radius => 7個のカテゴリーが回る円の半径。大きくするとカテゴリー同士の間隔も広がる ：components/CategorySpace/categorySpaceConfig.js

ORBIT.tilt => カテゴリーの軌道をどれくらい傾けるか。degToRad(8) の8が角度 ：components/CategorySpace/categorySpaceConfig.js

ORBIT.objectScale => MATERIALなどの粒子球全体の大きさ ：components/CategorySpace/categorySpaceConfig.js

ORBIT.dragSensitivity => マウスドラッグに対して軌道がどれくらい回転するか ：components/CategorySpace/categorySpaceConfig.js

ORBIT.maxDragStep => 1回のマウス移動で回転できる最大量。急激な回転を抑える ：components/CategorySpace/categorySpaceConfig.js

ORBIT.snapSpeed => カテゴリーを中央へ自動移動させる速度 ：components/CategorySpace/categorySpaceConfig.js

ORBIT.pauseDuration => スナップ完了後、自動回転を再開するまでの停止時間。単位はms ：components/CategorySpace/categorySpaceConfig.js

ORBIT.centerThreshold => カテゴリーを「中央にいる」と判断する角度範囲 ：components/CategorySpace/categorySpaceConfig.js

ORBIT.frontCategoryCount => 操作可能な前方カテゴリー数。現在は中央・左・右の3個 ：components/CategorySpace/categorySpaceConfig.js

<!-- ---------------------------------- - ---------------------------------- -->

>カメラ(categorySpaceConfig.js)


CAMERA.normalY => 通常状態のカメラの上下位置 ：components/CategorySpace/categorySpaceConfig.js

CAMERA.normalZ => 通常状態のカメラ距離。大きくすると3D空間から離れる ：components/CategorySpace/categorySpaceConfig.js

CAMERA.introZ => Particle Earth生成開始時のカメラ距離 ：components/CategorySpace/categorySpaceConfig.js

CAMERA.topY => ドラッグ操作時にカメラが上方向へ移動できる量 ：components/CategorySpace/categorySpaceConfig.js

CAMERA.topZ => ドラッグ操作時のカメラ距離 ：components/CategorySpace/categorySpaceConfig.js

CAMERA.focusY => カテゴリーをフォーカスしたときのカメラ上下位置 ：components/CategorySpace/categorySpaceConfig.js

CAMERA.focusZ => カテゴリーをフォーカスしたときのカメラ距離。小さくすると対象へ近づく ：components/CategorySpace/categorySpaceConfig.js

CAMERA.transitionSpeed => 通常・ドラッグ・フォーカス状態を切り替えるときのカメラ移動速度 ：components/CategorySpace/categorySpaceConfig.js

<!-- ---------------------------------- - ---------------------------------- -->

>カテゴリー粒子球(categorySpaceConfig.js / createParticleSphere.js)


PARTICLE_SPHERE.particleCount => 1個のカテゴリー球体を構成する粒子数 ：components/CategorySpace/categorySpaceConfig.js

PARTICLE_SPHERE.radius => 粒子球そのものの基本半径 ：components/CategorySpace/categorySpaceConfig.js

PARTICLE_SPHERE.size => カテゴリー球を構成する1粒の大きさ ：components/CategorySpace/categorySpaceConfig.js

PARTICLE_SPHERE.opacity => カテゴリー粒子の透明度。1に近いほど濃くなる ：components/CategorySpace/categorySpaceConfig.js

THREE.AdditiveBlending => 粒子同士が重なった部分を発光しているように見せる合成方法 ：components/CategorySpace/createParticleSphere.js
通常の透明表現などへ変更すると見た目が大きく変わるため、変更時はblendingを確認する

<!-- ---------------------------------- - ---------------------------------- -->

>カテゴリー情報(categoryData.js)


CATEGORIES[].name => MATERIAL / SCULPTなどのカテゴリー名 ：components/CategorySpace/categoryData.js

CATEGORIES[].color => 各カテゴリー粒子球の色 ：components/CategorySpace/categoryData.js

CATEGORIES[].description => ホログラム左側に表示する説明文 ：components/CategorySpace/categoryData.js

CATEGORIES[].image => ホログラム右側に表示する画像 ：components/CategorySpace/categoryData.js

CATEGORIES[].link => 「ページに移動」を押したときの移動先 ：components/CategorySpace/categoryData.js

CATEGORIES => カテゴリーそのものを追加・削除・並び替えできる ：components/CategorySpace/categoryData.js
カテゴリー数を変更すると軌道上の配置も自動的に再計算される

<!-- ---------------------------------- - ---------------------------------- -->


>カテゴリーをつなぐ粒子リング(categorySpaceConfig.js / createOrbitRing.js)


CONNECTION.particleCount => カテゴリーとカテゴリーの間を構成するリング粒子数 ：components/CategorySpace/categorySpaceConfig.js

CONNECTION.particleSizeMin => リング粒子の最小サイズ ：components/CategorySpace/categorySpaceConfig.js

CONNECTION.particleSizeMax => リング粒子の最大サイズ ：components/CategorySpace/categorySpaceConfig.js

CONNECTION.opacityMin => リング粒子の最低透明度 ：components/CategorySpace/categorySpaceConfig.js

CONNECTION.opacityMax => リング粒子の最高透明度 ：components/CategorySpace/categorySpaceConfig.js

CONNECTION.layerOffsets => 3重になっている粒子リングそれぞれの半径差 ：components/CategorySpace/categorySpaceConfig.js

particleColors => リングに使用する白〜青系の色 ：components/CategorySpace/createOrbitRing.js

vertexShader => リング粒子のサイズや3D上での表示方法 ：components/CategorySpace/createOrbitRing.js
gl_PointSize の計算方法を変更すると、カメラとの距離による粒子サイズの変化を調整できる

fragmentShader => リング粒子の発光・透明度・形状 ：components/CategorySpace/createOrbitRing.js
glow・smoothstep周辺を変更すると粒子の発光感を調整できる

<!-- ---------------------------------- - ---------------------------------- -->

>ホログラムの配置(CategoryHologram.jsx)


right-[220px] / sm:right-[260px] => 説明ホログラムと中央カテゴリーとの横方向の距離 ：components/CategorySpace/CategoryHologram.jsx

left-[180px] / sm:left-[210px] => 画像ホログラムと中央カテゴリーとの横方向の距離 ：components/CategorySpace/CategoryHologram.jsx

w-[min(44vw,440px)] => 説明ホログラムの横幅 ：components/CategorySpace/CategoryHologram.jsx

w-[min(44vw,420px)] => 画像ホログラムの横幅 ：components/CategorySpace/CategoryHologram.jsx

top-1/2 + -translate-y-1/2 => 説明・画像ホログラムをカテゴリーの高さ中央に合わせる ：components/CategorySpace/CategoryHologram.jsx

top-8 / sm:top-10 => 「ページに移動」ボタンの上下位置 ：components/CategorySpace/CategoryHologram.jsx

left-1/2 + -translate-x-1/2 => 「ページに移動」ボタンをカテゴリー中央に合わせる ：components/CategorySpace/CategoryHologram.jsx

absolute => ホログラム各パーツを基準点から自由配置する ：components/CategorySpace/CategoryHologram.jsx
relativeへ変更すると配置基準そのものが変わるため、ホログラムの位置調整では基本的にabsoluteを維持する

<!-- ---------------------------------- - ---------------------------------- -->

>ホログラムの文字(CategoryHologram.jsx)


text-[9px] / sm:text-xs => FIELD DATAの文字サイズ ：components/CategorySpace/CategoryHologram.jsx

tracking-[0.25em] => FIELD DATAの文字間隔 ：components/CategorySpace/CategoryHologram.jsx

text-[11px] / sm:text-sm => カテゴリー説明文の文字サイズ ：components/CategorySpace/CategoryHologram.jsx

leading-relaxed => 説明文の行間 ：components/CategorySpace/CategoryHologram.jsx

font-mono => ホログラムUIの機械的な等幅フォント ：components/CategorySpace/CategoryHologram.jsx
別フォントへ変更する場合はfont-monoを変更する

text-sm / sm:text-base => 「ページに移動」の文字サイズ ：components/CategorySpace/CategoryHologram.jsx

<!-- ---------------------------------- - ---------------------------------- -->

>ホログラムのデザイン(CategorySpace.css)


.holo-panel border => ホログラム外枠の色・透明度 ：components/CategorySpace/CategorySpace.css

.holo-panel background => ホログラム内部の背景色・グラデーション ：components/CategorySpace/CategorySpace.css

.holo-panel box-shadow => ホログラム外側・内側の発光 ：components/CategorySpace/CategorySpace.css

.holo-panel clip-path => ホログラムの角を切り落としたSF風の形 ：components/CategorySpace/CategorySpace.css
polygon(...)の形を変更するとパネル自体の輪郭を変更できる

.hologram-focused transform => カテゴリーをフォーカスしたときのホログラム拡大率 ：components/CategorySpace/CategorySpace.css

.holo-panel::before => ホログラム内部にある細い内枠 ：components/CategorySpace/CategorySpace.css

.holo-panel::after => ホログラムを流れる発光ライン ：components/CategorySpace/CategorySpace.css

.holo-scan => パネル全体に表示される細かな走査線 ：components/CategorySpace/CategorySpace.css

@keyframes holoScan => 発光ラインが上から下へ流れる動き ：components/CategorySpace/CategorySpace.css

@keyframes holoNoise => ホログラムの明るさが細かく乱れるノイズ演出 ：components/CategorySpace/CategorySpace.css

@media (max-width: 640px) => スマートフォン時だけ適用するホログラム設定 ：components/CategorySpace/CategorySpace.css

<!-- ---------------------------------- - ---------------------------------- -->

>ホログラムの表示条件(CategorySpace.jsx)


showDistance => 中央付近まで来たカテゴリーのホログラムを表示し始める角度。現在は28度 ：components/CategorySpace/CategorySpace.jsx

hideDistance => 中央から離れたホログラムを非表示にする角度。現在は45度 ：components/CategorySpace/CategorySpace.jsx

showHologram() => 対象カテゴリーの説明・画像・リンクをホログラムへ設定して表示する ：components/CategorySpace/CategorySpace.jsx
ホログラムの「何を表示するか・いつ表示状態にするか」を変更する場合に修正する

hideHologram() => ホログラムを非表示にして表示中カテゴリーを解除する ：components/CategorySpace/CategorySpace.jsx
ホログラムを消す条件や消したときの状態を変更する場合に修正する

setFocus() => フォーカス状態と.hologram-focusedを切り替える ：components/CategorySpace/CategorySpace.jsx
フォーカス時のUI状態を変更するときに修正する

<!-- ---------------------------------- - ---------------------------------- -->

>クリック・操作(CategorySpace.jsx)


raycaster.params.Points.threshold => 粒子球をマウスで判定する当たり判定の広さ ：components/CategorySpace/CategorySpace.jsx

getCategoryFromPointer() => マウス位置からクリック・ホバー対象のカテゴリーを探す ：components/CategorySpace/CategorySpace.jsx
Raycasterによるカテゴリー選択方法そのものを変更する場合に修正する

getFrontCategories() => 中央に近いカテゴリーを距離順に並べ、操作可能な前方カテゴリーを決める ：components/CategorySpace/CategorySpace.jsx
前方だけ操作可能という仕様を変更するときに修正する

isFrontCategory() => マウス対象が操作可能な前方カテゴリーか判定する ：components/CategorySpace/CategorySpace.jsx
後方カテゴリーのクリック・ホバー仕様を変更するときに修正する

handleCategoryClick() => カテゴリークリック時の「中央へスナップ → 中央ならフォーカス」という処理 ：components/CategorySpace/CategorySpace.jsx
クリック時の動作そのものを変更するときに修正する

handlePointerDown() / handlePointerMove() / handlePointerUp() => クリックとドラッグを判定し、軌道を操作する ：components/CategorySpace/CategorySpace.jsx
ドラッグ方法・クリック判定・操作感を変更するときに修正する

<!-- ---------------------------------- - ---------------------------------- -->

>スナップ・自動回転(CategorySpace.jsx)


getCategoryRotation() => 指定カテゴリーが中央に来るために必要な軌道角度を計算する ：components/CategorySpace/CategorySpace.jsx

normalizeAngle() => 回転角度を-π〜π付近へ揃えて、遠回りして回転するのを防ぐ ：components/CategorySpace/CategorySpace.jsx

findNearestCategory() => 現在最も中央に近いカテゴリーを探す ：components/CategorySpace/CategorySpace.jsx

startSnapToCategory() => 指定カテゴリーを中央へ自動移動させるスナップを開始する ：components/CategorySpace/CategorySpace.jsx
スナップ開始時の状態や移動先の決め方を変更するときに修正する

canAutoRotate => 自動回転してよい状態を判定する ：components/CategorySpace/CategorySpace.jsx
ドラッグ中・スナップ中・ホバー中・フォーカス中など、どの状態で自動回転を止めるか変更できる

<!-- ---------------------------------- - ---------------------------------- -->

>Particle Earth(ParticleEarth.jsx)


EARTH.particleCount => 地球本体を構成する粒子数 ：components/CategorySpace/ParticleEarth.jsx

EARTH.oceanParticleCount => 海側の追加粒子数 ：components/CategorySpace/ParticleEarth.jsx

EARTH.radius => Particle Earth全体の大きさ ：components/CategorySpace/ParticleEarth.jsx

EARTH.particleSize => 地球本体の1粒の大きさ ：components/CategorySpace/ParticleEarth.jsx

EARTH.oceanParticleSize => 海の追加粒子の大きさ ：components/CategorySpace/ParticleEarth.jsx

EARTH.formationDuration => 地球がバラバラの粒子から完成するまでの時間。単位はms ：components/CategorySpace/ParticleEarth.jsx

EARTH.rotationSpeed => 完成後も含めた地球の回転速度 ：components/CategorySpace/ParticleEarth.jsx

EARTH.gridParticleSize => 地球上のグリッド粒子サイズ ：components/CategorySpace/ParticleEarth.jsx

EARTH.gridParticleCount => 地球上のグリッド粒子数 ：components/CategorySpace/ParticleEarth.jsx

oceanColor => 地球の海部分の色 ：components/CategorySpace/ParticleEarth.jsx

landColor => 地球の陸地部分の色 ：components/CategorySpace/ParticleEarth.jsx

createGridParticles() => 地球上のグリッド状Particleを生成する ：components/CategorySpace/ParticleEarth.jsx
グリッドそのものの形・本数・配置方法を変更するときに修正する

createOceanParticles() => 海用の追加Particleを生成する ：components/CategorySpace/ParticleEarth.jsx
海の粒子配置・形成方法を変更するときに修正する

createParticleEarth() => Particle Earth本体・海・グリッドをまとめて生成する ：components/CategorySpace/ParticleEarth.jsx
地球全体の構成を変更するときに修正する

rotationAxis => 地球がどの方向を軸として回転するか ：components/CategorySpace/ParticleEarth.jsx
new THREE.Vector3(0.4, 1, 0)のX/Y/Z比率を変更すると回転軸の傾きを変更できる

<!-- ---------------------------------- - ---------------------------------- -->

>共通Particle Texture(createParticleTexture.js)


createParticleTexture() => 星・カテゴリー・リングで共有する白い丸型Particle Textureを生成する ：components/CategorySpace/createParticleTexture.js
SVGのcircleを変更すると、共通Particleの基本形状を丸以外へ変更できる

<circle ... /> => Particle Textureの形 ：components/CategorySpace/createParticleTexture.js
SVG要素そのものを変更すると粒子のシルエットを変更できる

<!-- ---------------------------------- - ---------------------------------- -->

>ロゴ(CategorySpace.jsx)


w-40 / sm:w-56 / md:w-64 / lg:w-72 / xl:w-80 => 画面サイズごとのロゴ横幅 ：components/CategorySpace/CategorySpace.jsx

top-3 => ロゴの上からの位置 ：components/CategorySpace/CategorySpace.jsx

left-1/2 + -translate-x-1/2 => ロゴを画面中央に配置する ：components/CategorySpace/CategorySpace.jsx

<!-- ---------------------------------- - ---------------------------------- -->

>パフォーマンス調整(categorySpaceConfig.js / ParticleEarth.js / CategorySpace.jsx)


SPACE.starCount => 下げると背景星の描画負荷を減らせる ：components/CategorySpace/categorySpaceConfig.js

PARTICLE_SPHERE.particleCount => 下げると7個のカテゴリー球の描画負荷を減らせる ：components/CategorySpace/categorySpaceConfig.js

CONNECTION.particleCount => 下げると軌道リングの描画負荷を減らせる ：components/CategorySpace/categorySpaceConfig.js

EARTH.particleCount / EARTH.oceanParticleCount / EARTH.gridParticleCount => 下げるとParticle Earthの描画・生成負荷を減らせる ：components/CategorySpace/ParticleEarth.jsx

renderer.setPixelRatio() => Three.jsの描画解像度上限 ：components/CategorySpace/CategorySpace.jsx
現在のMath.min(window.devicePixelRatio, 2)は高DPI画面でも最大2倍に制限してGPU負荷を抑えている

<!-- ---------------------------------- - ---------------------------------- -->