let fs = require('fs')
const path_target = "H:\\Steam\\steamapps\\common\\Succumate\\www\\data"
const path_censored = "H:\\Steam\\steamapps\\common\\Succumate\\www_censored\\data"
const path_uncensored = "H:\\Steam\\steamapps\\common\\Succumate\\www_uncensored\\data"
const regex = /_00\d+/

replaceEvents()

function replaceEvents() {
  const eventsMap = getEventsMap()
  let json = JSON.parse(fs.readFileSync(`${path_censored}\\CommonEvents.json`, 'utf8'))
  replaceCommon(json, eventsMap)
  fs.writeFileSync(`${path_target}\\CommonEvents.json`, JSON.stringify(json), 'utf8')

  for (let i = 1; i < 65; i++) {
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

  let map = {}
  for (let i = 0; i < commonEventsJson_censored.length; i++) {
    map[commonEventsJson_censored[i]] = commonEventsJson_uncensored[i]
  }

  for (let i = 1; i < 65; i++) {
    const fileIndex = i.toString().padStart(3, '0')
    let mapData_censored = JSON.parse(fs.readFileSync(`${path_censored}\\Map${fileIndex}.json`, 'utf8'))
    let mapData_uncensored = JSON.parse(fs.readFileSync(`${path_uncensored}\\Map${fileIndex}.json`, 'utf8'))

    let mapJson_censored = getMapEvents(mapData_censored)
    let mapJson_uncensored = getMapEvents(mapData_uncensored)

    for (let i = 0; i < mapJson_censored.length; i++) {
      map[mapJson_censored[i]] = mapJson_uncensored[i]
    }
  }

  return map
}

function getCommonEvents(json) {
  let result = []

  json.forEach(obj => {
    if (obj != undefined && obj.list) {
      obj.list.forEach(item => {
        if (item.parameters.length > 1 && regex.test(item.parameters[1])) {
          result.push(item.parameters[1])
        }
      })
    }
  })

  return result
}

function getMapEvents(json) {
  let result = []

  json.events.forEach(event => {
    if (event) {
      event.pages.forEach(page => {
        page.list.forEach(item => {
          if (item.parameters.length > 1 && regex.test(item.parameters[1])) {
            result.push(item.parameters[1])
          }
        })
      })
    }
  })

  return result
}

function replaceCommon(json, map) {
  json.forEach(obj => {
    if (obj != undefined && obj.list) {
      obj.list.forEach(item => {
        if (item.parameters.length > 1 && regex.test(item.parameters[1])) {
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
          if (item.parameters.length > 1 && regex.test(item.parameters[1])) {
            item.parameters[1] = map[item.parameters[1]]
          }
        })
      })
    }
  })
}