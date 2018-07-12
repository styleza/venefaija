import Atom from 'bacon.atom'
import Bacon from 'baconjs'
import Store from 'store'
import _ from 'lodash'
import api from './api'
import * as L from 'partial.lenses'
const COG = 'COG';
const MAX_ZOOM = 16;
const MIN_ZOOM = 6;
const EXTENSION_LINE_OFF = 'Off';

const LOCAL_STORAGE_KEY = 'plotter-settings'
const defaultSettings = {
  zoom: 13,
  fullscreen: false,
  drawMode: false,
  course: COG,
  follow: true,
  showMenu: false,
  extensionLine: '5 min',
  showInstruments: true,
  ais: {
    enabled: false
  },
  worldBaseChart: true,
  chartProviders: [],
  loadingChartProviders: true,
  data: [],
}

const fromLocalStorage = Store.get(LOCAL_STORAGE_KEY) || {}

const charts = _.get(window.INITIAL_SETTINGS, 'charts', [])
console.log(charts);
const settings = Atom(_.assign(defaultSettings, _.omit(window.INITIAL_SETTINGS, ['charts']) || {}, fromLocalStorage))


const chartProviders = Bacon.fromArray(charts)
  .flatMap(provider => {
    switch (provider.type) {
      case 'local':
        return fetchLocalCharts(provider, fromLocalStorage.hiddenChartProviders)
      case 'signalk':
        return fetchSignalKCharts(provider, fromLocalStorage.hiddenChartProviders)
      default:
        return Bacon.once(provider)
    }
  })
  .fold([], _.concat)


chartProviders.onValue(charts => {
  settings.view(L.prop('chartProviders')).set(charts)
  settings.view(L.prop('loadingChartProviders')).set(false)
})

chartProviders.onError(e => {
  console.error('Error fetching chart providers')
  console.error(e)
})

settings
  .map(v => {
    const hiddenChartProviders = v.chartProviders ? _.filter(v.chartProviders, p => !p.enabled) : []
    return Object.assign({}, v, {hiddenChartProviders: _.map(hiddenChartProviders, 'id')})
  })
  .map(v => _.omit(v, ['chartProviders', 'drawMode', 'data', 'loadingChartProviders', 'zoom']))
  .skipDuplicates((a, b) => JSON.stringify(a) === JSON.stringify(b))
  .onValue(v => {
    Store.set(LOCAL_STORAGE_KEY, v)
  })

console.log("SETTINGSIT:");
console.log(settings);
function fetchLocalCharts(provider, hiddenChartProviders) {
  const url = 'http://192.168.0.192:4999/charts/'
  let z = api
    .get({url})
    .map(_.values)
    .flatMap(charts => {
      return Bacon.fromArray(
        _.map(charts, chart => {
          const from = _.pick(chart, [
            'tilemapUrl',
            'index',
            'type',
            'name',
            'minzoom',
            'maxzoom',
            'center',
            'description',
            'format',
            'bounds'
          ])
          let y= _.merge(
            {
              id: chart.name,
              index: provider.index || 0,
              enabled: true
            },
            from
          );
          return y;
        })
      )
    })

  return z;
}

function fetchSignalKCharts(provider, hiddenChartProviders) {
  const address = parseChartProviderAddress(provider.address)
  const url = `${address}/signalk/v1/api/resources/charts`
  return api
    .get({url})
    .map(_.values)
    .flatMap(charts => {
      return Bacon.fromArray(
        _.map(charts, chart => {
          const tilemapUrl = address + chart.tilemapUrl
          const from = _.pick(chart, [
            'type',
            'name',
            'minzoom',
            'maxzoom',
            'center',
            'description',
            'format',
            'bounds'
          ])
          return _.merge(
            {
              id: chart.name,
              tilemapUrl,
              minzoom: MIN_ZOOM,
              maxzoom: MAX_ZOOM,
              index: provider.index || 0,
              enabled: !isChartHidden(hiddenChartProviders, chart.name)
            },
            from
          )
        })
      )
    })
}

const isChartHidden = (hiddenChartProviders, requestedChartId) => {
  return !!_.find(hiddenChartProviders, id => id === requestedChartId)
}

function parseChartProviderAddress(address) {
  if (_.isEmpty(address)) {
      console.log('neeger');
    throw 'Empty chart provider address!'
  }
  if (_.isEmpty(address.split(':')[0])) {
    // Relative address such as ':80'
    return `${window.location.protocol}//${window.location.hostname}:4999}`
  } else {
    return 'http://192.168.0.192:4999/charts'
  }
}

function clearSettingsFromLocalStorage() {
  Store.remove(LOCAL_STORAGE_KEY)
}
export default settings
