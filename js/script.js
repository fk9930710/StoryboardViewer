let shots = []
let currentShot = null
let diagramVisible = false

// ========================
// DOM
// ========================

const shotList =
  document.getElementById('shotList')

const mainImage =
  document.getElementById('mainImage')

const diagramOverlay =
  document.getElementById('diagramOverlay')

const diagramImage =
  document.getElementById('diagramImage')

const sceneTitle =
  document.getElementById('sceneTitle')

const shotType =
  document.getElementById('shotType')

const duration =
  document.getElementById('duration')

const cameraMovement =
  document.getElementById('cameraMovement')

const scene =
  document.getElementById('scene')

const description =
  document.getElementById('description')

const action =
  document.getElementById('action')

const edit =
  document.getElementById('edit')

const dialogue =
  document.getElementById('dialogue')

const prompt =
  document.getElementById('prompt')

const allShotsView =
  document.getElementById('allShotsView')

const allShotsButton =
  document.getElementById('allShotsButton')

const singleShotView =
  document.getElementById('singleShotView')


// ========================
// PATHS
// ========================

function getImagePath(shotId) {

  return `./images/${shotId.toLowerCase()}.png`

}

function getDiagramPath(shotId) {

  return `./diagrams/${shotId.toLowerCase()}.png`

}


// ========================
// IMAGE
// ========================

function setImageWithFallback(imgElement, src) {

  imgElement.onerror = () => {

    imgElement.src =
      './images/placeholder.jpg'

  }

  imgElement.src =
    `${src}?t=${Date.now()}`

}


// ========================
// LOAD SHOTS
// ========================

async function loadShots() {

  const manifestRes =
    await fetch('./shots/manifest.json')

  const manifest =
    await manifestRes.json()

  const shotPromises =
    manifest.map(async (fileName) => {

      const res =
        await fetch(`./shots/${fileName}.json`)

      return await res.json()

    })

  shots =
    await Promise.all(shotPromises)

  renderSidebar()

  if (shots.length > 0) {
    renderShot(shots[0])
  }

}


// ========================
// SIDEBAR
// ========================

function renderSidebar() {

  shotList.innerHTML = ''

  shots.forEach((shot, index) => {

    const item =
      document.createElement('button')

    item.className = `
      w-full
      text-left
      px-3
      py-2
      rounded-lg
      text-sm
      hover:bg-zinc-800
      transition
    `

    item.innerHTML = `
      <div class="font-medium tracking-wide">
        ${shot.id}
      </div>
    `

    item.onclick = () => {

      document
        .querySelectorAll('#shotList button')
        .forEach(btn =>
          btn.classList.remove('shot-active')
        )

      item.classList.add('shot-active')

      allShotsView.classList.add('hidden')

      singleShotView.classList.remove('hidden')

      renderShot(shot)

    }

    shotList.appendChild(item)

    if (index === 0) {
      item.classList.add('shot-active')
    }

  })

}


// ========================
// RENDER SHOT
// ========================

function renderShot(shot) {

  currentShot = shot

  setImageWithFallback(
    mainImage,
    getImagePath(shot.id)
  )

  sceneTitle.textContent =
    shot.id || ''

  shotType.textContent =
    shot.shotType || '-'

  duration.textContent =
    shot.duration || '-'

  cameraMovement.textContent =
    shot.cameraMovement || '-'

  scene.textContent =
    shot.scene || '-'

  description.value =
    shot.description || ''

  action.value =
    shot.action || ''

  edit.value =
    shot.edit || ''

  dialogue.value =
    shot.dialogue || ''

  prompt.value =
    shot.prompt || ''

}


// ========================
// ALL SHOTS
// ========================

function renderAllShots() {

  allShotsView.innerHTML = ''

  singleShotView.classList.add('hidden')

  allShotsView.classList.remove('hidden')

  shots.forEach(shot => {

    const card =
      document.createElement('div')

    card.className =
      'shot-card'

    card.innerHTML = `
      <img
        src="${getImagePath(shot.id)}"
      />

      <div class="shot-card-title">
        ${shot.id}
      </div>
    `

    card.onclick = () => {

      allShotsView.classList.add('hidden')

      singleShotView.classList.remove('hidden')

      renderShot(shot)

    }

    allShotsView.appendChild(card)

  })

}

allShotsButton.addEventListener(
  'click',
  renderAllShots
)


// ========================
// DIAGRAM OVERLAY
// ========================

mainImage.addEventListener('click', () => {

  if (!currentShot) return

  const path =
    `${getDiagramPath(currentShot.id)}?v=${Date.now()}`

  if (diagramVisible) {

    diagramOverlay.classList.add('hidden')

    diagramOverlay.classList.remove('flex')

    diagramVisible = false

    return

  }

  diagramImage.onload = () => {

    diagramOverlay.classList.remove('hidden')

    diagramOverlay.classList.add('flex')

    diagramVisible = true

  }

  diagramImage.onerror = () => {

    diagramVisible = false

  }

  diagramImage.src =
    path

})

diagramOverlay.addEventListener('click', () => {

  diagramOverlay.classList.add('hidden')

  diagramOverlay.classList.remove('flex')

  diagramVisible = false

})


// ========================
// START
// ========================

loadShots()
