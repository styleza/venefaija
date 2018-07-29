import Atom from 'bacon.atom'
import Bacon from 'baconjs'
import Store from 'store'
import _ from 'lodash'
import api from './api'
import * as L from 'partial.lenses'
const COG = 'COG';

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
const settings = Atom(_.assign(defaultSettings, _.omit(window.INITIAL_SETTINGS, ['charts']) || {}, fromLocalStorage))


const chartProviders = Bacon.fromArray(charts)
  .flatMap(provider => {
    switch (provider.type) {
      case 'local':
        return fetchLocalCharts(provider, fromLocalStorage.hiddenChartProviders)
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

function fetchLocalCharts(provider, hiddenChartProviders) {
  const url = process.env.REACT_APP_CHART_SERVER_URL+'/charts/'
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

export default settings
