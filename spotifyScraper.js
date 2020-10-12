// - view a playlist WITH open.spotify.com
// - change TOTAL_NUMBER to the number of songs in the playlist
// - paste the following function into the console
// - scroll about until the console outputs the tracks as json

;(function () {
  const TOTAL_NUMBER = 39

  const tracks = new Array(TOTAL_NUMBER + 1).fill(null)

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
      if (tracksSoFar < TOTAL_NUMBER && tracksSoFar >= TOTAL_NUMBER * 0.9) {
        const missingTracks = Object.keys(tracks)
          .slice(1)
          .filter((key) => !tracks[key])
        console.log(`MISSING TRACK #s: ${missingTracks.join()}`)
      }
    }
    if (tracksSoFar >= TOTAL_NUMBER) {
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
