let fs = require('fs')
const path_target = "H:\\Steam\\steamapps\\common\\Summer Memories\\www\\data"
const path_censored = "H:\\Steam\\steamapps\\common\\Summer Memories\\www_censored\\data"
const path_uncensored = "H:\\Steam\\steamapps\\common\\Summer Memories\\www_uncensored\\data"
const regex = /_0\d+|フェラカットイン\(美雪\)_\d|Blow cut-in \(Miyuki\)_\d$/i
const mapsCount = 119

replaceEvents()

function replaceEvents() {
  let eventsMap = getEventsMap()
  fs.writeFileSync(`2.02.new.json`, JSON.stringify(eventsMap), 'utf8')
  let json = JSON.parse(fs.readFileSync(`${path_censored}\\CommonEvents.json`, 'utf8'))
  replaceCommon(json, eventsMap)
  fs.writeFileSync(`${path_target}\\CommonEvents.json`, JSON.stringify(json), 'utf8')

  for (let i = 1; i < mapsCount; i++) {
    const fileIndex = i.toString().padStart(3, '0')
    let json = JSON.parse(fs.readFileSync(`${path_censored}\\Map${fileIndex}.json`, 'utf8'))

    replaceMap(json, eventsMap)
    fs.writeFileSync(`${path_target}\\Map${fileIndex}.json`, JSON.stringify(json), 'utf8')
  }
}

function getEventsMap() {
  let commonEventsData_censored = JSON.parse(fs.readFileSync(`${path_censored}\\CommonEvents.json`, 'utf8'))
  let commonEventsData_uncensored = JSON.parse(fs.readFileSync(`${path_uncensored}\\CommonEvents.json`, 'utf8'))

  let commonEventsJson_censored = getCommonEvents(commonEventsData_censored)
  let commonEventsJson_uncensored = getCommonEvents(commonEventsData_uncensored)

  let eventsSet_censored = commonEventsJson_censored
  let eventsSet_uncensored = commonEventsJson_uncensored

  for (let i = 1; i < mapsCount; i++) {
    const fileIndex = i.toString().padStart(3, '0')
    let mapData_censored = JSON.parse(fs.readFileSync(`${path_censored}\\Map${fileIndex}.json`, 'utf8'))
    let mapData_uncensored = JSON.parse(fs.readFileSync(`${path_uncensored}\\Map${fileIndex}.json`, 'utf8'))

    let mapJson_censored = getMapEvents(mapData_censored)
    let mapJson_uncensored = getMapEvents(mapData_uncensored)

    eventsSet_censored = new Set([...eventsSet_censored, ...mapJson_censored])
    eventsSet_uncensored = new Set([...eventsSet_uncensored, ...mapJson_uncensored])
  }

  let eventsMap = {}
  const events_censored = [...eventsSet_censored]
  const events_uncensored = [...eventsSet_uncensored]
  for (let i = 0; i < events_censored.length; i++) {
    eventsMap[events_censored[i]] = events_uncensored[i]
  }

  console.log(eventsMap);
  return eventsMap
}

function getCommonEvents(json) {
  let eventsSet = new Set()

  json.forEach(obj => {
    if (obj != undefined && obj.list) {
      obj.list.forEach(item => {
        if (item.parameters.length && isImageName(item.parameters[1])) {
          eventsSet.add(item.parameters[1])
        }
      })
    }
  })

  return eventsSet
}

function getMapEvents(json) {
  let eventsSet = new Set()

  json.events.forEach(event => {
    if (event) {
      event.pages.forEach(page => {
        page.list.forEach(item => {
          if (item.parameters.length && isImageName(item.parameters[1])) {
            eventsSet.add(item.parameters[1])
          }
        })
      })
    }
  })

  return eventsSet
}

function isImageName(string) {
  return regex.test(string) && !/表情H/.test(string)
}

function replaceCommon(json, map) {
  json.forEach(obj => {
    if (obj != undefined && obj.list) {
      obj.list.forEach(item => {
        if (item.parameters.length > 1 && isImageName(item.parameters[1])) {
          item.parameters[1] = map[item.parameters[1]]
        }
      })
    }
  })
}

function replaceMap(json, map) {
  json.events.forEach(event => {
    if (event) {
      event.pages.forEach(page => {
        page.list.forEach(item => {
          if (item.parameters.length > 1 && isImageName(item.parameters[1])) {
            item.parameters[1] = map[item.parameters[1]]
          }
        })
      })
    }
  })
}