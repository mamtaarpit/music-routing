'use strict'

const { parentPort } = require('worker_threads')

const individualTrack = require('music-routes-data/data/individual_track.json')

let tracks = []
let individuals = []

parentPort.on('message', (msg) => {
  if (msg === 'next') {
    getNextBfsStepResults(tracks, individuals)
  } else {
    // If not 'next', then initializing.
    tracks = [getTracksForIndividual(msg)]
    individuals = [new Set([msg])]
  }
  parentPort.postMessage({ tracks, individuals })
})

function getNextBfsStepResults (tracks, individuals) {
  const currTracks = tracks[tracks.length - 1]
  const currIndividuals = individuals[individuals.length - 1]
  const resultTracks = new Set(currTracks)
  const resultIndividuals = new Set(currIndividuals)
  currTracks.forEach((trackId) => {
    const individuals = getIndividualsForTrack(trackId)
    individuals.forEach((individualId) => {
      if (currIndividuals.has(individualId)) {
        return
      }
      resultIndividuals.add(individualId)
      getTracksForIndividual(individualId).forEach((val) => resultTracks.add(val))
    })
  })
  tracks.push(resultTracks)
  individuals.push(resultIndividuals)
}

function getTracksForIndividual (individualId) {
  return new Set(individualTrack.filter((val) => val.individual_id === individualId).map((val) => val.track_id))
}

function getIndividualsForTrack (trackId) {
  return new Set(individualTrack.filter((val) => val.track_id === trackId).map((val) => val.individual_id))
}
