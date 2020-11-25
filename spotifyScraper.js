// - view a playlist WITH open.spotify.com
// - paste the following function into the console
// - scroll about until the console outputs the tracks as json
// - Note: CLASS may get outdated

;(function () {
  const CLASS = "f6a6c11d18da1af699a0464367e2189a-scss"
  
  const totalNumber = document.querySelector(`[class="${CLASS}"]`).innerHTML.split(" songs")[0]

  const tracks = new Array(totalNumber + 1).fill(null)

  function addTracks() {
    document.querySelectorAll(`[data-testid="tracklist-row"]`).forEach((el) => {
      const values = []
      const index = parseInt(
        el.querySelector(`[aria-colindex="1"]`).textContent
      )
      if (!index) return // should filter out other tables like Recommended Songs
      el.querySelectorAll(`[aria-colindex="2"] span[class=""]`).forEach(
        (spanEl) => {
          const text = spanEl.textContent
          if (text) values.push(text)
        }
      )
      const [name, artist] = values
      const album = el.querySelector(`[aria-colindex="3"]`).textContent
      const track = { index, name, artist, album }
      tracks[index] = track
    })
  }

  function copyToClipboard(text) {
    var dummy = document.createElement('textarea')
    document.body.appendChild(dummy)
    dummy.value = text
    dummy.select()
    document.execCommand('copy')
    document.body.removeChild(dummy)
  }

  let ii = 0
  const INTERVAL_MS = 200
  const interval = setInterval(function () {
    ii++
    if (ii > 10000 / INTERVAL_MS && ii % (5000 / INTERVAL_MS) === 0) {
      console.log(`Call exportTracks() to terminate scraper early and export`)
    }
    addTracks()
    const tracksSoFar = tracks.filter(Boolean).length
    if (ii % (1000 / INTERVAL_MS) === 0) {
      console.log(`TRACKS SCRAPED SO FAR: ${tracksSoFar}`)
      if (tracksSoFar < totalNumber && tracksSoFar >= totalNumber * 0.9) {
        const missingTracks = Object.keys(tracks)
          .slice(1)
          .filter((key) => !tracks[key])
        console.log(`MISSING TRACK #s: ${missingTracks.join()}`)
      }
    }
    if (tracksSoFar >= totalNumber) {
      exportTracks()
    }
  }, 200)

  function exportTracks() {
    clearInterval(interval)
    const json = JSON.stringify(tracks.filter(Boolean), null, 2)
    console.log(json)
    copyToClipboard(json)
  }
  window.exportTracks = exportTracks
})()